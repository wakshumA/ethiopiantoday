import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Store subscribers in a JSON file (use a database in production)
const subscribersFile = path.join(process.cwd(), 'data', 'subscribers.json')

function getSubscribers(): string[] {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    if (fs.existsSync(subscribersFile)) {
      const data = fs.readFileSync(subscribersFile, 'utf-8')
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('Error reading subscribers:', error)
    return []
  }
}

function saveSubscribers(subscribers: string[]): boolean {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2))
    return true
  } catch (error) {
    console.error('Error saving subscribers:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Get existing subscribers
    const subscribers = getSubscribers()

    // Check if already subscribed
    if (subscribers.includes(email.toLowerCase())) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 400 }
      )
    }

    // Add new subscriber
    subscribers.push(email.toLowerCase())
    
    // Save to file
    if (!saveSubscribers(subscribers)) {
      return NextResponse.json(
        { error: 'Failed to save subscription' },
        { status: 500 }
      )
    }

    // TODO: Send confirmation email (integrate with SendGrid, Mailchimp, etc.)
    // TODO: Add to email service provider

    console.log(`New subscriber: ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get subscriber count (protected endpoint)
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const adminKey = process.env.RATES_ADMIN_KEY

    // Require authentication to view subscriber list
    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const subscribers = getSubscribers()

    return NextResponse.json({
      count: subscribers.length,
      subscribers: subscribers.map(email => ({
        email,
        subscribedAt: new Date().toISOString() // TODO: Store actual subscription date
      }))
    })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
