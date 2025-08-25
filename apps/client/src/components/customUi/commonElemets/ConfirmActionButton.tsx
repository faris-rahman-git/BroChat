import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@client/components/ui/dialog';
import { Button } from '@client/components/ui/button';
import ButtonIcon from './ButtonIcon';
import { useConfirmActionButtonHook } from '@client/hooks/PageHooks/common/useConfirmActionButtonHook';

interface ConfirmActionButtonProps {
  buttonIcon: React.ElementType;
  buttonClassName: string;
  buttonContent: string;
  modalTitle: string;
  modalDescription?: string;
  confirmButtonContent?: string;
  onConfirm: () => void;
  children?: React.ReactNode;
  dialogClassName?: string;
  isConfirmButtonDisabled?: boolean;
}

const ConfirmActionButton = ({
  buttonIcon,
  buttonClassName,
  buttonContent,
  modalTitle,
  modalDescription,
  onConfirm,
  confirmButtonContent = 'Confirm',
  children,
  dialogClassName,
  isConfirmButtonDisabled = false,
}: ConfirmActionButtonProps) => {
  
  const { handleConfirm, open, setOpen } =
    useConfirmActionButtonHook(onConfirm);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ButtonIcon
          Icon={buttonIcon}
          label={buttonContent}
          className={`w-[110px] h-[40px] text-white flex justify-center items-center hover:text-white px-4 py-[6px] ${buttonClassName}`}
        >
          <div className="flex w-full justify-between items-center">
            <span className="whitespace-nowrap">{buttonContent}</span>
          </div>
        </ButtonIcon>
      </DialogTrigger>

      <DialogContent className={`sm:max-w-[400px] ${dialogClassName}`}>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          {modalDescription && (
            <DialogDescription className="py-3">
              {modalDescription}
            </DialogDescription>
          )}
        </DialogHeader>

        {children}
        <DialogFooter>
          <Button
            variant="outline"
            className="hover:cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          {!isConfirmButtonDisabled && (
            <Button
              onClick={handleConfirm}
              className="bg-red-600 hover:bg-red-700 text-white hover:cursor-pointer"
            >
              {confirmButtonContent}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmActionButton;
