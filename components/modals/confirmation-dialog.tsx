'use client';

import { useAppSelector, useAppDispatch } from '@/hooks/use-redux';
import { hideConfirmation, setConfirmed } from '@/store/features/confirmationSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function ConfirmationDialog() {
  const dispatch = useAppDispatch();
  const { isOpen, title, description, confirmText, cancelText } = useAppSelector(
    (state) => state.confirmation
  );

  const handleConfirm = () => {
    dispatch(setConfirmed(true));
  };

  const handleCancel = () => {
    dispatch(setConfirmed(false));
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      handleCancel();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
