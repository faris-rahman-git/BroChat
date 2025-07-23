import { NextFunction, Request, Response } from 'express';
import { s3UrlHelper } from '../../../../application/useCases/home/commonUseCases/s3UrlHelper';
import { deleteFromS3Helper } from '../../../../application/useCases/home/commonUseCases/deleteFromS3';

export const s3UrlHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileType, extension } = req.body;
    const uploadUrl = await s3UrlHelper(fileType , extension);
    res.status(200).json({ uploadUrl });
  } catch (err) {
    next(err);
  }
};

export const deleteFromS3Handler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageUrl = req.query.imageUrl as string;
    await deleteFromS3Helper(imageUrl);
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};
