// ============================================
// KabarKini — POST /api/articles/generate
// Generate a single article from a topic
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { generateArticle, clusterTopics, ingestSources, preFilterSources } from '@/lib/workflow/pipeline'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { topic, category, sources: customSources } = body

    if (!topic) {
      return NextResponse.json({ error: 'topic is required' }, { status: 400 })
    }

    // Use provided sources or auto-ingest
    const rawSources = customSources || preFilterSources(ingestSources())
    const clusters = clusterTopics(rawSources)

    // Find or create a cluster for this topic
    let targetCluster = clusters.find((c) =>
      c.topicTitle.toLowerCase().includes(topic.toLowerCase()) ||
      c.keywords.some((k) => topic.toLowerCase().includes(k))
    )

    if (!targetCluster) {
      // Create a manual cluster from the topic
      targetCluster = {
        id: `manual-${Date.now()}`,
        topicTitle: topic,
        keywords: topic.split(' ').filter((w: string) => w.length > 4).slice(0, 5),
        sources: rawSources.slice(0, 3),
        hotnessScore: 75,
        category: category || 'sosial',
        isBreaking: false,
      }
    }

    const article = await generateArticle(targetCluster)

    return NextResponse.json({ success: true, article })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
