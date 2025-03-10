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

    sendToUser(userId: string, event: string, data: any) {
        console.log("userId", userId)
        if (this.server && userId) {
            this.server.to(userId).emit(event, data);
            console.log(`Emitted event '${event}' to user ${userId} with data:`, data);
        } else {
            console.warn("Server not initialized or userId is invalid");
        }
    }

}