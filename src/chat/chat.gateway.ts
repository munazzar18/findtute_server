import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
    OnGatewayInit,
    OnGatewayDisconnect,
    OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/chat',
})

export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;


    constructor(
        private readonly chatService: ChatService,
        private readonly jwtService: JwtService
    ) { }

    afterInit(server: Server) {
        console.log('Chat gateway initialized');
    }

    // Log when a new client connects

    handleConnection(client: Socket) {
        // console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        // console.log(`Client Disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinChat')
    async handleJoinChat(
        @MessageBody('applicationId') applicationId: string,
        @MessageBody('chatId') chatId: string,
        @ConnectedSocket() client: Socket,
    ) {
        const token = client.handshake.auth.token;
        const user = this.jwtService.verify(token);

        try {
            console.log(`User ${user.id} is trying to join chat with applicationId: ${applicationId}`);

            const room = await this.chatService.getRoomByChatId(chatId);


            // Join the shared room
            client.join(room.id);
            console.log(`User ${user.id} joined room ${room.id}`);

            // return { success: true, chatId: chat.id, roomId };
        } catch (error) {
            console.error('Error in handleJoinChat:', error);
            return { success: false, message: error.message };
        }
    }


    @SubscribeMessage('sendMessage')
    async handleMessage(
        @MessageBody('chatId') chatId: string,
        @MessageBody('content') content: string,
        @ConnectedSocket() client: Socket,
    ) {
        const token = client.handshake.auth.token;
        const user = this.jwtService.verify(token);
        try {
            const room = await this.chatService.getRoomByChatId(chatId);
            const message = await this.chatService.saveMessage(chatId, user.id, content);
            client.to(room.id).emit('newMessage', message);

        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    @SubscribeMessage('startScreenShare')
    async handleStartScreenShare(
        @MessageBody('chatId') chatId: string,
        @ConnectedSocket() client: Socket,
    ) {
        const token = client.handshake.auth.token;
        const user = this.jwtService.verify(token);
        client.to(chatId).emit('screenShareStarted', { userId: user.id, username: user.username });
    }

    @SubscribeMessage('stopScreenShare')
    async handleStopScreenShare(
        @MessageBody('chatId') chatId: string,
        @ConnectedSocket() client: Socket,
    ) {
        const token = client.handshake.auth.token;
        const user = this.jwtService.verify(token);
        client.to(chatId).emit('screenShareStopped', { userId: user.id, username: user.username });
    }

    @SubscribeMessage('shareScreenData')
    async handleShareScreenData(
        @MessageBody('chatId') chatId: string,
        @MessageBody('screenData') screenData: string,
        @ConnectedSocket() client: Socket,
    ) {
        const token = client.handshake.auth.token;
        const user = this.jwtService.verify(token);
        const room = await this.chatService.getRoomByChatId(chatId);
        client.to(room.id).emit('receiveScreenData', screenData);

    }
}
