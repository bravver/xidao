import { motion } from 'framer-motion'

export default function TipBubble({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white/30 backdrop-blur-sm rounded-2xl px-4 py-3 text-sm text-gray-700 shadow-md ${className}`}
    >
      {children}
    </motion.div>
  )
}