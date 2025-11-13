import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ReactNode } from 'react'

interface ModalState {
  isOpen: boolean
  modalContent: React.ReactNode | null
  modalId: string
}

const initialState: ModalState = {
  isOpen: false,
  modalContent: null,
  modalId: 'modal',
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{
        content: ReactNode
        id?: string
        width?: number
      }>,
    ) => {
      state.isOpen = true
      state.modalContent = action.payload.content
      state.modalId = action.payload.id || 'modal'
    },

    closeModal: (state) => {
      state.isOpen = false
      state.modalContent = null
      state.modalId = 'modal'
    },
  },
})

export const { openModal, closeModal } = modalSlice.actions
export const modalReducer = modalSlice.reducer
