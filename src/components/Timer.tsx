    import { useEffect, useState } from 'react'
    import { HistoryTable } from './ui/HistoryTable'
    import { TimerName } from './ui/TimerName'
    import { TimerClock } from './ui/TimerClock'
    import { TimerControls } from './ui/TimerControl'
    import { Cross, Save } from 'lucide-react'
    import { saveTime } from '@/utilis/time';

    type Timer = {
        id: string
        name: string
        time: number
        isRunning: boolean
    }

    const createTimer = (): Timer => ({
        id: crypto.randomUUID(),
        name: 'travail',
        time: 0,
        isRunning: false,
    })

    export const Timer = () => {
        const [distractionTime, setDistractionTime] = useState<number>(0)

        const [timers, setTimers] = useState<Timer[]>([createTimer()])
        const [toast, setToast] = useState<string | null>(null)

        const addTimer = () => setTimers(prev => [...prev, createTimer()])
        const deleteTimer = (id: string) => setTimers(prev => prev.filter(t => t.id !== id))
        const toggleTimer = (id: string) =>
            setTimers(prev =>
                prev.map(t =>
                    t.id === id ? { ...t, isRunning: !t.isRunning } : t
                )
            )
        const renameTimer = (id: string, name: string) =>
            setTimers(prev =>
                prev.map(t => (t.id === id ? { ...t, name } : t))
            )

        const handleSave = (e: React.FormEvent, id: string, name: string, time: number) => {
            e.preventDefault()
            saveTime(time - distractionTime, id, name)
            setToast(null)
            setDistractionTime(0)
            timers.length > 1 ? deleteTimer(id) :undefined
        }

        useEffect(() => {
            const interval = setInterval(() => {
                setTimers(prev => prev.map(t => (t.isRunning ? { ...t, time: t.time + 100 } : t)))
            }, 100)
            return () => clearInterval(interval)
        }, [])

        return (
            <div className="grid items-center justify-center min-h-screen w-screen bg-indigo-600 text-white p-6">
                <HistoryTable />

                {timers.length < 3 && (
                    <button
                        onClick={addTimer}
                        className={`${timers.length > 0 ? 'absolute bottom-9 right-9' : ''} cursor-pointer transition-all hover:bg-white/5 p-2 mb-4 border px-4 py-2 rounded-full flex gap-3`}
                    >
                        Créer un nouveau timer <Cross className="scale-75" />
                    </button>
                )}


                <div
                    className="grid gap-4 mt-6 w-full"
                    style={{ gridTemplateColumns: `repeat(${timers.length}, minmax(0, 1fr))` }}
                >
                    {timers.map(timer => (
                        <div key={timer.id} className="p-4 text-center flex flex-col relative">
                            <TimerName id={timer.id} name={timer.name} onUpdate={renameTimer} />
                            <TimerClock time={timer.time} scale={1 / timers.length} />
                            <TimerControls
                                id={timer.id}
                                isRunning={timer.isRunning}
                                onToggle={toggleTimer}
                                onSave={setToast}
                                onDelete={timers.length > 1 ? deleteTimer : undefined}
                            />
                            {toast === timer.id && <div className="absolute w-2xl bg-white text-black">
                                {timer.name}
                                COmbien de temps de distraction (honnetement) ?
                                <form onSubmit={(e) => handleSave(e,timer.id, timer.name, timer.time)}>
                                    <input
                                        type="number"
                                        value={distractionTime}
                                        onChange={(e) => setDistractionTime(Number(e.target.value))}></input>
                                    <button type="submit">confirmer</button>
                                </form>
                            </div>}
                        </div>
                    ))}
                </div>
            </div>
        )
    }