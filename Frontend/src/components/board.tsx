import { createContext, SyntheticEvent, useContext, useEffect, useRef, useState } from "react"
import styles from './board.module.css';
import Ellipse from "./shapes/ellipse";
import Polyline from "./shapes/polyline";
import Text from "./shapes/text";
import Rect from "./shapes/rect";
import { SHAPES } from "../App";
import { BoardContext, boardType, providerValueType } from "../Context/boardContext";
import { SocketContext } from "../Context/socketProvider";
import ActionButtons from "./actionButtons";

export interface shapeType {
    id: string,
    type: string,
    style: {},
    props: any
}

interface propType {
    // drawingShape: string,
    // clearBoard: boolean,
    setClearBoard: (val: boolean) => void
}
export default function Board({ setClearBoard }: propType) {
    const ctx = useContext(BoardContext) as providerValueType;
    const socketCtx = useContext(SocketContext);

    const boardRef = useRef<HTMLDivElement>(null);
    const [drawingShape, setDrawingShape] = useState(SHAPES.LINE);
    const [shapes, setShapes] = useState<shapeType[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [pressed, setPressed] = useState(false);
    const [users, setUsers] = useState([]);


    async function updateBoardDB(boardShapeData: shapeType[]) {
        console.log('sending fro updateBoardDb', boardShapeData)
        ctx?.setWhiteBoard((prv: boardType) => {
            prv.shapes = boardShapeData;

            fetch(ctx.serverUrl + 'whitebaord', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...prv })
            }).then(res => res.json())
                .then(data => {
                    console.log('updateBoard', data)
                    if (data.modifiedCount > 0) {
                        console.log('emmited')
                        setShapes(boardShapeData)
                        socketCtx?.socket?.emit('board_updated', { roomId: ctx.whiteBoard?._id, userId: '1forNow' })
                    } else {
                        console.log('BoadDB not updated')
                    }
                    // console.log('res data', data, boardData)
                    // console.log('emitted', socketCtx?.socket?.emit('board_updated', { roomId: whiteBoard?._id, userId: '1forNow' }));
                }).catch(err => console.log(err));

            return prv;
        })
    }



    useEffect(() => {

        let board = boardRef.current;

        function startDrawing(e: MouseEvent) {
            let ox = e.offsetX;
            let oy = e.offsetY;
            let points = `${ox},${oy} `; //space in the end of string is required


            if (drawingShape === SHAPES.LINE) {

                let style = {
                    fill: 'none',
                    stroke: 'black',
                    strokeWidth: 3
                }

                let shape = {
                    id: Math.random() + '',
                    type: drawingShape,
                    style: style,
                    props: {
                        points: points,
                    },
                }

                setShapes(prv => [...prv, shape])
                // console.log(shapes.length)
                setCurrentIndex(shapes.length);

            }
            if (drawingShape === SHAPES.CIRCLE) {

                let style = {
                    fill: 'none',
                    stroke: 'black',
                    strokeWidth: 3
                }

                let shape = {
                    id: Math.random() + '',
                    type: drawingShape,
                    style: style,
                    props: {
                        cx: ox,
                        cy: oy,
                        rx: 0,
                        ry: 0,
                    },
                }

                setShapes(prv => [...prv, shape])
                // console.log(shapes.length)
                setCurrentIndex(shapes.length);

            }
            if (drawingShape === SHAPES.RECTANGLE) {

                let style = {
                    fill: 'none',
                    stroke: 'black',
                    strokeWidth: 3
                }

                let shape = {
                    id: Math.random() + '',
                    type: drawingShape,
                    style: style,
                    props: {
                        x: ox,
                        y: oy,
                        width: 0,
                        height: 0,
                    },
                }

                setShapes(prv => [...prv, shape])
                // console.log(shapes.length)
                setCurrentIndex(shapes.length);

            }

            if (drawingShape === SHAPES.TEXT) {

                let style = {
                    fill: 'none',
                    stroke: 'black',
                    strokeWidth: 2,

                }

                let shape = {
                    id: Math.random() + '',
                    type: drawingShape,
                    style: style,
                    props: {
                        x: ox,
                        y: oy,
                        text: 'Hello'
                    },
                }

                setShapes(prv => [...prv, shape])
                // console.log(shapes.length)
                setCurrentIndex(shapes.length);

            }

            setPressed(true);
        }

        function keepDrawing(e: MouseEvent) {
            if (pressed) {
                console.log('moved pressed', pressed)
                let ox = e.offsetX;
                let oy = e.offsetY;

                if (drawingShape === SHAPES.LINE) {
                    let points = shapes[currentIndex].props.points + `${ox},${oy} `;

                    setShapes(prv => {
                        let id = prv[currentIndex].id;
                        let line = document.getElementById(id);
                        line?.setAttribute('points', points);
                        prv[currentIndex].props.points = points;
                        return prv;
                    })
                }
                if (drawingShape === SHAPES.CIRCLE) {
                    setShapes(prv => {
                        let id = prv[currentIndex].id;
                        let circle = document?.getElementById(id);
                        let rx = Math.abs(ox - Number(shapes[currentIndex].props.cx)) as string | number;
                        let ry = Math.abs(oy - Number(shapes[currentIndex].props.cy)) as string | number;
                        circle?.setAttribute('rx', rx.toString());
                        circle?.setAttribute('ry', ry.toString());
                        prv[currentIndex].props.rx = rx;
                        prv[currentIndex].props.ry = ry;
                        return prv;
                    })
                }
                if (drawingShape === SHAPES.RECTANGLE) {
                    console.log('keep rect')
                    setShapes(prv => {
                        let id = prv[currentIndex].id;
                        let rect = document?.getElementById(id);
                        let w = Math.abs(ox - Number(shapes[currentIndex].props.x)) as string | number;
                        let h = Math.abs(oy - Number(shapes[currentIndex].props.y)) as string | number;
                        rect?.setAttribute('width', w.toString());
                        rect?.setAttribute('height', h.toString());
                        prv[currentIndex].props.width = w;
                        prv[currentIndex].props.height = h;
                        return prv;
                    })
                }
            }

        }


        function endDrawing(e: MouseEvent) {
            console.log('end', pressed)
            if (pressed) {
                setClearBoard(false);
                ctx.setWhiteBoard((prv: boardType) => {
                    prv.shapes = shapes;
                    console.log('from inside', prv)
                    return prv;
                })
                updateBoardDB(shapes);
            }
            setPressed(false);
        }

        board?.addEventListener('mousedown', startDrawing);
        board?.addEventListener('mousemove', keepDrawing);
        window?.addEventListener('mouseup', endDrawing);

        return () => {
            board?.removeEventListener('mousedown', startDrawing);
            board?.removeEventListener('mousemove', keepDrawing);
            window?.removeEventListener('mouseup', endDrawing);
        }
    })


    function fetchBoardData(id: string) {
        console.log('fetting board data', id)
        if (id) {
            fetch(ctx.serverUrl + 'whitebaord/' + id)
                .then(res => res.json())
                .then(data => {
                    console.log('fetch board', data);
                    ctx.setWhiteBoard((brd: boardType) => {
                        brd.shapes = data.shapes;
                        return brd;
                    });
                    setShapes(data.shapes);
                })
                .catch(err => console.log('Fetch', err))
        } else {
            console.log('fetchBoardData id not found')
        }
    }


    useEffect(() => {
        socketCtx?.socket?.on('board_updated', ({ userId, BoardUsers }) => {
            console.log('Board Updated', BoardUsers)
            setUsers(BoardUsers);
            // alert('Board Updated')
            fetchBoardData(ctx.whiteBoard._id);
        })
        socketCtx?.socket?.on('New_User', ({ BoardUsers }) => {
            console.log('New User', BoardUsers)
            setUsers(BoardUsers);
        })
        socketCtx?.socket?.on('User_Disconnect', ({ BoardUsers }) => {
            console.log('Disconnected', BoardUsers)
            setUsers(BoardUsers);
        })
        socketCtx?.socket?.on('disconnect', () => {
            console.log('Dissconnected')
        })

        return () => {
            socketCtx?.socket?.removeListener('board_updated')
            socketCtx?.socket?.removeListener('New_User')
            socketCtx?.socket?.removeListener('disconnect')
        }
    }, [socketCtx?.socket])

    function shapeHover(e: SyntheticEvent) {
        // console.log(e)
        if (!pressed) {
            let elm = e.target as HTMLElement;
            elm.style.stroke = 'red';
        }
    }
    function shapeHoverEnd(e: SyntheticEvent) {
        // console.log(e.target)
        let elm = e.target as HTMLElement;
        elm.style.stroke = 'black';
    }

    return (
        <div className={styles.container} >
            <h3>Active User: {users.length}</h3>
            <ActionButtons updateBoardDB={updateBoardDB} setShapes={setShapes} drawingShape={drawingShape} setDrawingShape={setDrawingShape} setClearBoard={setClearBoard} />
            <div ref={boardRef}>

                <svg  width={document?.body?.clientWidth * 0.8} height={document?.body?.clientHeight * 0.8}>
                    {shapes?.map(
                        shape => {
                            switch (shape.type) {
                                case SHAPES.LINE:
                                    return <Polyline
                                        id={shape.id}
                                        key={shape.id}
                                        style={shape.style}
                                        onHover={shapeHover}
                                        onHoverEnd={shapeHoverEnd}
                                        shapeProps={shape.props}
                                    />
                                case SHAPES.CIRCLE:
                                    return <Ellipse
                                        onHoverEnd={shapeHoverEnd}
                                        onHover={shapeHover}
                                        id={shape.id} key={shape.id}
                                        shapeProps={shape.props}
                                        style={shape.style}
                                    />
                                case SHAPES.RECTANGLE:
                                    return <Rect
                                        onHoverEnd={shapeHoverEnd}
                                        onHover={shapeHover}
                                        id={shape.id} key={shape.id}
                                        shapeProps={shape.props}
                                        style={shape.style}
                                    />
                                case SHAPES.TEXT:
                                    return <Text
                                        onHoverEnd={shapeHoverEnd}
                                        onHover={shapeHover}
                                        id={shape.id} key={shape.id}
                                        shapeProps={shape.props}
                                        style={shape.style}
                                    />
                            }
                        }
                    )}
                </svg>
            </div>

        </div>
    )
}