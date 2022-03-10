import probe from 'probe-image-size'

export async function getImageDimensions(url: string): Promise<ImageDimensions> {
  const { height, width } = await probe(url)

  return {
    height,
    width
  }
}

type ImageDimensions = {
  height: number
  width: number
}
