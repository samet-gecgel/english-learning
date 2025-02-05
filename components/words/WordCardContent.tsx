// Server component
import { Word } from "@/types"

interface WordCardContentProps {
  word: Word
}

export function WordCardContent({ word }: WordCardContentProps) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">{word.word}</h3>
          <p className="text-muted-foreground">{word.translation}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {word.level}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {word.wordFamily.map((type) => (
          <span 
            key={type}
            className="rounded-lg bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground"
          >
            {type}
          </span>
        ))}
      </div>
    </>
  )
} 