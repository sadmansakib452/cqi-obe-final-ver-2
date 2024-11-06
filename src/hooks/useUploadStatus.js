// File: src/hooks/useUploadStatus.js

import create from "zustand";

const useUploadStatus = create((set) => ({
  uploadStatuses: {}, // { [stepKey]: status }
  currentDialog: null, // stepKey or null

  // Function to open a dialog for a specific step
  openDialog: (stepKey) => set({ currentDialog: stepKey }),

  // Function to close the dialog
  closeDialog: () => set({ currentDialog: null }),

  // Function to update upload status for a step
  updateUploadStatus: (stepKey, status) =>
    set((state) => ({
      uploadStatuses: { ...state.uploadStatuses, [stepKey]: status },
    })),
}));

export default useUploadStatus;
