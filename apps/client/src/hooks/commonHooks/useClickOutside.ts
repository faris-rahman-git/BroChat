import { RefObject, useEffect } from 'react';

type UseClickOutsideProps = {
  ref: RefObject<HTMLDivElement | null>;
  onClickOutside: () => void;
};

export default function useClickOutside({
  ref,
  onClickOutside,
}: UseClickOutsideProps) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClickOutside]);
}
