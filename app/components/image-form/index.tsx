import React, { ReactElement, useState } from 'react'
import { ImageDto } from '~/services/images'

import { Button } from '../button'
import { TagList } from '../tag-list'

interface ImageFormProps {
  draft: ImageDto
  updateDraft: (draft: any) => void

  tags?: any[]
  id?: string
}

export function ImageForm({ draft, updateDraft, id, tags = [] }: ImageFormProps): ReactElement {
  const [ selectedTagIds, setSelectedTagIds ] = useState<string[]>(draft.tagIds)

  const tagsChangedHandler = (tagIds: string[]) => {
    setSelectedTagIds(tagIds)
  }

  return (
    <form method="post">

      { id && <input type="hidden" name="id" value={ id } /> }

      <div className="flex">

        <div className="mr-16">
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
                onChange={ e => updateDraft({ ...draft, url: e.currentTarget.value }) }
                required={ true }
                type="url"
                value={ draft.url }
              />
            </label>
          </div>

          <div>
            <img
              className="block mb-8 shadow-lg max-w-full w-128"
              src={ draft.url }
            />
          </div>

          <div className="mb-4">
            <Button text="Save" />
          </div>
        </div>

        <TagList
          onChange={ tagsChangedHandler }
          selectedTagIds={ selectedTagIds }
          tags={ tags }
        />

      </div>
    </form>
  )
}
