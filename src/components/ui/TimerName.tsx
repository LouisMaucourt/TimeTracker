import { memo } from "react"

export const TimerName = memo(({ id, name, onUpdate }: {
    id: string,
    name: string,
    onUpdate: (id: string, name: string) => void
}) => {
    return (
        <input
            value={name}
            onChange={(e) => onUpdate(id, e.target.value)}
            className="mb-2 text-center bg-transparent outline-none text-3xl uppercase border-b border-transparent focus:border-green-400 transition-all duration-300 hover:bg-white/5 focus:bg-white/10 rounded px-2
"
        />
    )
})