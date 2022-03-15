import createJustifiedLayout from 'justified-layout'
import { CSSProperties, ReactElement, useEffect, useRef, useState } from 'react'

type GridImage = {
  id: string
  height: number
  width: number
  url: string
}

type ImageGridProps = {
  images: GridImage[]
}

export function ImageGrid({ images }: ImageGridProps): ReactElement {
  const [ maxWidth, setMaxWidth ] = useState(1000)
  const [ layout, setLayout ] = useState<any>()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLayout(
      createJustifiedLayout(
        images.map((i: GridImage): number => i.width / i.height),
        {
          containerWidth: maxWidth
        }
      )
    )
  }, [ images, maxWidth ])

  useEffect(() => {
    const resize = () => {
      if (!ref.current) {
        return
      }

      setMaxWidth(ref.current.getBoundingClientRect().width)
    }

    resize()

    window.addEventListener('resize', resize)


    return () => window.removeEventListener('resize', resize)
  }, [ ref.current ])

  if (!layout) {
    return <div/>
  }

  return (
    <div
      className="relative w-full"
      ref={ ref }
      style={{
        height: layout.containerHeight
      }}
    >
      {
        images.map((image, index) => (
          <ImageTile
            image={ image }
            key={ index }
            style={{
              height: layout.boxes[index]?.height ?? 300,
              left: layout.boxes[index]?.left ?? 0,
              position: 'absolute',
              top: layout.boxes[index]?.top ?? 0,
              width: layout.boxes[index]?.width ?? 533,
            }}
          />
        ))
      }
    </div>
  )
}

type ImageTileProps = {
  image: GridImage
  style: CSSProperties
}


function ImageTile({ image, style }: ImageTileProps): ReactElement {
  return (
    <a
      className="block"
      href={ `/images/${ image.id }` }
      style={style}
    >
      <img
        alt=""
        className="object-cover h-full w-full"
        loading="lazy"
        src={ image.url }
      />
    </a>
  )
}
