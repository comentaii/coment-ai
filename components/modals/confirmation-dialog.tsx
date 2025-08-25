'use client';

import { useAppSelector, useAppDispatch } from '@/hooks/use-redux';
import { hideConfirmation } from '@/store/features/confirmationSlice';
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
  const { isOpen, title, description, onConfirm } = useAppSelector(
    (state) => state.confirmation
  );

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    dispatch(hideConfirmation());
  };

  const handleClose = () => {
    dispatch(hideConfirmation());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
