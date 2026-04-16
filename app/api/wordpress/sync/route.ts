// ============================================
// KabarKini — POST /api/wordpress/sync
// Sync one or multiple articles to WordPress
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { syncArticleToWordPress, testWordPressConnection } from '@/lib/workflow/wordpress-sync'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, article, config } = body

    if (!config?.siteUrl || !config?.username || !config?.applicationPassword) {
      return NextResponse.json(
        { error: 'WordPress config (siteUrl, username, applicationPassword) is required' },
        { status: 400 }
      )
    }

    // Test connection
    if (action === 'test') {
      const testResult = await testWordPressConnection(config)
      return NextResponse.json(testResult)
    }

    // Sync article
    if (action === 'sync' && article) {
      const result = await syncArticleToWordPress(article, config)
      return NextResponse.json(result)
    }

    return NextResponse.json(
      { error: 'action must be: test | sync. For sync, article is required.' },
      { status: 400 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
