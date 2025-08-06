export interface IMediaService {
  mediaUpload(fileType: string, extension: string): Promise<string>;

  mediaRemove(imageUrl: string): Promise<void>;
}
