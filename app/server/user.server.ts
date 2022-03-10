import { User } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { db } from '~/db/db.server'
import { getSession } from '~/session'

export async function createUser(email: string, password: string): Promise<User> {
  const [ existingUser ] = await db.user.findMany({
    where: {
      email
    }
  })

  if (existingUser) {
    throw new Error('User already exists.')
  }

  const hash = bcrypt.hashSync(password, 10)

  const user = await db.user.create({
    data: {
      email: email.toLowerCase().trim(),
      hash
    }
  })

  return user
}

export async function authenticate(email: string, password: string): Promise<User | undefined> {
  const [ user ] = await db.user.findMany({
    where: {
      email: email.toLowerCase().trim()
    }
  })

  if (!user) {
    return
  }


  const isValidPassword = bcrypt.compareSync(password, user.hash)

  if (!isValidPassword) {
    return
  }

  return user
}

export async function currentUser(request): Promise<User | null> {
  const session = await getSession(
    request.headers.get('Cookie')
  )

  const id = session.get('userId')

  console.log({id})

  if (!id) {
    return null
  }

  const user = await db.user.findUnique({
    where: {
      id
    }
  })

  return user
}

export function isAdmin(user: User | undefined | null): boolean {
  if (!user) {
    return false
  }

  return user.role === 'admin'
}
