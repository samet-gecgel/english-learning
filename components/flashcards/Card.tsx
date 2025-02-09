// 'use client'

// import { Word } from '@prisma/client'
// import { Button } from '@/components/ui/button'
// import { motion, AnimatePresence } from 'framer-motion'

// interface CardProps {
//   word: Word
//   isFlipped: boolean
//   onFlip: () => void
//   onSpeak: (text: string, isEnglish: boolean) => void
// }

// export function Card({ word, isFlipped, onFlip, onSpeak }: CardProps) {
//   return (
//     <div className="relative w-full max-w-xl mx-auto aspect-[3/2]">
//       <AnimatePresence initial={false} mode="wait">
//         {!isFlipped ? (
//           <motion.div
//             key="front"
//             initial={{ rotateY: -180 }}
//             animate={{ rotateY: 0 }}
//             exit={{ rotateY: 180 }}
//             transition={{ duration: 0.3 }}
//             className="absolute inset-0"
//           >
//             <div 
//               onClick={onFlip}
//               className="w-full h-full bg-card border rounded-xl shadow-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
//             >
//               <h2 className="text-4xl font-bold mb-4">{word.english}</h2>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   onSpeak(word.english, true)
//                 }}
//               >
//                 🔊
//               </Button>
//               <p className="text-sm text-muted-foreground mt-4">Click to flip</p>
//             </div>
//           </motion.div>
//         ) : (
//           <motion.div
//             key="back"
//             initial={{ rotateY: 180 }}
//             animate={{ rotateY: 0 }}
//             exit={{ rotateY: -180 }}
//             transition={{ duration: 0.3 }}
//             className="absolute inset-0"
//           >
//             <div 
//               onClick={onFlip}
//               className="w-full h-full bg-card border rounded-xl shadow-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
//             >
//               <h2 className="text-4xl font-bold mb-4">{word.turkish}</h2>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   onSpeak(word.turkish, false)
//                 }}
//               >
//                 🔊
//               </Button>
//               <p className="text-sm text-muted-foreground mt-4">Click to flip</p>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// } 