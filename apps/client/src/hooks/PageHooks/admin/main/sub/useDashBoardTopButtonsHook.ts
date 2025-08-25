import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  setActiveDropdown,
  setSelectedChild,
  setSelectedTab,
} from '@client/redux/features/admin/adminSidebarSlice';
import { RootState } from '@client/redux/store';
import { useSelector } from 'react-redux';

export const useDashBoardTopButtonsHook = () => {
  const dispatch = useAppDispatch();
  const { selectedTab, selectedChild, activeDropdown } = useSelector(
    (state: RootState) => state.adminSidebar
  );

  const handleButtons = (label: string, childrenLength: number) => {
    dispatch(setActiveDropdown(activeDropdown === label ? null : label));

    if (childrenLength === 0) {
      dispatch(setSelectedTab(label));
      dispatch(setSelectedChild(null));
    }
  };

  const handleChildClick = (parentLabel: string, childLabel: string) => {
    dispatch(setSelectedTab(parentLabel));
    dispatch(setSelectedChild(childLabel));
  };

  return {
    handleButtons,
    handleChildClick,
    selectedTab,
    selectedChild,
    activeDropdown
  };
};
