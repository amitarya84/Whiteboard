import { createContext, PropsWithChildren, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./socketProvider";

interface shape {
    id: string,
    type: string,
    style: {},
    props: any
}

export interface boardType {
    _id: string,
    name: string,
    shapes: shape[],
    date?: Date
}

export const BoardContext = createContext<providerValueType | null>(null)

export interface providerValueType {
    whiteBoard: boardType,
    setWhiteBoard: (value: {}) => void,
    whiteBoardList: boardType[],
    setWhiteBoardList: (value: boardType[]) => void,
    serverUrl: string,
    // updateBoardDB: (val: boardType) => Promise<void>,
}

const BoardProvider = (props: PropsWithChildren) => {
    const [whiteBoardList, setWhiteBoardList] = useState<boardType[] | null>(null);
    const [whiteBoard, setWhiteBoard] = useState<boardType | null>(null);
    const [serverUrl, setServerUrl] = useState('http://localhost:4000/');

    const socketCtx = useContext(SocketContext);

    // async function updateBoardDB(boardData: boardType) {
    //     console.log('sending fro updateBoardDv', boardData)
    //     fetch('http://localhost:5000/whitebaord', {
    //         method: 'PATCH',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ ...boardData})
    //     }).then(res => res.json())
    //         .then(data => {
    //             console.log('updateBoard', data)
    //             if (data.modifiedCount > 0) {
    //                 console.log('emmited')
    //                 socketCtx?.socket?.emit('board_updated', { roomId: whiteBoard?._id, userId: '1forNow' })
    //             }else{
    //                 console.log('BoadDB not updated')
    //             }
    //             // console.log('res data', data, boardData)
    //             // console.log('emitted', socketCtx?.socket?.emit('board_updated', { roomId: whiteBoard?._id, userId: '1forNow' }));
    //         }).catch(err => console.log(err))
    // }

    useEffect(() => {
        async function getBoards() {
            try {
                let res = await fetch(serverUrl+'whitebaords', {
                    method: 'GET',
                    // mode: 'no-cors'
                });
                // console.log('res', res)
                let data = await res.json();
                // console.log('data', data)
                setWhiteBoardList(data)
            } catch (err) {
                console.log('Error getting Boards', err)
            }
        }
        getBoards()
    }, [])

    return (
        <BoardContext.Provider value={{
            whiteBoard,
            setWhiteBoard,
            whiteBoardList,
            setWhiteBoardList,
            serverUrl,
            // updateBoardDB
        } as providerValueType}>
            {props.children}
        </BoardContext.Provider>
    );
}
export default BoardProvider;