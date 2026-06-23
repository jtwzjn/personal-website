import { NextRequest, NextResponse } from 'next/server'
import { randomBytes, timingSafeEqual } from 'crypto'

interface GitHubAccessTokenResponse {
  access_token: string
  token_type: string
  scope?: string
}

const STATE_COOKIE_NAME = 'decap_oauth_state'
const STATE_COOKIE_MAX_AGE = 600 // 10 minutes

function generateState(): string {
  return randomBytes(32).toString('hex')
}

function setStateCookie(response: NextResponse, state: string): void {
  response.cookies.set({
    name: STATE_COOKIE_NAME,
    value: state,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: STATE_COOKIE_MAX_AGE,
    path: '/api/auth',
  })
}

function clearStateCookie(response: NextResponse): void {
  response.cookies.set({
    name: STATE_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/api/auth',
  })
}

function validateState(
  requestState: string,
  cookieState: string | undefined
): boolean {
  if (!cookieState || !requestState) {
    return false
  }

  if (requestState.length !== cookieState.length) {
    return false
  }

  try {
    return timingSafeEqual(
      Buffer.from(requestState, 'utf8'),
      Buffer.from(cookieState, 'utf8')
    )
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const clientId = process.env.OAUTH_CLIENT_ID
  const clientSecret = process.env.OAUTH_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'OAuth credentials not configured' },
      { status: 500 }
    )
  }

  // Step 1: Initial request from Decap CMS to start OAuth flow
  if (!code) {
    const newState = generateState()
    const response = NextResponse.json({ state: newState })
    setStateCookie(response, newState)
    return response
  }

  // Step 2: GitHub callback with code and state
  const cookieState = request.cookies.get(STATE_COOKIE_NAME)?.value

  if (!state || !validateState(state, cookieState)) {
    return NextResponse.json(
      { error: 'Invalid or missing state parameter' },
      { status: 403 }
    )
  }

  const tokenResponse = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    }
  )

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text()
    const response = NextResponse.json(
      { error: 'Failed to exchange code for token', details: errorText },
      { status: 500 }
    )
    clearStateCookie(response)
    return response
  }

  const tokenData =
    (await tokenResponse.json()) as GitHubAccessTokenResponse

  if (!tokenData.access_token) {
    const response = NextResponse.json(
      { error: 'No access token received from GitHub' },
      { status: 500 }
    )
    clearStateCookie(response)
    return response
  }

  const response = NextResponse.json({
    token: tokenData.access_token,
    provider: 'github',
  })
  clearStateCookie(response)
  return response
}
