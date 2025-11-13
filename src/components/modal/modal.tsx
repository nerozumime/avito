import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import React, { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './modal.module.css'
import { closeModal } from '../../services/slices/modalSlice.ts'
import { useAppDispatch, useAppSelector } from '../../services/store/store.ts'

export default function Modal() {
  const dispatch = useAppDispatch()
  const { isOpen, modalContent, modalId } = useAppSelector((state) => state.modal)
  const contentRef = useRef<HTMLDivElement>(null)
  const modalRoot = document.getElementById('modal')

  const handleOverlayClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      dispatch(closeModal())
    }
  }

  const handleEscapeKey = useCallback(
    (e: ReactKeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(closeModal())
      }
    },
    [dispatch],
  )

  useEffect(() => {
    const handleNativeKeyDown = (e: KeyboardEvent) => {
      const reactEvent = e as unknown as ReactKeyboardEvent
      handleEscapeKey(reactEvent)
    }

    if (isOpen && contentRef.current) {
      contentRef.current.focus()
      document.addEventListener('keydown', handleNativeKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleNativeKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscapeKey])

  if (!isOpen) return null

  if (!modalRoot) {
    console.warn('Modal root element not found')
    return null
  }

  if (!modalContent) {
    console.warn('Modal content is empty')
    return null
  }

  return createPortal(
    <dialog id={modalId} className={styles.overlay} onClick={handleOverlayClick} aria-modal='true' role={'dialog'}>
      <div ref={contentRef} className={styles.content} tabIndex={-1} onKeyDown={handleEscapeKey}>
        {modalContent}
      </div>
    </dialog>,
    modalRoot,
  )
}
