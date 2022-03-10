import { Image } from '@prisma/client'
import { useLoaderData } from '@remix-run/react'
import { ReactElement } from 'react'
import { LoaderFunction } from 'remix'

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
    images
  }
}

export default function Index(): ReactElement {
  const { images } = useLoaderData<LoaderData>()

  return (
    <div className="container mx-auto mt-8">

      <div className="mb-4">
        Search
      </div>

      <ImageGrid
        images={ images }
      />

    </div>
  );
}

