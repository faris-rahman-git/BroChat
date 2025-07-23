import { Request, Response, NextFunction } from 'express';
import { reportRepo } from '../../../../infrastructure/repositories/reportRepo';
import { getAllReportHelper } from '../../../../application/useCases/admin/reportManagement.ts/getAllReportHelper';
import { userRepo } from '../../../../infrastructure/repositories/userRepo';
import { blockReporedUserHelper } from '../../../../application/useCases/admin/reportManagement.ts/blockReporedUserHelper';
import { ignoreReportHelper } from '../../../../application/useCases/admin/reportManagement.ts/ignoreReportHelper';
import { deleteReportHelper } from '../../../../application/useCases/admin/reportManagement.ts/deleteReportHelper';
import { getResolvedReportsHelper } from '../../../../application/useCases/admin/reportManagement.ts/getResolvedReportsHelper';
import { getDeletedRepotsHelper } from '../../../../application/useCases/admin/reportManagement.ts/getDeletedRepotsHelper';
import { hardDeleteReportHelper } from '../../../../application/useCases/admin/reportManagement.ts/hardDeleteReportHelper';
const repRepo = new reportRepo();
const repo = new userRepo();

export const getAllReportHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reportList = await getAllReportHelper(repRepo);
    res.status(200).json({ reportList });
  } catch (err) {
    next(err);
  }
};

export const getResolvedRepotsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reportList = await getResolvedReportsHelper(repRepo);
    res.status(200).json({ reportList });
  } catch (err) {
    next(err);
  }
};

export const getDeletedRepotsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reportList = await getDeletedRepotsHelper(repRepo);
    res.status(200).json({ reportList });
  } catch (err) {
    next(err);
  }
};

export const blockReporedUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reportId, reportedUserId, note } = req.body;
    await blockReporedUserHelper(repo, repRepo, reportId, reportedUserId, note);
    res.status(200).json({ reportId });
  } catch (err) {
    next(err);
  }
};

export const deleteReportHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reportId, note } = req.body;
    await deleteReportHelper(repRepo, reportId, note);
    res.status(200).json({ reportId });
  } catch (err) {
    next(err);
  }
};

export const ignoreReportHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reportId, note } = req.body;
    await ignoreReportHelper(repRepo, reportId, note);
    res.status(200).json({ reportId });
  } catch (err) {
    next(err);
  }
};

export const hardDeleteReportHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reportId } = req.params;
    await hardDeleteReportHelper(repRepo, reportId);
    res.status(200).json({ reportId });
  } catch (err) {
    next(err);
  }
};
