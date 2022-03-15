import { Tag } from '@prisma/client'
import { useLoaderData } from '@remix-run/react'
import { ReactElement, useState } from 'react'
import { LoaderFunction } from 'remix'
import { Button } from '~/components/button'

import { ImageGrid } from '~/components/image-grid'
import { TagList } from '~/components/tag-list'
import { db } from '~/db/db.server'
import { ImageDto, ImageService } from '~/services/images'

type LoaderData = {
  images: ImageDto[]
  tags: Tag[]
}

export const loader: LoaderFunction = async(): Promise<LoaderData> => {
  const imageService = new ImageService()

  const images = await imageService.listImage()
  const tags = await db.tag.findMany({})

  return {
    images,
    tags
  }
}

export default function Index(): ReactElement {
  const { images, tags } = useLoaderData<LoaderData>()
  const [ selectedTagIds, setSelectedTagIds ] = useState<string[]>([])

  const tagsChangedHandler = (tagIds: string[]) => {
    setSelectedTagIds(tagIds)
  }

  const filteredImages = selectedTagIds.length > 0 ? images.filter(image => {
    return image.tagIds.some(tagId => selectedTagIds.includes(tagId))
  }) : images

  return (
    <div className="w-full">

      <div className="flex mb-8">
        <div className="flex-1"></div>
        <div>
          <Button text="New Image" linkTo="/images/new" />
        </div>
      </div>

      <div className="mb-4 flex">
        <div className="mr-8" style={{ width: 1000 }}>
          <ImageGrid
            images={ filteredImages }
          />
        </div>
        <div>
          <TagList
            onChange={ tagsChangedHandler }
            selectedTagIds={ selectedTagIds }
            tags={ tags }
          />
        </div>
      </div>

    </div>
  );
}

