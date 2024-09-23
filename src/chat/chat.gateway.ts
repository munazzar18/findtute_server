import { UserService } from './../user/user.service';
;
import { Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

interface ChatMessage {
    userId: string;
    room: string;
    message: string;
}

interface ScreenShareData {
    userId: string;
    room: string;
    screenData: string;
}


@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/chat',
})

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private logger: Logger = new Logger('ChatGateway');

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }


    private clients: Map<string, Socket> = new Map();

    afterInit(server: Server) {
        console.log('WebSocket server initialized');
    }

    handleConnection(socket: Socket, ...args: any[]) {

        const token = socket.handshake.auth.token

        try {
            const decodedToken = this.jwtService.verify(token);
            const userId = decodedToken.id;

            socket.data.userId = userId;
            this.logger.log(`Client connected: User Id - ${userId}`);
        } catch (error) {
            this.logger.error(`Invalid token: ${error}`);
            socket.disconnect();
        }
    }
    handleDisconnect(socket: Socket) {
        this.logger.log(`Client disconnected: User ID - ${socket.data.userId}`);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() socket: Socket) {
        socket.join(room);
        this.logger.log(`User ID ${socket.data.userId} joined room ${room}`);
        socket.to(room).emit('userJoined', {
            userId: socket.data.userId
        })
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(@MessageBody() room: string, @ConnectedSocket() socket: Socket) {
        socket.leave(room);
        this.logger.log(`User ID ${socket.data.userId} left room ${room}`);
        socket.to(room).emit('userLeft', {
            userId: socket.data.userId
        })
    }

    @SubscribeMessage('sendMessage')
    handleMessage(@MessageBody() data: ChatMessage, @ConnectedSocket() socket: Socket) {
        this.logger.log(`Message from User ID ${data.userId} in room ${data.room}: ${data.message}`)
        this.server.to(data.room).emit('receiveMessage', data)
    }

    @SubscribeMessage('signal')
    handleSignal(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
        this.logger.log(`Signal from User ID ${data.userId} in room ${data.room}`)
        const { room, signalData } = data;
        socket.to(room).emit('signal', signalData);
    }

}

