import { Adapter, Room, SocketId } from "socket.io-adapter";
import { Server, Socket } from "socket.io";


class ShishijiAdapter extends Adapter {
    constructor(nsp: any){
        super(nsp);
    }


    broadcast(packet: any, opts: { rooms?: Set<Room>; except?: Set<SocketId> } = {}): void{
        const rooms = opts.rooms || new Set();
        const except = opts.except || new Set();

        const sockets = new Set<SocketId>();

        if (rooms.size > 0){
            rooms.forEach((room) => {
                const clients = this.rooms.get(room);
                if (clients){
                    clients.forEach((clientId) => {
                        if (!except.has(clientId)){
                            sockets.add(clientId);
                        }
                    });
                }
            });
        } else {
            this.nsp.sockets.forEach((socket: Socket) => {
                if (!except.has(socket.id)){
                    sockets.add(socket.id);
                }
            });
        }


        sockets.forEach((socketId) => {
            const socket = this.nsp.sockets.get(socketId);
            if (socket){
                const args = packet.data || [];
                socket.emit(packet.type, ...args);
            }
        });
    }
}


export const createShishijiAdapter = (io: Server) => {
    io.of("/").adapter = new ShishijiAdapter(io.of("/"));
};
