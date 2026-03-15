import { MediaStatus } from '@/generated/prisma/enums';

export type SeedMedia = {
  baseName: string;
  key: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  status: MediaStatus;
};

const generateSeedMedia = (props: { prefix: string; baseName: string } | { key: string }): SeedMedia => {
  if ('key' in props) {
    const { key } = props;
    return {
      baseName: key,
      key,
      fileType: key.split('.')[1],
      mimeType: key.split('.')[1],
      fileSize: 1024 * 500,
      status: MediaStatus.CONFIRMED,
    };
  }

  const { prefix, baseName } = props;
  return {
    baseName,
    key: `${prefix}${baseName}`,
    fileType: baseName.split('.')[1],
    mimeType: baseName.split('.')[1],
    fileSize: 1024 * 500,
    status: MediaStatus.CONFIRMED,
  };
};

export default generateSeedMedia;
