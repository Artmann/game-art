import { Tag } from '@prisma/client'
import { ReactElement, useState } from 'react'
import { ActionFunction, LoaderFunction, redirect, useLoaderData } from 'remix'

import { ImageForm } from '~/components/image-form'
import { db } from '~/db/db.server'
import { currentUser, isAdmin } from '~/server/user.server'
import { ImageService } from '~/services/images'

type LoadData = {
  tags: Tag[]
}

export const loader: LoaderFunction = async({ params, request }) => {
  const user = await currentUser(request)

  if (!isAdmin(user)) {
    return redirect('/sign-in')
  }

  const tags = await db.tag.findMany({})

  return {
    tags
  }
}

export const action: ActionFunction = async({ request }) => {
  const user = await currentUser(request)

  if (!isAdmin(user)) {
    return redirect('/sign-in')
  }

  const body = await request.formData()

  const url = (body.get('url') ?? '').toString()
  const tagIds = (body.getAll('tagIds') ?? []) as string[]

  if (!url) {
    throw new Error('url is required.')
  }

  const imageService = new ImageService()
  const image = await imageService.createImage(url)

  await imageService.updateTags(image.id, tagIds)

  return redirect(`/images/${ image.id }`)
}

export default function NewImageRoute(): ReactElement {
  const { tags } = useLoaderData<LoadData>()
  const [ draft, setDraft ] = useState({})

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-xl mb-8">
        New Image
      </h1>

      <ImageForm
        draft={ draft }
        updateDraft={ setDraft }
        tags={ tags }
      />
    </div>
  )
}
