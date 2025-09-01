import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConfirmationState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  isConfirmed: boolean | null;
}

const initialState: ConfirmationState = {
  isOpen: false,
  title: '',
  description: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  isConfirmed: null,
};

export interface ShowConfirmationPayload {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
}

const confirmationSlice = createSlice({
  name: 'confirmation',
  initialState,
  reducers: {
    showConfirmation(state, action: PayloadAction<ShowConfirmationPayload>) {
      state.isOpen = true;
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.confirmText = action.payload.confirmText;
      state.cancelText = action.payload.cancelText;
      state.isConfirmed = null; 
    },
    hideConfirmation(state) {
      state.isOpen = false;
    },
    setConfirmed(state, action: PayloadAction<boolean>) {
      state.isConfirmed = action.payload;
      state.isOpen = false;
    },
  },
});

export const { showConfirmation, hideConfirmation, setConfirmed } = confirmationSlice.actions;
export default confirmationSlice.reducer;
