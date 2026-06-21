import { formatTime, getAllTimes } from '@/utilis/time'
import React from 'react'
import { Link } from 'react-router';

export const HistoryTable = () => {
    const total = getAllTimes()
    const timers = localStorage.getItem("timer-state")
    const data = timers ? JSON.parse(timers) : []
  return (
      <div className='absolute top-9 right-9'>
          {total.map((day) => {
              const { hours, minutes, seconds } = formatTime(day.value)

              return (
                  <div key={day.date}>
                      {day.date} : {hours}h {minutes}m {seconds}s
                  </div>
              )
          })}
        
          {data?.map((day) => (
              <div key={day.date}> 
                  {day.date }
                  {day.timers.length}
                  {day.timers.map((t) => {
                      const { hours, minutes, seconds } = formatTime(t.time)

                      const parts = []

                      if (Number(hours) > 0) parts.push(`${hours}h`)
                      if (Number(minutes) > 0) parts.push(`${minutes}m`)
                      if (Number(seconds) > 0 || parts.length === 0) parts.push(`${seconds}s`)

                      return (
                          <div key={t.id}>
                              {t.name} : {parts.join(" ")}
                          </div>
                      )
                  })}
                
            </div>
          ))}
          <Link to={ "/history "}></Link>
      </div>    
  )
}
