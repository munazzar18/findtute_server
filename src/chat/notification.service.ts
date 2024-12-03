import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";


@Injectable()
export class NotificationService {
    private server: Server

    setServer(server: Server) {
        this.server = server;
    }

    sendToRoom(roomId: string, event: string, data: any) {
        if (this.server) {
            this.server.to(roomId).emit(event, data);
        }
    }

    broadcast(event: string, data: any) {
        if (this.server) {
            this.server.emit(event, data);
        }
    }

}