import { useEffect, useRef, useState } from 'react';
import { ReportSubResponse } from '@bro/shared';
import { useGetAllReportsForm } from '@client/hooks/admin/reportManagement/logic/useGetAllReportsForm';
import { useBlockReporedUserForm } from '@client/hooks/admin/reportManagement/logic/useBlockReporedUserForm';
import { useIgnoreReportForm } from '@client/hooks/admin/reportManagement/logic/useIgnoreReportForm';
import { useDeleteReportForm } from '@client/hooks/admin/reportManagement/logic/useDeleteReportForm';

export const useReportDetailsPanelHook = () => {
  const [reportList, setReportList] = useState<ReportSubResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState<string>('');
  const [filters, setFilters] = useState({
    createdAt: '',
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedButton, setSelectedButton] = useState('');
  const [selectedReport, setSelectedReport] =
    useState<ReportSubResponse | null>(null);

  const inpRef = useRef<HTMLTextAreaElement>(null);

  const { getAllReportMutate, isPending } = useGetAllReportsForm(
    setReportList,
    setTotalPages
  );
  const { mutateBlock } = useBlockReporedUserForm(setReportList);
  const { mutateDeleteReport } = useDeleteReportForm(setReportList);
  const { mutateIgnore } = useIgnoreReportForm(setReportList);

  useEffect(() => {
    getAllReportMutate({
      searchValue,
      ...filters,
      page: 1,
    });
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      getAllReportMutate({
        searchValue,
        ...filters,
        page: 1,
      });
    }, 300);

    return () => clearTimeout(delay);
  }, [searchValue, filters]);

  const handleBlockUser = (reportId: string, reportedUserId: string) => {
    const note = inpRef.current?.value || '';
    mutateBlock({ reportId, reportedUserId, note });
  };

  const handleIgnoreReport = (reportId: string) => {
    const note = inpRef.current?.value || '';

    mutateIgnore({ reportId, note });
  };

  const handleDeleteReport = (reportId: string) => {
    const note = inpRef.current?.value || '';
    mutateDeleteReport({ reportId, note });
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setFilters((prev) => ({
      ...prev,
      createdAt: selectedDate.toLocaleDateString('en-CA'),
    }));
  };

  return {
    handleBlockUser,
    handleIgnoreReport,
    handleDeleteReport,
    reportList,
    totalPages,
    searchValue,
    setSearchValue,
    filters,
    setFilters,
    inpRef,
    isPending,
    mutate: getAllReportMutate,
    handleDateSelect,
    selectedReport,
    setSelectedReport,
    selectedButton,
    setSelectedButton,
    openModal,
    setOpenModal,
  };
};
