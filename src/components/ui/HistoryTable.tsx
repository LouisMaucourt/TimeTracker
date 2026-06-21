import { formatTime, getAllTimes } from '@/utilis/time'
import React, { useState } from 'react'

export const HistoryTable = () => {
    const total = getAllTimes()
    const timers = localStorage.getItem("timer-state")
    const data = timers ? JSON.parse(timers) : []
    const [showMore, setShowMore] = useState(false)

    const handleShow = () => {
        setShowMore((prev) => !prev)
    }

    return (
        <div
            className={`z-40 absolute top-9 right-9 flex flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-500 ease-out ${showMore ? "w-96 max-h-[80vh]" : "w-72 max-h-72"
                }`}
        >
            <div className="flex-1 overflow-y-auto p-5 text-white">
                {total.map((day) => {
                    const { hours, minutes } = formatTime(day.value)
                    const [d, m, y] = day.date.split("-").map(Number)
                    const isToday = new Date(y, m - 1, d).toDateString() === new Date().toDateString()

                    return (
                        <div
                            key={day.date}
                            className={`flex items-center justify-between border-b border-white/10 py-2 text-sm last:border-none ${isToday ? "text-white" : "text-white/60"
                                }`}
                        >
                            <span className={isToday ? "font-medium" : ""}>
                                {isToday ? "Aujourd'hui" : day.date}
                            </span>
                            <span className="font-semibold tabular-nums">
                                {hours}h{String(minutes).padStart(2, "0")}
                            </span>
                        </div>
                    )
                })}

                <div
                    className={`grid transition-all duration-500 ease-in-out ${showMore ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                >
                    <div className="overflow-hidden">
                        <div className="space-y-3 pt-3">
                            {data?.map((day) => (
                                <div key={day.date}>
                                    <p className="font-semibold text-white/90">
                                        {day.date} <span className="text-white/50">({day.timers.length})</span>
                                    </p>
                                    {day.timers.map((t) => {
                                        const { hours, minutes, seconds } = formatTime(t.time)
                                        const parts: string[] = []
                                        if (Number(hours) > 0) parts.push(`${hours}h`)
                                        if (Number(minutes) > 0) parts.push(`${minutes}m`)
                                        if (Number(seconds) > 0 || parts.length === 0) parts.push(`${seconds}s`)
                                        return (
                                            <div key={t.id} className="pl-2 text-sm text-white/70">
                                                {t.name} : {parts.join(" ")}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleShow}
                className="m-5 mt-0 shrink-0 rounded-xl border border-white/20 bg-white/10 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white/20 active:scale-95"
            >
                {showMore ? "Réduire" : "Voir plus"}
            </button>
        </div>
    )
}