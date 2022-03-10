import { Image } from '@prisma/client'
import { useLoaderData } from '@remix-run/react'
import { ReactElement } from 'react'
import { LoaderFunction, } from 'remix'

import { db } from '~/db/db.server'

type LoaderData = {
  image: Image
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

  return {
    image
  }
}

export default function Index(): ReactElement {
  const { image } = useLoaderData<LoaderData>()

  return (
    <div className="container mx-auto mt-8">

      <img
        className="block mx-auto w-1/2 max-w-full shadow-lg mb-16"
        loading="lazy"
        src={ image.url }
      />
    </div>
  );
}

