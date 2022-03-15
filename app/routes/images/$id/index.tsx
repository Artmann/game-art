import { Image, Tag } from '@prisma/client'
import { useLoaderData } from '@remix-run/react'
import { ReactElement } from 'react'
import { LoaderFunction, } from 'remix'
import { Button } from '~/components/button'

import { db } from '~/db/db.server'

type LoaderData = {
  image: Image
  tags: Tag[]
}

export const loader: LoaderFunction = async({ params }): Promise<LoaderData> => {
  const { id } = params

  const image = await db.image.findUnique({
    where: {
      id
    }
  })

  if (!image) {
    throw new Response('Not Found.', {
      status: 404
    })
  }

  const tags = (await db.tagsOnImages.findMany({
    where: {
      imageId: image.id
    },
    include: {
      tag: true
    }
  })).map(t => t.tag)

  return {
    image,
    tags
  }
}

export default function Index(): ReactElement {
  const { image, tags } = useLoaderData<LoaderData>()

  return (
    <div className="container mx-auto mt-8 flex flex-col items-center">
      <div className="flex mb-8 w-full">
        <div className="flex-1"></div>
        <div>
        <Button text="Edit Image" linkTo={ `/images/${ image.id }/edit` } />
        </div>
      </div>

        <img
          className="block max-w-full w-1/2 shadow-lg mb-16"
          loading="lazy"
          src={ image.url }
        />

        <div>
          { tags.map(t => t.name).join(', ') }
        </div>
    </div>
  );
}

