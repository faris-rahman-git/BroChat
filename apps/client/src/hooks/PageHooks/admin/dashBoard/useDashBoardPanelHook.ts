import { useGetDashBoardForm } from '@client/hooks/admin/dashboard/logic/useGetDashBoardForm';
import { DashBoardDataType } from '@client/types/admin/DashBoardDataType';
import { useEffect, useState } from 'react';

export const useDashBoardPanelHook = () => {
  const [userTimeFilter, setUserTimeFilter] = useState('week');
  const [chatTimeFilter, setChatTimeFilter] = useState('week');
  const [groupTimeFilter, setGroupTimeFilter] = useState('week');
  const [revenueTimeFilter, setRevenueTimeFilter] = useState('week');
  const [dashboardData, setDashboardData] = useState<DashBoardDataType | null>(
    null
  );

  const { mutate } = useGetDashBoardForm(setDashboardData);

  useEffect(() => {
    mutate();
  }, []);

  return {
    dashboardData,
    userTimeFilter,
    setUserTimeFilter,
    chatTimeFilter,
    setChatTimeFilter,
    groupTimeFilter,
    setGroupTimeFilter,
    revenueTimeFilter,
    setRevenueTimeFilter,
  };
};
