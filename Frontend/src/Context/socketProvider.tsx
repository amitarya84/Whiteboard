import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client/build/esm/socket";

interface socketCtxType {
    socket: Socket | null,
    setSocket: (value: Socket) => void
}

export const SocketContext = createContext<socketCtxType | null>(null);

const SocketProvider = (props: PropsWithChildren) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    return (
        <SocketContext.Provider value={{socket, setSocket}}>
            {props.children}
        </SocketContext.Provider>
    )
}
export default SocketProvider;