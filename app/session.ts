import { createCookieSessionStorage } from 'remix'

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: 'game-dev-art',

      // all of these are optional
      expires: new Date(Date.now() + 60_000),
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
      secrets: ['e12esadfrhg34t23r23fwefwaqsdqw222fgg'],
      secure: true,
    },
  })

export { getSession, commitSession, destroySession }
