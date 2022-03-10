import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function seed() {
  await Promise.all(
    getImages().map((data) => {
      return db.image.create({ data })
    })
  )
}

seed()

function getImages(): any[] {
  return [
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
