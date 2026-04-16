// lib/supabase/types.ts
// ─────────────────────────────────────────────────────────────
// Database type definitions — mirip output `supabase gen-types`
// Setelah deploy schema, generate ulang dengan:
//   npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts
// ─────────────────────────────────────────────────────────────

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type ArticleStatus      = 'draft' | 'review' | 'scheduled' | 'published' | 'rejected'
export type VerificationStatus = 'unverified' | 'partial' | 'verified' | 'developing'
export type AuthorType         = 'ai' | 'editor' | 'contributor'
export type SourceType         = 'media' | 'official' | 'press_release' | 'social'
export type WorkflowRunType    = 'daily_main' | 'daily_noon' | 'daily_evening' | 'breaking' | 'manual'
export type WorkflowRunStatus  = 'running' | 'completed' | 'failed' | 'partial'
export type WorkflowLogLevel   = 'info' | 'warn' | 'error' | 'success'
export type SourceStatus       = 'pending' | 'processed' | 'rejected'
export type UserRole           = 'superadmin' | 'editor' | 'reviewer' | 'writer'
export type UserStatus         = 'active' | 'inactive' | 'suspended'

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['tags']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['tags']['Insert']>
      }
      articles: {
        Row: {
          id: string
          title: string
          alternative_titles: string[]
          slug: string
          excerpt: string
          meta_title: string
          meta_description: string
          focus_keyword: string
          related_keywords: string[]
          category_id: string
          cover_image_url: string
          cover_image_prompt: string
          cover_image_alt: string
          article_text: string
          article_html: string
          bullet_points: string[]
          why_it_matters: string
          next_to_watch: string
          verification_status: VerificationStatus
          originality_score: number
          readability_score: number
          seo_score: number
          factual_consistency_score: number
          duplication_risk_score: number
          publish_readiness_score: number
          status: ArticleStatus
          author_type: AuthorType
          author_label: string
          editor_id: string | null
          editor_name: string | null
          is_breaking: boolean
          is_featured: boolean
          is_trending: boolean
          word_count: number
          reading_time: number
          canonical_url: string
          scheduled_at: string | null
          published_at: string | null
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['articles']['Row'], 'id' | 'created_at' | 'updated_at' | 'view_count'> & { id?: string; view_count?: number }
        Update: Partial<Database['public']['Tables']['articles']['Insert']>
      }
      article_tags: {
        Row: { article_id: string; tag_id: string }
        Insert: Database['public']['Tables']['article_tags']['Row']
        Update: Partial<Database['public']['Tables']['article_tags']['Row']>
      }
      article_sources: {
        Row: {
          id: string
          article_id: string
          name: string
          url: string
          source_type: SourceType
          trust_score: number
          published_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['article_sources']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['article_sources']['Insert']>
      }
      ingested_sources: {
        Row: {
          id: string
          source_name: string
          source_type: SourceType
          home_url: string
          article_url: string
          article_title: string
          fetched_summary: string
          published_at_source: string | null
          fetched_at: string
          trust_score: number
          verification_level: string
          notes: string | null
          status: SourceStatus
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ingested_sources']['Row'], 'id' | 'created_at' | 'fetched_at'> & { id?: string; fetched_at?: string }
        Update: Partial<Database['public']['Tables']['ingested_sources']['Insert']>
      }
      workflow_runs: {
        Row: {
          id: string
          run_type: WorkflowRunType
          status: WorkflowRunStatus
          started_at: string
          completed_at: string | null
          sources_ingested: number
          topics_clustered: number
          articles_generated: number
          articles_published: number
          articles_reviewed: number
          articles_rejected: number
          errors: string[]
        }
        Insert: Omit<Database['public']['Tables']['workflow_runs']['Row'], 'id' | 'started_at'> & { id?: string; started_at?: string }
        Update: Partial<Database['public']['Tables']['workflow_runs']['Insert']>
      }
      workflow_logs: {
        Row: {
          id: string
          workflow_run_id: string
          timestamp: string
          step: string
          message: string
          level: WorkflowLogLevel
        }
        Insert: Omit<Database['public']['Tables']['workflow_logs']['Row'], 'id' | 'timestamp'> & { id?: string; timestamp?: string }
        Update: Partial<Database['public']['Tables']['workflow_logs']['Insert']>
      }
      trending_topics: {
        Row: {
          id: string
          title: string
          slug: string
          hotness: number
          article_count: number
          category: string
          keywords: string[]
          last_updated: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['trending_topics']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['trending_topics']['Insert']>
      }
      admin_users: {
        Row: {
          id: string
          name: string
          email: string
          role: UserRole
          status: UserStatus
          articles_published: number
          articles_reviewed: number
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['admin_users']['Insert']>
      }
      site_settings: {
        Row: {
          id: number
          site_name: string
          tagline: string
          site_url: string
          admin_email: string
          articles_per_page: number
          auto_publish_threshold: number
          review_threshold: number
          reject_threshold: number
          daily_run_enabled: boolean
          daily_run_times: string[]
          breaking_news_enabled: boolean
          wordpress_config: Json
          ad_slots_config: Json
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['site_settings']['Row']>
        Update: Partial<Database['public']['Tables']['site_settings']['Row']>
      }
    }
    Views: {
      admin_stats: {
        Row: {
          today_published: number | null
          pending_review: number | null
          processing: number | null
          scheduled: number | null
          total_articles: number | null
          avg_quality_score: number | null
        }
      }
      articles_with_category: {
        Row: Database['public']['Tables']['articles']['Row'] & {
          category_name: string
          category_slug: string
          category_color: string
        }
      }
    }
    Functions: Record<string, never>
  }
}
