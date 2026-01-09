import { prisma } from '@/bootstrap/db.init';
import { MediaStatus } from '@/generated/prisma/enums';

const prefix = 'products/';

const fakeImages = [
  'airpods.jpg',
  'another_nike.jpg',
  'another_smartwatch.jpg',
  'aws_speaker.jpg',
  'blue_navy_backpack.jpg',
  'camera.jpg',
  'chanel.jpg',
  'colone.jpg',
  'cool_sneakers.jpg',
  'curology_shampoo.jpg',
  'high_heels.jpg',
  'hydro_flask.jpg',
  'iphone.jpg',
  'lipstick.jpg',
  'minimalist_watch.jpg',
  'mitzie_spray.jpg',
  'mountain_backpack.jpg',
  'nike.jpg',
  'ordinary_pack.jpg',
  'purple_shampoo.jpg',
  'rayban.jpg',
  'red_nike.jpg',
  'smart_watch.jpg',
  'sunglasses.jpg',
  'sunscreen.jpg',
  'vans.jpg',
  'watch.jpg',
];

export const imagesFake = fakeImages.map((image) => ({
  baseName: image,
  key: `${prefix}${image}`,
  fileType: 'jpg',
  mimeType: 'image/jpeg',
  fileSize: 1024 * 500,
  status: MediaStatus.CONFIRMED,
}));

export const seedImages = async () => {
  prisma.media.createMany({
    data: imagesFake,
    skipDuplicates: true,
  });
};
