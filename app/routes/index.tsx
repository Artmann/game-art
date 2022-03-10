import { Image } from '@prisma/client'
import { useLoaderData } from '@remix-run/react'
import { ReactElement } from 'react'
import { LoaderFunction } from 'remix'
import { Button } from '~/components/button'

import { ImageGrid } from '~/components/image-grid'
import { db } from '~/db/db.server'

type LoaderData = {
  images: Image[]
}

export const loader: LoaderFunction = async(): Promise<LoaderData> => {
  const images = await db.image.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return {
    images: images.sort((a, b) => Math.random() >= 0.5 ? 1 : -1)
  }
}

export default function Index(): ReactElement {
  const { images } = useLoaderData<LoaderData>()

  return (
    <div className="container mx-auto mt-8">

      <div className="flex">
        <div className="flex-1"></div>
        <div>
          <Button text="New Image" linkTo="/images/new" />
        </div>
      </div>

      <div className="mb-4">
        Search
      </div>

      <ImageGrid
        images={ images }
      />

    </div>
  );
}

