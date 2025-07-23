import api from '@client/configs/axios';

export const getAllReportsApi = async () => {
  const res = await api.get('/admin/getAllRepots');
  return res.data;
};

export const getResolvedReportsApi = async () => {
  const res = await api.get('/admin/getresolvedrepots');
  return res.data;
};

export const getDeletedReportsApi = async () => {
  const res = await api.get('/admin/getdeletedrepots');
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
  const res = await api.patch('/admin/blockreporeduser', {
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
  const res = await api.patch('/admin/deletereport', {
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
  const res = await api.patch('/admin/ignorereport', {
    reportId,
    note,
  });
  return res.data;
};

export const hardDeleteReportApi = async (reportId: string) => {
  const res = await api.delete('/admin/harddeletereport/' + reportId);
  return res.data;
};
