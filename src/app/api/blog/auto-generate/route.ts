import { NextRequest, NextResponse } from 'next/server';

/**
 * Automated Blog Generation Endpoint
 * 
 * This endpoint triggers daily automated blog post generation.
 * It internally calls the /api/blog/generate endpoint.
 * 
 * SCHEDULING OPTIONS:
 * 
 * 1. GitHub Actions (Recommended for deployment):
 *    Create .github/workflows/generate-blog.yml:
 *    ```yaml
 *    name: Generate Daily Blog Post
 *    on:
 *      schedule:
 *        - cron: '0 6 * * *'  # Every day at 6 AM UTC
 *      workflow_dispatch:  # Manual trigger
 *    jobs:
 *      generate:
 *        runs-on: ubuntu-latest
 *        steps:
 *          - name: Call blog generation endpoint
 *            run: |
 *              curl -X POST https://your-domain.com/api/blog/auto-generate \
 *                -H "Authorization: Bearer ${{ secrets.BLOG_GENERATION_SECRET }}"
 *    ```
 * 
 * 2. Vercel Cron Jobs:
 *    Add to vercel.json:
 *    ```json
 *    {
 *      "crons": [{
 *        "path": "/api/blog/auto-generate",
 *        "schedule": "0 6 * * *"
 *      }]
 *    }
 *    ```
 * 
 * 3. Local Development (cron on macOS/Linux):
 *    Add to crontab: 0 6 * * * curl -X POST http://localhost:3000/api/blog/auto-generate -H "Authorization: Bearer your_token"
 * 
 * 4. External Services:
 *    - cron-job.org
 *    - EasyCron
 *    - AWS EventBridge
 */

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.BLOG_GENERATION_SECRET || 'your_secret_token';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      console.log('[Auto-Generate] Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the base URL - try multiple sources for Azure compatibility
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    if (!baseUrl) {
      // Fallback: use request header to construct URL
      const protocol = request.headers.get('x-forwarded-proto') || 'https';
      const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
      baseUrl = `${protocol}://${host}`;
    }

    console.log('[Auto-Generate] Calling blog generation endpoint at:', `${baseUrl}/api/blog/generate`);

    // Call the blog generation endpoint with empty body
    const response = await fetch(`${baseUrl}/api/blog/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${expectedToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Ethiopian-Today-AutoGenerate/1.0',
      },
      body: JSON.stringify({}), // Empty body with valid JSON
    });

    console.log('[Auto-Generate] Blog generation response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Auto-Generate] Blog generation failed:', response.statusText, errorText);
      throw new Error(`Blog generation failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[Auto-Generate] Blog post generated successfully');

    return NextResponse.json({
      success: true,
      message: 'Automated blog post generated successfully',
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    console.error('[Auto-Generate] Error in automated blog generation:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { 
        error: 'Failed to generate blog post automatically',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Automated Blog Generation Endpoint',
    description: 'Use POST to trigger automated blog post generation',
    scheduling: {
      'GitHub Actions': 'Create .github/workflows/generate-blog.yml with cron schedule',
      'Vercel Cron': 'Add cron config to vercel.json',
      'Local cron': 'Add crontab entry to run daily',
      'External': 'Use services like cron-job.org or EasyCron',
    },
    usage: 'POST /api/blog/auto-generate with Authorization: Bearer <token>',
  });
}
