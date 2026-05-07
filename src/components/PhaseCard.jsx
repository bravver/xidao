import { motion } from 'framer-motion'

export default function PhaseCard({ title, subtitle, icon, onClick, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass rounded-3xl p-5 cursor-pointer shadow-lg border border-white/50 hover:shadow-xl transition-shadow"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-lg text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </motion.div>
  )
}