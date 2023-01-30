import { SyntheticEvent, useContext } from "react"
import { BoardContext, providerValueType } from "../Context/boardContext"
import { boardType } from "../Context/boardContext"
import { SocketContext } from "../Context/socketProvider";
import { io } from "socket.io-client";
import styles from './boardCard.module.css';

interface propType { 
    board: boardType,
    setPage: (value: string) => void,

}

export default function BoardCard({ board, setPage }: propType) {
    const ctx = useContext(BoardContext) as providerValueType;
    const socketCtx = useContext(SocketContext);

    const boardCardClick = () => {
        setPage('BoardPage')
        console.log(board)
        ctx?.setWhiteBoard(board);
        
        let roomId = board._id;
        let id = Math.random();
        
        console.log('id', roomId)
        if (roomId && id) {
            let newSocket = io(
                ctx.serverUrl,
                { 
                    query: { roomId, id },
                    transports : ['websocket'],
                }
            );
            socketCtx?.setSocket(newSocket)
            console.log('socket', newSocket);
            
            return () => { newSocket.close() };
        }
    }

    return <div className={styles.boardCard}>
        <h2 style={{marginTop: '20px', cursor: 'pointer'}} onClick={boardCardClick}>
            {board.name}
        </h2>
    </div>
}