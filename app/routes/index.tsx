import { useLoaderData } from '@remix-run/react'
import createJustifiedLayout from 'justified-layout'
import { CSSProperties, ReactElement, useEffect, useRef, useState } from 'react'
import { LoaderFunction } from 'remix'

type LoaderData = {
  images: Image[]
}

type Image = {
  height: number
  url: string
  width: number
}

export const loader: LoaderFunction = async(): Promise<LoaderData> => {
  return {
    images: [
      {
        height: 908,
        width: 1413,
        url: 'https://cdna.artstation.com/p/assets/images/images/010/056/204/large/zug-zug-studio-s1.jpg?1522322956'
      },
      {
        height: 850,
        width: 1143,
        url: 'https://cdna.artstation.com/p/assets/images/images/003/927/622/large/zug-zug-iron-sword.jpg?1478612463'
      },
      {
        height: 838,
        width: 1000,
        url: 'https://cdna.artstation.com/p/assets/images/images/000/126/688/large/antonio-neves-screenshot012.jpg?1422399790'
      },
      {
        height: 938,
        width: 1669,
        url: 'https://cdnb.artstation.com/p/assets/images/images/003/733/761/4k/mark-kirkpatrick-mk-landscape-01.jpg?1599194319'
      },
      {
        height: 938,
        width: 1669,
        url: 'https://cdna.artstation.com/p/assets/images/images/003/733/754/4k/mark-kirkpatrick-mk-landscape-03.jpg?1476919271'
      },
      {
        height: 969,
        width: 969,
        url: 'https://cdna.artstation.com/p/assets/images/images/003/930/724/4k/boy-sichterman-screenshot020.jpg?1478633273'
      },
      {
        height: 968,
        width: 860,
        url: 'https://cdna.artstation.com/p/assets/images/images/011/585/834/large/hoya-choe-2015-12-14-hotdog-02.jpg?1530328606'
      }
    ]
  }
}

export default function Index(): ReactElement {
  const { images } = useLoaderData<LoaderData>()

  return (
    <div className="container mx-auto mt-8">

      <div className="mb-4">
        Search
      </div>

      <ImageGrid images={ images } />

    </div>
  );
}

type ImageGridProps = {
  images: Image[]
}

function ImageGrid({ images }: ImageGridProps): ReactElement {
  const [ maxWidth, setMaxWidth ] = useState(1000)
  const [ layout, setLayout ] = useState<any>()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLayout(
      createJustifiedLayout(
        images.map((i: Image): number => i.width / i.height),
        {
          containerWidth: maxWidth
        }
      )
    )
  }, [ maxWidth ])

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
              height: layout.boxes[index].height,
              left: layout.boxes[index].left,
              position: 'absolute',
              top: layout.boxes[index].top,
              width: layout.boxes[index].width,
            }}
          />
        ))
      }
    </div>
  )
}

type ImageTileProps = {
  image: Image
  style: CSSProperties
}


function ImageTile({ image, style }: ImageTileProps): ReactElement {
  return (
    <a
      href="block"
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
