'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { format, subDays } from 'date-fns'

// Prisma import'unu kaldırıyoruz ve kendi tipimizi tanımlıyoruz
interface Word {
  id: string
  word: string
  translation: string
  lastReviewed: Date | null
}

interface StatisticsProps {
  words: Word[] | null | undefined
}

export function Statistics({ words }: StatisticsProps) {
  // Son 7 günün istatistiklerini hesapla
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
    const savedProgress = localStorage.getItem(`dailyProgress_${date}`)
    return {
      date,
      wordsLearned: savedProgress ? JSON.parse(savedProgress).wordsLearned.length : 0
    }
  }).reverse()

  const calculateStreak = () => {
    let streak = 0
    let currentDate = new Date()
    
    while (true) {
      const date = format(currentDate, 'yyyy-MM-dd')
      const progress = localStorage.getItem(`dailyProgress_${date}`)
      
      if (!progress || JSON.parse(progress).wordsLearned.length === 0) {
        break
      }
      
      streak++
      currentDate = subDays(currentDate, 1)
    }
    
    return streak
  }

  // Tip güvenliği için Array.isArray kontrolü ekleyelim
  const safeWords = Array.isArray(words) ? words : []
  
  const totalWords = safeWords.length
  const learnedWords = safeWords.filter(word => word?.lastReviewed).length
  const streak = calculateStreak()
  const successRate = totalWords > 0 ? (learnedWords / totalWords * 100).toFixed(1) : '0'

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Words</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWords}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Learned Words</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{learnedWords}</div>
          <Progress value={Number(successRate)} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate}%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{streak} days</div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {last7Days.map((day) => (
              <div key={day.date} className="text-center">
                <div className="text-xs text-muted-foreground">
                  {format(new Date(day.date), 'EEE')}
                </div>
                <div className="mt-1 h-14 rounded-md bg-primary/10 flex items-end">
                  <div
                    className="w-full bg-primary rounded-md transition-all duration-300"
                    style={{
                      height: `${(day.wordsLearned / 5) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-1 text-xs font-medium">
                  {day.wordsLearned}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 