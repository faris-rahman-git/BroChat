import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { s3 } from '../../../../config/s3';

export const s3UrlHelper = async (
  fileType: string,
  extension: string
): Promise<string> => {
  const fileName = `brochat-${uuidv4()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: fileName,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

  return uploadUrl;
};
