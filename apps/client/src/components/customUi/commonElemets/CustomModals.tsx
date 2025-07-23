import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@client/components/ui/dialog';
import { Button } from '@client/components/ui/button';
import { ReactNode } from 'react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  isNormal?: boolean;
};

export default function CustomModals({
  open,
  onOpenChange,
  title,
  description,
  children,
  onConfirm,
  confirmText,
  cancelText = 'Cancel',
  isNormal = true,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange }>
      <DialogContent showCloseButton={isNormal}>
        <DialogHeader hidden={!isNormal}>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children}

        <DialogFooter hidden={!isNormal}>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
