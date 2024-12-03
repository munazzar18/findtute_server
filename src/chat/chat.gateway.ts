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
import { UserService } from 'src/user/user.service';
import { NotificationService } from './notification.service';

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
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly notificationService: NotificationService
    ) { }

    afterInit(server: Server) {
        console.log('Chat gateway initialized');
        this.notificationService.setServer(server)
    }

    // Log when a new client connects

    handleConnection(client: Socket) {
        // console.log(`Client connected: ${client.id}`);
    }

    async handleDisconnect(client: Socket) {

        // try {
        //     const token = client.handshake.auth.token;
        //     const user = this.jwtService.verify(token);

        //     await this.userService.updateUser(user.id, { is_online: false });
        //     client.broadcast.emit('status', { userId: user.id, status: 'You are offline' });

        // } catch (error) {
        //     console.error('Failed to handle disconnect:', error);
        // }

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
            // console.log(`User ${user.id} is trying to join chat with applicationId: ${applicationId}`);

            const room = await this.chatService.getRoomByChatId(chatId);


            // Join the shared room
            client.join(room.id);
            this.notificationService.sendToRoom(room.id, 'notification', { from: user.username, chatId, content: 'has joined the chat', userId: user.id })
            // console.log(`User ${user.id} joined room ${room.id}`);

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
            this.server.to(room.id).emit('newMessage', message);

            this.server.to(room.id).emit('notification', {
                from: user.username,
                chatId,
                content,
                userId: user.id
            });

            let messageStatus = 'Sent'

            client.emit('messageStatus', { messageId: message.id, status: messageStatus })

            const recipientSocket = this.server.sockets.sockets.get(room.other_user.id)



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


    @SubscribeMessage('status')
    async handleStatus(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket
    ) {
        try {
            // Verify the token to get user details
            const token = client.handshake.auth.token;
            const user = this.jwtService.verify(token);

            // Join the user to their own room
            client.join(user.id);

            await this.userService.updateUser(user.id, { is_online: data.online });

            // Emit "online" status to all other users
            client.broadcast.emit('status', { userId: user.id, status: data.online === true ? 'online' : 'offline' });

            // Optionally, send a confirmation back to the current user
            client.emit('status', data.online === true ? 'You are online' : 'You are offline');

        } catch (error) {
            console.error('Token verification failed:', error);
            client.emit('error', 'Authentication failed');
        }
    }

    // Activity event
    @SubscribeMessage('activity')
    async handleActivity(
        @MessageBody() data: any,
        @ConnectedSocket() socket: Socket,
    ) {
        const userRoom = this.getUserRoom(socket.id);
        if (userRoom) {
            socket.broadcast.to(userRoom).emit('activity', data);
        }
    }

    private updateRoomUserList(room: string) {
        this.chatService.getUserRooms(room).then((users) => {
            this.server.to(room).emit('updateUsersList', { users });
        });
    }

    private updateAllRoomsList() {
        this.chatService.getAllActiveRooms().then((rooms) => {
            this.server.emit('roomList', { rooms });
        });
    }

    private userLeavesRoom(socket: Socket) {
        const room = this.getUserRoom(socket.id);
        if (room) {
            // this.chatService.userLeavesApp(socket.id);
            this.server.to(room).emit('message', { name: 'Admin', text: `${socket.id} has left the room` });
            this.updateRoomUserList(room);
            this.updateAllRoomsList();
        }
    }

    private getUserRoom(socketId: string): string | undefined {
        // Fetch the user's current room from your database/service
        return ''; // Implement a way to retrieve the room by socket ID, possibly using chatService or a cache
    }
}
