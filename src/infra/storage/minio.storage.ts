import { DeleteObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  DeleteImageProps,
  Uploader,
  UploadImageProps,
  UploadOutput,
} from 'src/domain/application/repositories/uploader.repository';
import { EnvService } from 'src/infra/env/env.service';

@Injectable()
export class MinioStorage implements Uploader {
  private client: S3;

  constructor(private readonly envs: EnvService) {
    this.client = new S3({
      endpoint: this.envs.get('MINIO_BUCKET_URL'),
      apiVersion: 'latest',
      region: 'auto',
      credentials: {
        accessKeyId: this.envs.get('MINIO_ACCESS_KEY_ID'),
        secretAccessKey: this.envs.get('MINIO_SECRET_ACCESS_KEY'),
      },
      forcePathStyle: true,
    });
  }

  async uploadImage({ image }: UploadImageProps): Promise<UploadOutput> {
    const uploadId = randomUUID();
    const uniqueName = `${uploadId}-${image.fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.envs.get('MINIO_BUCKET_NAME') as string,
      Key: uniqueName,
      Body: image.body,
      ContentType: image.fileType,
      ACL: 'public-read',
    });

    await this.client.send(command);

    return {
      url: `${this.envs.get('MINIO_BUCKET_URL')}/${this.envs.get('MINIO_BUCKET_NAME')}/${uniqueName}`,
      name: image.fileName,
      size: image.fileSize,
      uniqueName,
    };
  }

  async deleteImage({ imageKey }: DeleteImageProps): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.envs.get('MINIO_BUCKET_NAME') as string,
      Key: imageKey,
    });

    await this.client.send(command);
  }
}
