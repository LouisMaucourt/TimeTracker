interface Props {
    hours: string,
    minutes: string,
    seconds: string,
    className?: string;
    style?: React.CSSProperties;
}
export const Clock = ({ hours, minutes, seconds, className, style }: Props) => {

    
    return (
        <div
            className={`font-bold text-9xl ${className}`}
            style={style}
        >
            {hours}:{minutes}:{seconds}
        </div>
    )
}