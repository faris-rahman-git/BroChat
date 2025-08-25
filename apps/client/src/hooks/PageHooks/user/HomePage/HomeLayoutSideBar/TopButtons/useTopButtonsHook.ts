import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { setActiveSection } from '@client/redux/features/userSlices/homeSlices/commonSlices/activeSectionTabSlice';
import { RootState } from '@client/redux/store';
import { useSelector } from 'react-redux';

export const useTopButtonsHook = (
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>,
  isExpanded: boolean
) => {
  const activeSectionTab = useSelector(
    (state: RootState) => state.activeSectionTab.value
  );
  const dispatch = useAppDispatch();

  const handleButtons = (label: string) => {
    if (label === 'Menu') {
      setIsExpanded(!isExpanded);
    } else if (label === 'DMs') {
      dispatch(setActiveSection({ value: 'DMs' }));
    } else if (label === 'Groups') {
      dispatch(setActiveSection({ value: 'Groups' }));
    } else if (label === 'Calls') {
      dispatch(setActiveSection({ value: 'Calls' }));
    }
  };

  return { activeSectionTab , handleButtons };
};
