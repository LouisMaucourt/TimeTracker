import { formatTime } from "@/utilis/time"
import { memo } from "react"
import { Clock } from "./Clock"

export const TimerClock = memo(({ time, scale }: { time: number, scale: number }) => {
    const t = formatTime(time)
    return (
        <Clock
            hours={t.hours}
            minutes={t.minutes}
            seconds={t.seconds}
            style={{ transform: `scale(${scale})` }}
        />
    )
})