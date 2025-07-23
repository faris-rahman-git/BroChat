import api from '@client/configs/axios';
import { ContentType } from '../../../../../libs/shared/src/lib/types/home/messageType';

export const uploadFileApi = async ({
  file,
  fileType,
  extension,
  customMessageType,
}: {
  file: File;
  fileType: string;
  extension: string;
  customMessageType?: ContentType;
}) => {
  const res = await api.post('/s3url', { fileType, extension });
  //upload to s3
  const url = res.data.uploadUrl;
  await api.put(url, file, { headers: { 'Content-Type': file.type } });
  const mediaUrl = url.split('?')[0];
  if (customMessageType) return { mediaUrl, customMessageType };
  return mediaUrl;
};

export const deleteFileApi = async (imageUrl: string) => {
  await api.delete('/deletefroms3', {
    params: { imageUrl },
  });
};
