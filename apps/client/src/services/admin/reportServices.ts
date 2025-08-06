import api from '@client/configs/axios';
import { GetReportParams } from '@bro/shared';
const REPORT_MANAGEMENT_API = '/admin/reportManagement';

export const getAllReportsApi = async (params: GetReportParams) => {
  const res = await api.get(REPORT_MANAGEMENT_API + '/getallrepots', {
    params,
  });
  return res.data;
};

export const getResolvedReportsApi = async ({
  searchValue,
  page,
}: {
  searchValue: string;
  page: number;
}) => {
  const res = await api.get(REPORT_MANAGEMENT_API + '/getresolvedrepots', {
    params: { searchValue, page },
  });
  return res.data;
};

export const getDeletedReportsApi = async ({
  searchValue,
  page,
}: {
  searchValue: string;
  page: number;
}) => {
  const res = await api.get(REPORT_MANAGEMENT_API + '/getdeletedrepots', {
    params: { searchValue, page },
  });
  return res.data;
};

export const blockReporedUserApi = async ({
  reportId,
  reportedUserId,
  note,
}: {
  reportId: string;
  reportedUserId: string;
  note: string;
}) => {
  const res = await api.patch(REPORT_MANAGEMENT_API + '/blockreporeduser', {
    reportId,
    reportedUserId,
    note,
  });
  return res.data;
};

export const deleteReportApi = async ({
  reportId,
  note,
}: {
  reportId: string;
  note: string;
}) => {
  const res = await api.patch(REPORT_MANAGEMENT_API + '/deletereport', {
    reportId,
    note,
  });
  return res.data;
};

export const ignoreReportApi = async ({
  reportId,
  note,
}: {
  reportId: string;
  note: string;
}) => {
  const res = await api.patch(REPORT_MANAGEMENT_API + '/ignorereport', {
    reportId,
    note,
  });
  return res.data;
};

export const hardDeleteReportApi = async (reportId: string) => {
  const res = await api.delete(
    REPORT_MANAGEMENT_API + '/harddeletereport/' + reportId
  );
  return res.data;
};
