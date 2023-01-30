import { SyntheticEvent } from "react"

interface popsType {
    id: string,
    style: {},
    shapeProps: {
        cx: string,
        cy: string,
        rx: string,
        ry: string,
    }
    onHover: (e: SyntheticEvent) => void,
    onHoverEnd: (e: SyntheticEvent) => void,
}
export default function Ellipse({
    id,
    style,
    shapeProps,
    onHover,
    onHoverEnd
}: popsType) {

    return (
        <ellipse
            id={id}
            style={style}
            cx={shapeProps.cx}
            cy={shapeProps.cy}
            rx={shapeProps.rx}
            ry={shapeProps.ry}
            onMouseLeave={onHoverEnd}
            onMouseEnter={onHover}
        />
    )
}