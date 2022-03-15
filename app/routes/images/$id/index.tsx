import { Tag } from '@prisma/client'
import { useLoaderData } from '@remix-run/react'
import { ReactElement } from 'react'
import { LoaderFunction, } from 'remix'
import { Button } from '~/components/button'

import { ImageDto, ImageService } from '~/services/images'

type LoaderData = {
  image: ImageDto
  tags: Tag[]
}

export const loader: LoaderFunction = async({ params }): Promise<LoaderData> => {
  const { id } = params

  const imageService = new ImageService()

  const image = await imageService.findImage(id || '')

  if (!image) {
    throw new Response('Not Found.', {
      status: 404
    })
  }

  const tags = await imageService.listTags()

  return {
    image,
    tags
  }
}

export default function Index(): ReactElement {
  const { image, tags } = useLoaderData<LoaderData>()

  return (
    <div className="flex flex-col items-center">
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
          {
            image.tagIds
              .map(id => tags.find(t => t.id === id))
              .map(t => t?.name)
              .join(', ')
          }
        </div>
    </div>
  );
}

