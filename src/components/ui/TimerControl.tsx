import { Cross, Delete, Pause, Play, RotateCcw, Save } from "lucide-react"
import { memo } from "react"

export const TimerControls = memo(({ id, isRunning, onToggle, onSave, onDelete }: {
    id: string,
    isRunning: boolean,
    onToggle: (id: string) => void,
    onSave: (id: string) => void,
    onDelete?: (id: string) => void ,
}) => {
    return (
        <>

            <div className="flex gap-2 justify-center mt-2">
                <button onClick={() => onToggle(id)} className="cursor-pointer transition-all hover:bg-white/5 p-2">
                    {isRunning ? <Pause /> : <Play/>}
                </button>
                <button onClick={() => onSave(id)} className="cursor-pointer transition-all hover:bg-white/5 p-2">
                    <Save />
                </button>
                {onDelete && (
                    <button onClick={() => onDelete(id)} className="cursor-pointer transition-all hover:bg-white/5 p-2">
                        <Cross className="rotate-45" />
                    </button>
                )}

            </div>
        </>
    )
})