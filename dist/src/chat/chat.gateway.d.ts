import { UserService } from './../user/user.service';
import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
interface ChatMessage {
    userId: string;
    room: string;
    message: string;
}
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly userService;
    server: Server;
    private logger;
    constructor(jwtService: JwtService, userService: UserService);
    private clients;
    afterInit(server: Server): void;
    handleConnection(socket: Socket, ...args: any[]): void;
    handleDisconnect(socket: Socket): void;
    handleJoinRoom(room: string, socket: Socket): void;
    handleLeaveRoom(room: string, socket: Socket): void;
    handleMessage(data: ChatMessage, socket: Socket): void;
    handleSignal(data: any, socket: Socket): void;
}
export {};
