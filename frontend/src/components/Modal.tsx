import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  const reduce = useReducedMotion()

  // The panel materialises: blur and scale resolve together so it reads as a
  // real surface arriving, not a flat fade. Under reduced motion it only fades.
  const panel = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: 0.15 } },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, scale: 0.96, filter: 'blur(4px)' },
        animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        exit: {
          opacity: 0,
          scale: 0.98,
          filter: 'blur(4px)',
          transition: { duration: 0.15, ease: 'easeOut' as const },
        },
        transition: { type: 'spring' as const, bounce: 0, duration: 0.4 },
      }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <motion.div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl border border-transparent bg-white p-6 shadow-elevated"
        onClick={(e) => e.stopPropagation()}
        {...panel}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors duration-150 hover:text-gray-600"
            aria-label="Close"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}
