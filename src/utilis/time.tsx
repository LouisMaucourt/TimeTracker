type TimerEntry = {
    id: string
    time: number
    name:string
}

type DayEntry = {
    date: string
    timers: TimerEntry[]
}

export const saveTime = (time: number, id: string, name:string) => {
    const key = "timer-state"

    const existingStorage = localStorage.getItem(key)
    const data: DayEntry[] = existingStorage ? JSON.parse(existingStorage) : []

    const today = new Date().toISOString().split("T")[0]

    let day = data.find(d => d.date === today)

    if (!day) {
        day = { date: today, timers: [] }
        data.push(day)
    }

    const existingTimer = day.timers.find(t => t.id === id)

    if (existingTimer) {
        existingTimer.time = time
    } else {
        day.timers.push({ id,name, time })
    }

    localStorage.setItem(key, JSON.stringify(data))
}
export const getAllTimes = () => {

    const raw = localStorage.getItem("timer-state")
    const data = raw ? JSON.parse(raw) : []

    return data.map((day) => {
        const total = day.timers.reduce(
            (acc: number, t: number) => acc + t.time,
            0
        )

        return {
            date: day.date,
            value: total,
        }
    })
}
export const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600000)
    const minutes = Math.floor((time % 3600000) / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    const pad = (n: number, size = 2) =>
        n.toString().padStart(size, '0')

    return {
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds),
    }
}