import { useAppDispatch } from '@/hooks/use-redux';
import { showConfirmation } from '@/store/features/confirmationSlice';

export const useConfirmation = () => {
  const dispatch = useAppDispatch();

  const confirm = (
    title: string,
    description: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const handleConfirm = () => {
        resolve(true);
      };

      const handleCancel = () => {
        resolve(false);
      };

      dispatch(
        showConfirmation({
          title,
          description,
          onConfirm: handleConfirm,
        })
      );
      
      // Note: The dialog's own close/cancel logic will also effectively resolve the promise
      // because the onConfirm callback is the only way to resolve(true).
    });
  };

  return { confirm };
};
