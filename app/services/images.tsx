import { Image, Tag } from '@prisma/client'

import { db } from '~/db/db.server'
import { getImageDimensions } from '~/server/images.server'

export class ImageService {
  async createImage(url: string): Promise<Image> {
    const [existingImage] = await db.image.findMany({
      where: {
        url
      }
    })

    if (existingImage) {
      return existingImage
    }

    const { height, width } = await getImageDimensions(url)

    const image = await db.image.create({
      data: {
        height,
        url,
        width
      }
    })

    return image
  }

  async findImage(id: string): Promise<ImageDto> {
    const image = await db.image.findUnique({
      where: {
        id
      },
      include: {
        tags: true
      }
    })

    if (!image) {
      throw new Response('Not Found', { status: 404 })
    }

    return this.transformImage(image)
  }

  async listImage(): Promise<ImageDto[]> {
    const images = await db.image.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tags: true
      }
    })

    return images.map(this.transformImage)
  }

  async listTags(): Promise<Tag[]> {
    const tags = await db.tag.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return tags
  }

  async updateImage(id: string, url: string): Promise<Image> {
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

    const { height, width } = await getImageDimensions(url)

    await db.image.update({
      where: {
        id: image.id
      },
      data: {
        height,
        url,
        width
      }
    })

    return image
  }

  async updateTags(imageId: string, tagIds: string[]): Promise<void> {
    const image = await db.image.findUnique({
      where: {
        id: imageId
      }
    })

    if (!image) {
      throw new Response('Not Found.', {
        status: 404
      })
    }

    await db.tagsOnImages.deleteMany({
      where: {
        imageId: image.id
      }
    })

    await db.tagsOnImages.createMany({
      data: tagIds.map(t => ({
        tagId: t,
        imageId: image.id
      })),
      skipDuplicates: true
    })
  }

  private transformImage(image: Image): ImageDto {
    return {
      id: image.id,
      height: image.height,
      tagIds: image.tags.map(tag => tag.tagId),
      url: image.url,
      width: image.width,
    }
  }
}

export interface ImageDto {
  id: string
  height: number
  tagIds: string[]
  url: string
  width: number
}
