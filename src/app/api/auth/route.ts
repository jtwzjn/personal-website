import { NextRequest, NextResponse } from 'next/server'

interface GitHubAccessTokenResponse {
  access_token: string
  token_type: string
  scope?: string
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { error: 'Missing authorization code' },
      { status: 400 }
    )
  }

  const clientId = process.env.OAUTH_CLIENT_ID
  const clientSecret = process.env.OAUTH_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'OAuth credentials not configured' },
      { status: 500 }
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
    return NextResponse.json(
      { error: 'Failed to exchange code for token', details: errorText },
      { status: 500 }
    )
  }

  const tokenData =
    (await tokenResponse.json()) as GitHubAccessTokenResponse

  if (!tokenData.access_token) {
    return NextResponse.json(
      { error: 'No access token received from GitHub' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    token: tokenData.access_token,
    provider: 'github',
  })
}
