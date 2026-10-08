/**
 * useModal - Custom hook for managing modal state
 * 
 * Usage:
 * const { isOpen, open, close, toggle } = useModal();
 * 
 * <button onClick={open}>Open Modal</button>
 * <Modal isOpen={isOpen} onClose={close}>
 *   Content
 * </Modal>
 */

import { useState } from 'react';

export default function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
}
