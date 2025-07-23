import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../../../../config/s3';

export const deleteFromS3Helper = async (imageUrl: string): Promise<void> => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;

  const url = new URL(imageUrl);
  const key = url.pathname.substring(1);

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await s3.send(command);
};
