export type UploadProps = {
  fileName: string;
  fileType: string;
  fileSize: number;
  body: Buffer;
};

export type UploadImageProps = {
  image: UploadProps;
};

export type DeleteImageProps = {
  imageKey: string;
};

export type UploadOutput = {
  url: string;
  size: number;
  name: string;
  uniqueName: string;
};

export abstract class Uploader {
  abstract uploadImage({ image }: UploadImageProps): Promise<UploadOutput>;
  abstract deleteImage({ imageKey }: DeleteImageProps): Promise<void>;
  // abstract deleteManyImages(props: DeleteManyImagesProps): Promise<void>;
}
