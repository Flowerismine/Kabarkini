// app/api/articles/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import {
  runDailyPipeline,
  generateArticle,
  clusterTopics,
  ingestSources,
  preFilterSources,
  type GeneratedArticle,
  type PipelineLog,
} from '@/lib/workflow/pipeline'

async function writeLog(
  supabase: ReturnType<typeof createAdminClient>,
  runId: string,
  log: PipelineLog
) {
  await supabase.from('workflow_logs').insert({
    workflow_run_id: runId,
    step:            log.step,
    message:         log.message,
    level:           log.level,
    timestamp:       log.timestamp,
  })
}

async function saveArticle(
  supabase: ReturnType<typeof createAdminClient>,
  article: GeneratedArticle,
  categoryId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from('articles')
    .insert({
      title:                     article.title,
      alternative_titles:        article.alternativeTitles,
      slug:                      article.slug + '-' + Date.now(),
      excerpt:                   article.excerpt,
      meta_title:                article.metaTitle,
      meta_description:          article.metaDescription,
      focus_keyword:             article.focusKeyword,
      related_keywords:          article.relatedKeywords,
      category_id:               categoryId,
      cover_image_url:           article.coverImageUrl,       // ← simpan foto
      cover_image_alt:           article.coverImageAlt || article.title,
      cover_image_prompt:        article.coverImagePrompt,
      article_text:              article.articleText,
      article_html:              article.articleHtml,
      bullet_points:             article.bulletPoints,
      why_it_matters:            article.whyItMatters,
      next_to_watch:             article.nextToWatch,
      verification_status:       article.verificationStatus,
      originality_score:         article.originalityScore,
      readability_score:         article.readabilityScore,
      seo_score:                 article.seoScore,
      factual_consistency_score: article.factualConsistencyScore,
      duplication_risk_score:    article.duplicationRiskScore,
      publish_readiness_score:   article.publishReadinessScore,
      status:                    article.status,
      author_type:               'ai',
      author_label:              'AI News Desk',
      is_breaking:               false,
      word_count:                article.articleText.split(/\s+/).length,
      published_at:              article.status === 'published' ? new Date().toISOString() : null,
    })
    .select('id')
    .single()

  if (error || !data) return null

  if (article.sources.length > 0) {
    await supabase.from('article_sources').insert(
      article.sources.map(src => ({
        article_id:  data.id,
        name:        src.name,
        url:         src.url,
        source_type: src.type || 'media',
        trust_score: 80,
      }))
    )
  }
  return data.id
}

async function resolveCategoryId(
  supabase: ReturnType<typeof createAdminClient>,
  categorySlug: string
): Promise<string> {
  const { data } = await supabase
    .from('categories').select('id').eq('slug', categorySlug).single()
  if (data?.id) return data.id
  const { data: first } = await supabase
    .from('categories').select('id').limit(1).single()
  return first?.id ?? ''
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { runId, runType = 'manual', topics = '' } = body
  const supabase = createAdminClient()

  let autoPublishThreshold = 85
  let reviewThreshold      = 70
  let maxArticles          = 8

  const { data: settings } = await supabase
    .from('site_settings')
    .select('auto_publish_threshold, review_threshold, articles_per_page')
    .eq('id', 1).single()

  if (settings) {
    autoPublishThreshold = settings.auto_publish_threshold ?? 85
    reviewThreshold      = settings.review_threshold      ?? 70
    maxArticles          = settings.articles_per_page     ?? 8
  }

  try {
    if (runType === 'manual' && topics) {
      const topicList  = topics.split(',').map((t: string) => t.trim()).filter(Boolean)
      const rawSources = preFilterSources(await ingestSources())
      const clusters   = clusterTopics(rawSources)
      let published = 0, inReview = 0, rejected = 0

      for (const topic of topicList.slice(0, maxArticles)) {
        const log = (step: string, msg: string, level: PipelineLog['level'] = 'info') =>
          writeLog(supabase, runId, { timestamp: new Date().toISOString(), step, message: msg, level })

        await log('Article Generation', `Menulis artikel manual: "${topic}"`)

        let cluster = clusters.find(c =>
          c.topicTitle.toLowerCase().includes(topic.toLowerCase()) ||
          c.keywords.some(k => topic.toLowerCase().includes(k))
        )

        if (!cluster) {
          cluster = {
            id:           `manual-${Date.now()}`,
            topicTitle:   topic,
            keywords:     topic.split(' ').filter((w: string) => w.length > 3).slice(0, 5),
            sources:      rawSources.slice(0, 3),
            hotnessScore: 75,
            category:     'sosial',
            isBreaking:   false,
          }
        }

        const article = await generateArticle(cluster)
        const catId   = await resolveCategoryId(supabase, article.category)
        await saveArticle(supabase, article, catId)

        if (article.publishReadinessScore >= autoPublishThreshold)    published++
        else if (article.publishReadinessScore >= reviewThreshold)    inReview++
        else                                                           rejected++

        await log('Publish', `Artikel "${article.title.slice(0, 60)}" disimpan (${article.status})`, 'success')
      }

      if (runId) {
        await supabase.from('workflow_runs').update({
          status:             'completed',
          completed_at:       new Date().toISOString(),
          articles_generated: topicList.length,
          articles_published: published,
          articles_reviewed:  inReview,
          articles_rejected:  rejected,
        }).eq('id', runId)
      }

    } else {
      const result = await runDailyPipeline({
        runType:              runType as 'daily_main' | 'breaking' | 'manual',
        maxArticles,
        autoPublishThreshold,
        reviewThreshold,
      })

      if (runId) {
        for (const log of result.logs) await writeLog(supabase, runId, log)
      }

      for (const article of result.articles) {
        const catId = await resolveCategoryId(supabase, article.category)
        await saveArticle(supabase, article, catId)
      }

      if (runId) {
        await supabase.from('workflow_runs').update({
          status:             result.errors.length === 0 ? 'completed' : 'partial',
          completed_at:       result.completedAt,
          sources_ingested:   result.sourcesIngested,
          topics_clustered:   result.topicsClustered,
          articles_generated: result.articlesGenerated,
          articles_published: result.articlesPublished,
          articles_reviewed:  result.articlesInReview,
          articles_rejected:  result.articlesRejected,
          errors:             result.errors,
        }).eq('id', runId)
      }
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (runId) {
      await supabase.from('workflow_runs').update({
        status: 'failed', completed_at: new Date().toISOString(), errors: [message],
      }).eq('id', runId)
      await supabase.from('workflow_logs').insert({
        workflow_run_id: runId, step: 'Workflow',
        message: `Pipeline gagal: ${message}`, level: 'error',
      })
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
