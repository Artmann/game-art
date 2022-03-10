import React, { ReactElement } from 'react'

interface ButtonProps {
  text: string

  linkTo?: string
}

export function Button({ text, linkTo }: ButtonProps): ReactElement {
  if (linkTo) {
    return (
      <a
        className="font-medium text-sm text-white bg-cyan-600 px-4 py-2 rounded-sm tracking-wide"
        href={ linkTo }
      >
        { text }
      </a>
    )
  }

  return (
    <button
      className="font-medium text-sm text-white bg-cyan-600 px-4 py-2 rounded-sm tracking-wide"
      type="submit"
    >
      { text }
    </button>
  )
}
