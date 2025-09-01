import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import { showConfirmation, ShowConfirmationPayload, setConfirmed } from '@/store/features/confirmationSlice';
import { useStore } from 'react-redux';

type ConfirmationOptions = Omit<ShowConfirmationPayload, 'onConfirm'>;

export const useConfirmation = () => {
  const dispatch = useAppDispatch();
  const store = useStore();

  const confirm = (options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      dispatch(showConfirmation(options));

      const unsubscribe = store.subscribe(() => {
        const newIsConfirmed = store.getState().confirmation.isConfirmed;
        if (newIsConfirmed !== null) {
          resolve(newIsConfirmed);
          unsubscribe();
          dispatch(setConfirmed(null));
        }
      });
    });
  };

  return { confirm };
};
