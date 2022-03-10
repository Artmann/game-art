
import { ReactElement, useState } from 'react'
import { ActionFunction, redirect } from 'remix'
import { Button } from '~/components/button';

import { db } from '~/db/db.server';
import { getImageDimensions } from '~/server/images.server';
import { currentUser, isAdmin } from '~/server/user.server';

export const action: ActionFunction = async({ request }) => {
  const user = await currentUser(request)
  console.log(user)
  if (!isAdmin(user)) {
    return redirect('/sign-in')
  }

  const body = await request.formData();

  const url = body.get('url')

  const [ existingImage ] = await db.image.findMany({
    where: {
      url
    }
  })

  if (existingImage) {
    return redirect(`/images/${ existingImage.id }`)
  }

  const { height, width } = await getImageDimensions(url)

  const image = await db.image.create({
    data: {
      height,
      url,
      width
    }
  })

  return redirect(`/images/${ image.id }`)
}

export default function NewImageRoute(): ReactElement {
  const [ url, setUrl ] = useState('')

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-xl mb-8">
        New Image
      </h1>

      <form method="post">

        <div className="mb-8">
          <label className="font-medium uppercase tracking-wide text-sm">
            <div className="mb-2">
              URL
            </div>
            <input
              autoFocus={ true }
              className={`
                border border-slate-300 rounded-sm
                p-2
                text-sm
                max-w-full w-256
              `}
              name="url"
              onChange={ e => setUrl(e.currentTarget.value) }
              required={ true }
              type="url"
              value={ url }
            />
          </label>
        </div>

        <div>
          <img
            className="block mb-8 shadow-lg max-w-full w-128"
            src={ url }
          />
        </div>

        <div className="mb-4">
          <Button text="Save" />
        </div>

      </form>
    </div>
  )
}
