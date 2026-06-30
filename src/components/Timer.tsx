    import { useEffect, useState } from 'react'
    import { HistoryTable } from './ui/HistoryTable'
    import { TimerName } from './ui/TimerName'
    import { TimerClock } from './ui/TimerClock'
    import { TimerControls } from './ui/TimerControl'
    import { Plus } from 'lucide-react'
    import { saveTime } from '@/utilis/time';

type Timer = {
    id: string
    name: string
    time: number
    isRunning: boolean
    startedAt: number | null // Date.now() au moment du dernier "start"
}

const createTimer = (): Timer => ({
    id: crypto.randomUUID(),
    name: 'travail',
    time: 0,
    isRunning: false,
    startedAt: null,
})

    export const Timer = () => {
        const [distractionHours, setDistractionHours] = useState<number>(0)
        const [distractionMinutes, setDistractionMinutes] = useState<number>(0)

        const [timers, setTimers] = useState<Timer[]>([createTimer()])
        const [toast, setToast] = useState<string | null>(null)

        const addTimer = () => setTimers(prev => [...prev, createTimer()])
        const deleteTimer = (id: string) => setTimers(prev => prev.filter(t => t.id !== id))
        const toggleTimer = (id: string) =>
            setTimers(prev =>
                prev.map(t => {
                    if (t.id !== id) return t
                    if (t.isRunning) {
                        const elapsed = t.startedAt ? Date.now() - t.startedAt : 0
                        return { ...t, isRunning: false, time: t.time + elapsed, startedAt: null }
                    } else {
                        return { ...t, isRunning: true, startedAt: Date.now() }
                    }
                })
            )
        const renameTimer = (id: string, name: string) =>
            setTimers(prev =>
                prev.map(t => (t.id === id ? { ...t, name } : t))
            )


        const handleSave = (e: React.FormEvent, id: string, name: string, time: number) => {
            e.preventDefault()
            const distractionTime = (distractionHours * 60 + distractionMinutes) * 60 * 1000
            saveTime(time - distractionTime, id, name)
            setToast(null)
            setDistractionHours(0)
            setDistractionMinutes(0)
            if (timers.length > 1) deleteTimer(id)
        }
        const displayTime = (t: Timer) =>
            t.isRunning && t.startedAt ? t.time + (Date.now() - t.startedAt) : t.time

        useEffect(() => {
            const interval = setInterval(() => {
                setTimers(prev => [...prev])
            }, 100)
            return () => clearInterval(interval)
        }, [])

        return (
            <div className="relative grid min-h-screen w-screen items-center justify-center bg-indigo-600 p-6 text-white">
                <HistoryTable />

                {timers.length < 3 && (
                    <button
                        onClick={addTimer}
                        className={`${timers.length > 0 ? 'absolute top-18 left-18' : ''} flex cursor-pointer items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 mb-4 text-white shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/20 active:scale-95`}
                    >
                        Créer un nouveau timer <Plus className="scale-75" />
                    </button>
                )}

                <div
                    className="grid gap-4 mt-6 w-full"
                    style={{ gridTemplateColumns: `repeat(${timers.length}, minmax(0, 1fr))` }}
                >
                    {timers.map(timer => (
                        <div key={timer.id} className="p-4 text-center flex flex-col relative">
                            <TimerName id={timer.id} name={timer.name} onUpdate={renameTimer} />
                            <TimerClock time={displayTime(timer)} scale={1 / timers.length} />
                            <TimerControls
                                id={timer.id}
                                isRunning={timer.isRunning}
                                onToggle={toggleTimer}
                                onSave={setToast}
                                onDelete={timers.length > 1 ? deleteTimer : undefined}
                            />
                            {toast === timer.id && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-black/2 transition-opacity duration-300">
                                    <div className="w-full max-w-xs origin-center scale-100 rounded-2xl border border-white/20 bg-white/10 p-5 text-left text-white opacity-100 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out">
                                        <p className="font-semibold">{timer.name}</p>
                                        <p className="mt-1 text-sm text-white/70">
                                            Combien de temps "distracted" (honnêtement) ?
                                        </p>
                                        <form
                                            onSubmit={(e) => handleSave(e, timer.id, timer.name, timer.time)}
                                            className="mt-4 flex flex-col gap-2"
                                        >
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <label className="mb-1 block text-xs text-white/50">Heures</label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={distractionHours}
                                                        onChange={(e) => setDistractionHours(Number(e.target.value))}
                                                        placeholder="0"
                                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 outline-none focus:border-white/40"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="mb-1 block text-xs text-white/50">Minutes</label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={59}
                                                        value={distractionMinutes}
                                                        onChange={(e) => setDistractionMinutes(Number(e.target.value))}
                                                        autoFocus
                                                        placeholder="0"
                                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 outline-none focus:border-white/40"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                className="shrink-1 flex-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20 active:scale-95"
                                            >
                                                Confirmer
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="fixed inset-x-0 bottom-6 z-10 w-full select-none text-center text-6xl font-light uppercase tracking-[0.2em] text-white/50 animate-[fineFade_2.8s_ease-in-out_infinite]">
                    don't get distracted
                </div>
            </div>
        )
    }