import React, { ReactElement } from 'react'
import { ActionFunction, redirect } from 'remix'

import { Button } from '~/components/button'
import { authenticate } from '~/server/user.server'

import { getSession, commitSession } from '../session'

export const action: ActionFunction = async({ request }) => {
  const body = await request.formData()

  const email = body.get('email')
  const password = body.get('password')

  if (!email || !password) {
    throw new Error('Both email and password is required.')
  }

  const user = await authenticate(email, password)

  if (!user) {
    throw new Error('Invalid email or password.')
  }

  const session = await getSession(
    request.headers.get('Cookie')
  )

  console.log({ id: user.id })
  session.set('userId', user.id)

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  })
}

export default function SignInRoute(): ReactElement {
  return (
    <div className="container mx-auto mt-8">
      <form method="post">

        <div className="mb-8">
          <label className="font-medium uppercase tracking-wide text-sm">
            <div className="mb-2">
              Email
            </div>
            <input
              autoFocus={true}
              className={`
                border border-slate-300 rounded-sm
                p-2
                text-sm
                max-w-full w-64
              `}
              name="email"
              required={true}
              type="email"
            />
          </label>
        </div>

        <div className="mb-8">
          <label className="font-medium uppercase tracking-wide text-sm">
            <div className="mb-2">
              Password
            </div>
            <input
              autoFocus={true}
              className={`
                border border-slate-300 rounded-sm
                p-2
                text-sm
                max-w-full w-64
              `}
              name="password"
              required={true}
              type="password"
            />
          </label>
        </div>

        <div className="mb-4">
          <Button text="Sign In" />
        </div>

      </form>
    </div>
  )
}
