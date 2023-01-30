import { SyntheticEvent } from "react"

interface popsType {
    id: string,
    style: {},
    shapeProps: {
        points: string,
    },
    onHover: (e: SyntheticEvent) => void,
    onHoverEnd: (e: SyntheticEvent) => void,
}
export default function Polyline({ shapeProps, style, id, onHover, onHoverEnd }: popsType) {

    return (
        <polyline
            id={id}
            style={style}
            onMouseEnter={onHover}
            onMouseLeave={onHoverEnd}
            points={shapeProps.points}
        />
    )
}