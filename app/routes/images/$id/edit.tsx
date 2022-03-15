import { Tag } from '@prisma/client'
import { ReactElement, useState } from 'react'
import { ActionFunction, LoaderFunction, redirect, useLoaderData } from 'remix'

import { ImageForm } from '~/components/image-form'
import { db } from '~/db/db.server'
import { currentUser, isAdmin } from '~/server/user.server'
import { ImageDto, ImageService } from '~/services/images'

type LoaderData = {
  image: ImageDto
  tags: Tag[]
}

export const loader: LoaderFunction = async({ params, request }) => {
  const user = await currentUser(request)

  if (!isAdmin(user)) {
    return redirect('/sign-in')
  }

  const imageService = new ImageService()
  const image = await imageService.findImage(params.id || '')

  const tags = await db.tag.findMany({})

  return {
    image,
    tags
  }
}

export const action: ActionFunction = async({ request }) => {
  const user = await currentUser(request)

  if (!isAdmin(user)) {
    return redirect('/sign-in')
  }

  const body = await request.formData()

  const id = (body.get('id') ?? '').toString()
  const url = (body.get('url') ?? '').toString()
  const tagIds = (body.getAll('tagIds') ?? []) as string[]

  if (!id) {
    throw new Response('Not Found.', {
      status: 404
    })
  }

  if (!url) {
    throw new Error('url is required.')
  }

  const imageService = new ImageService()
  const image = await imageService.updateImage(id, url)

  await imageService.updateTags(image.id, tagIds)

  return redirect(`/images/${ image.id }`)
}

export default function NewImageRoute(): ReactElement {
  const { image, tags } = useLoaderData<LoaderData>()

  const [ draft, setDraft ] = useState({
    ...image
  })

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-xl mb-8">
        Edit Image
      </h1>

      <ImageForm
        draft={ draft }
        id= { image.id }
        updateDraft={ setDraft }
        tags={ tags }
      />
    </div>
  )
}
