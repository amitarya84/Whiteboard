import { SyntheticEvent } from "react"

interface popsType {
    id: string,
    style: {},
    shapeProps: {
        x: string,
        y: string,
        text: string
    }
    onHover: (e: SyntheticEvent) => void,
    onHoverEnd: (e: SyntheticEvent) => void,
}
export default function Text({
    id,
    style,
    shapeProps,
    onHover,
    onHoverEnd
}: popsType) {

    return (
        <text
            id={id}
            style={style}
            x={shapeProps.x}
            y={shapeProps.y}
            onMouseLeave={onHoverEnd}
            onMouseEnter={onHover}
        >{shapeProps.text}</text>
    )
}