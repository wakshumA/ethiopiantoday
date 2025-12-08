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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Call the blog generation endpoint
    const response = await fetch(`${baseUrl}/api/blog/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${expectedToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Blog generation failed: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Automated blog post generated successfully',
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    console.error('Error in automated blog generation:', error);
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
