import { motion } from "framer-motion"

export function CuteAvatarLoader() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 rounded-full overflow-hidden">
      <motion.div
        className="absolute bottom-0 left-1/2 w-16 h-16 bg-yellow-300 rounded-full"
        initial={{ y: 64, x: -32 }}
        animate={{ 
          y: [64, 0, 64],
          x: [-32, -32, 32, 32, -32],
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="relative w-full h-full">
          {/* Eyes */}
          <motion.div 
            className="absolute top-3 left-3 w-3 h-3 bg-black rounded-full"
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          />
          <motion.div 
            className="absolute top-3 right-3 w-3 h-3 bg-black rounded-full"
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          />
          {/* Mouth */}
          <motion.div 
            className="absolute bottom-3 left-1/2 w-6 h-3 bg-red-400 rounded-t-full"
            initial={{ x: -12 }}
            animate={{ scaleX: [1, 1.2, 0.8, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  )
}

