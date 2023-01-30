import { useState, useEffect, useContext, SyntheticEvent } from "react";
import BoardCard from "./boardCard";
import { BoardContext, providerValueType } from "../Context/boardContext";

import { boardType } from "../Context/boardContext";


interface propType {
    setPage: (value: string) => void
}
export default function Home({setPage}: propType) {
    const ctx = useContext(BoardContext) as providerValueType;
    const [boards, setBoards] = useState<boardType[]>();

    useEffect(() => {
        setBoards(ctx?.whiteBoardList)
    }, [ctx?.whiteBoardList])

    function createNewBoard(){
        let boardName = prompt('Enter Whiteboard Name!');

        if(boardName){
            fetch(ctx.serverUrl+'createWhiteboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    boardName: boardName
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                ctx?.setWhiteBoard(data);
                setPage('BoardPage');
            })
            .catch(err => console.log('Create Board', err))
        }

    }
    return (
        <div>
            <button onClick={createNewBoard}>Create New Whiteboard!</button>
            {
                boards?.map(brd => {
                    return <BoardCard setPage={setPage} key={brd._id} board={brd} />
                })
            }
        </div>
    )
}