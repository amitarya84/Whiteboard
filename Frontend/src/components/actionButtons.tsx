import { useContext } from "react";
import { SHAPES } from "../App"
import { BoardContext } from "../Context/boardContext";
import { boardType } from "../Context/boardContext";
import { shapeType } from "./board";

export default function ({ setShapes, drawingShape, setDrawingShape, updateBoardDB }: {
    drawingShape: string,
    setDrawingShape: (value: string) => void,
    setClearBoard: (value: boolean) => void,
    setShapes: (value: shapeType[]) => void,
    updateBoardDB: (val: shapeType[]) => Promise<void>,
}) {
    const boardCtx = useContext(BoardContext);

    // function clearBoard() {
    //     console.log('clearing board')
    //     boardCtx?.setWhiteBoard((prv: boardType) => {
    //         prv.shapes = [];
    //         console.log('from inside', prv)
    //         boardCtx?.updateBoardDB(prv);
    //         return prv;
    //     })
    //     // boardCtx?.setShapes([]);
    // }
    
    function ClearMouseDown(){
        // boardCtx?.setWhiteBoard((prv: boardType) => {
        //     prv.shapes = [];
        //     console.log('from inside', prv)
        //     return prv;
        // })
        updateBoardDB([]);
    }
    function ClearMouseUp(){
        // setShapes([]);
    }

    return (
        <div>
            <button style={drawingShape === SHAPES.SELECT ? { 'border': '2px solid #747bff' } : {}}
                onClick={e => setDrawingShape(SHAPES.SELECT)}>Select</button>

            <button style={drawingShape === SHAPES.LINE ? { 'border': '2px solid #747bff' } : {}}
                onClick={e => setDrawingShape(SHAPES.LINE)}>Line</button>

            <button style={drawingShape === SHAPES.TEXT ? { 'border': '2px solid #747bff' } : {}}
                onClick={e => setDrawingShape(SHAPES.TEXT)}>Text</button>

            <button style={drawingShape === SHAPES.CIRCLE ? { 'border': '2px solid #747bff' } : {}}
                onClick={e => setDrawingShape(SHAPES.CIRCLE)}>Ellipse</button>

            <button style={drawingShape === SHAPES.RECTANGLE ? { 'border': '2px solid #747bff' } : {}}
                onClick={e => setDrawingShape(SHAPES.RECTANGLE)} >Rectangle</button>

            <button onMouseDown={ClearMouseDown} onMouseUp={ClearMouseUp} >Clear</button>
        </div>
    )
}