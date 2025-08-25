import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UploadStatus = 'pending' | 'uploading' | 'processing' | 'success' | 'error';
export type UploadErrorType = 'validation' | 'server' | 'network';

export interface UploadTask {
  id: string; // Benzersiz ID, belki dosya adı + zaman damgası
  fileName: string;
  status: UploadStatus;
  progress: number; // 0-100 arası bir değer
  error?: string;
  errorType?: UploadErrorType;
  analysisResult?: any; // To store analysis data on success
}

interface UploadState {
  tasks: UploadTask[];
}

const initialState: UploadState = {
  tasks: [],
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    addUploadTask(state, action: PayloadAction<Omit<UploadTask, 'status' | 'progress' | 'analysisResult' | 'errorType'>>) {
      const newTask: UploadTask = {
        ...action.payload,
        status: 'pending',
        progress: 0,
      };
      state.tasks.push(newTask);
    },
    updateUploadTaskStatus(state, action: PayloadAction<{ id: string; status: UploadStatus; error?: string; errorType?: UploadErrorType; analysisResult?: any }>) {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        if (action.payload.error) {
          task.error = action.payload.error;
          task.errorType = action.payload.errorType;
        } else {
          // Clear error on non-error statuses
          task.error = undefined;
          task.errorType = undefined;
        }
        if (action.payload.analysisResult) {
            task.analysisResult = action.payload.analysisResult;
        }
      }
    },
    updateUploadTaskProgress(state, action: PayloadAction<{ id: string; progress: number }>) {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.progress = action.payload.progress;
      }
    },
    removeUploadTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
    clearCompletedTasks(state) {
        state.tasks = state.tasks.filter(t => t.status !== 'success' && t.status !== 'error');
    }
  },
});

export const {
  addUploadTask,
  updateUploadTaskStatus,
  updateUploadTaskProgress,
  removeUploadTask,
  clearCompletedTasks
} = uploadSlice.actions;

export default uploadSlice.reducer;
