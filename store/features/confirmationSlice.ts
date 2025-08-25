import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: (() => void) | null;
}

const initialState: ConfirmationState = {
  isOpen: false,
  title: '',
  description: '',
  onConfirm: null,
};

interface ShowConfirmationPayload {
  title: string;
  description: string;
  onConfirm: () => void;
}

const confirmationSlice = createSlice({
  name: 'confirmation',
  initialState,
  reducers: {
    showConfirmation(state, action: PayloadAction<ShowConfirmationPayload>) {
      state.isOpen = true;
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.onConfirm = action.payload.onConfirm as any; // Redux toolkit serializability issue
    },
    hideConfirmation(state) {
      state.isOpen = false;
      state.title = '';
      state.description = '';
      state.onConfirm = null;
    },
  },
});

export const { showConfirmation, hideConfirmation } = confirmationSlice.actions;
export default confirmationSlice.reducer;
