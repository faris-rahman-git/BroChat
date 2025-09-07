import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IMediaService } from '../../../app/providers/user/IMediaService';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export class MediaService implements IMediaService {
  private s3 = new S3Client({
    region: process.env.AWS_S3_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_S3_SECRET_KEY!,
    },
  });

  async mediaUpload(fileType: string, extension: string): Promise<string> {
    const fileName = `brochat-${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 60 });

    return signedUrl;
  }

  async mediaRemove(imageUrl: string): Promise<void> {
    const bucketName = process.env.AWS_S3_BUCKET_NAME!;

    const url = new URL(imageUrl);
    const key = url.pathname.substring(1);

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await this.s3.send(command);
  }
}
