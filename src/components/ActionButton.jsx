import { motion } from 'framer-motion'

export default function ActionButton({ children, onClick, variant = 'primary', disabled = false, className = '' }) {
  const variants = {
    primary: 'bg-gradient-to-r from-ocean-500 to-ocean-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white/80 text-gray-700 border border-gray-200 hover:bg-white',
    ghost: 'bg-transparent text-gray-600 hover:bg-white/50',
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-2xl font-medium text-base shadow-md
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </motion.button>
  )
}