import { SyntheticEvent } from "react"

interface popsType {
    id: string,
    style: {},
    shapeProps: {
        x: string,
        y: string,
        width: string,
        height: string,
    }
    onHover: (e: SyntheticEvent) => void,
    onHoverEnd: (e: SyntheticEvent) => void,
}
export default function Rect({
    id,
    style,
    shapeProps,
    onHover,
    onHoverEnd
}: popsType) {

    return (
        <rect
            id={id}
            style={style}
            x={shapeProps.x}
            y={shapeProps.y}
            width={shapeProps.width}
            height={shapeProps.height}
            onMouseLeave={onHoverEnd}
            onMouseEnter={onHover}
        />
    )
}