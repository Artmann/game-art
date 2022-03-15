import React, { FormEvent, ReactElement, useState } from 'react'

type Tag = {
  id: string
  name: string
}

interface TagListProps {
  tags: Tag[]

  onChange?: (selectedTagIds: string[]) => void
  selectedTagIds?: string[]
}

export function TagList({
  tags,
  onChange = () => {},
  selectedTagIds = []
}: TagListProps): ReactElement {
  const [ tagQuery, setTagQuery ] = useState('')

  const tagQueryHandler = (e: FormEvent<HTMLInputElement>) => setTagQuery(e.currentTarget.value)

  const matchesQuery = (name: string): boolean => {
    if (!tagQuery) {
      return true
    }

    return name.toLowerCase().includes(tagQuery.toLowerCase())
  }

  const toggleHandler = (e: FormEvent<HTMLInputElement>) => {
    const tagId = e.currentTarget.value

    if (selectedTagIds.includes(tagId)) {
      onChange(
        selectedTagIds.filter(t => t !== tagId)
      )
    } else {
      onChange([
        ...selectedTagIds,
        tagId
      ])
    }
  }

  return (
    <div>
      <div  className="font-medium uppercase tracking-wide text-sm mb-2">
        Tags
      </div>
      <div className="mb-4">
        <input
          className={`
            border border-slate-300 rounded-sm
            p-2
            text-sm
            max-w-full w-48
          `}
          onChange={ tagQueryHandler }
          type="text"
          placeholder="Search tags..."
        />
      </div>
      <div className="overflow-x-auto" style={{ height: 450 }}>
        {
          tags.map(tag => (
            <div
              key={ tag.id }
              style={{
                display: matchesQuery(tag.name) ? 'block' : 'none'
              }}
            >
              <input
                className="mr-4"
                checked={ selectedTagIds.includes(tag.id) }
                id={ tag.id }
                name="tagIds"
                onChange={ toggleHandler }
                type="checkbox"
                value={ tag.id }
              />
              <label htmlFor={ tag.id }>
                { tag.name }
              </label>
            </div>
          ))
        }
      </div>
    </div>
  )
}
