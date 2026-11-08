import app from '@adonisjs/core/services/app'
import type { HttpContext } from '@adonisjs/core/http'

export const ACCESS_COOKIE = 'codename_access'
export const REFRESH_COOKIE = 'codename_refresh'

export const ACCESS_TOKEN_TTL_MINUTES = 15
export const REFRESH_TOKEN_TTL_DAYS = 7

export const ACCESS_COOKIE_PATH = '/'
export const REFRESH_COOKIE_PATH = '/api/auth'

export type SessionTokens = {
  accessToken: string
  refreshToken: string
}

type Response = HttpContext['response']

function cookieOptions(path: string, maxAge: number) {
  return {
    httpOnly: true,
    secure: app.inProduction,
    sameSite: 'lax' as const,
    path,
    maxAge,
  }
}

/**
 * Writes the short-lived access token and the refresh token as HttpOnly cookies.
 *
 * Angular never reads those cookies: it only sends them with credentials.
 */
export function setSessionCookies(response: Response, tokens: SessionTokens) {
  response.plainCookie(
    ACCESS_COOKIE,
    tokens.accessToken,
    cookieOptions(ACCESS_COOKIE_PATH, ACCESS_TOKEN_TTL_MINUTES * 60)
  )
  response.plainCookie(
    REFRESH_COOKIE,
    tokens.refreshToken,
    cookieOptions(REFRESH_COOKIE_PATH, REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60)
  )
}

/**
 * Removes both authentication cookies from the browser.
 */
export function clearSessionCookies(response: Response) {
  response.clearCookie(ACCESS_COOKIE, cookieOptions(ACCESS_COOKIE_PATH, 0))
  response.clearCookie(REFRESH_COOKIE, cookieOptions(REFRESH_COOKIE_PATH, 0))
}
