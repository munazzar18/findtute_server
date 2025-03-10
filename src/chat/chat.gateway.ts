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

    private screenSharingSessions = new Map<string, string>();


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

    async handleConnection(client: Socket) {
        const token = client.handshake.auth.token;
        const user = this.jwtService.verify(token);
        // console.log(`Client connected: ${client.id}`);

        client.on('socketId', async (socketId) => {
            await this.userService.updateUser(user.id, { socketId: socketId })
        })
    }

    async handleDisconnect(client: Socket) {
        try {
            const token = client.handshake.auth.token;
            if (!token) return;

            const user = this.jwtService.verify(token);
            if (!user) return;

            // Check if this user is sharing in any room
            for (const [roomId, userId] of this.screenSharingSessions.entries()) {
                if (userId === user.id) {
                    this.screenSharingSessions.delete(roomId);
                    this.server.to(roomId).emit('screenShare:ended', { userId: user.id });
                }
            }
        } catch (error) {
            console.error('Error in handleDisconnect:', error);
        }
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
            const room = await this.chatService.getRoomByChatId(chatId);
            client.join(room.id);
            this.notificationService.sendToRoom(room.id, 'notification', { from: user.username, chatId, content: 'is online', userId: user.id })
            const sharingUserId = this.screenSharingSessions.get(room.id);
            console.log("sharingUserId", sharingUserId)
            if (sharingUserId) {
                client.emit('screenShare:active', { userId: sharingUserId, roomId: room.id });
            }
            //  else {
            //     this.screenSharingSessions.set(room.id, user.id);
            //     client.emit('screenShare:active', { userId: user.id, roomId: room.id });
            // }
            return { success: true };
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
            this.server.to(room.id).emit('newMessage', message)

            const owner = room.owner
            const recipient = room.other_user

            if (user.id === owner.id) {
                this.notificationService.sendToUser(recipient.socketId, 'notification', { from: user.username, chatId, content, userId: user.id })

            } else {
                this.notificationService.sendToUser(owner.socketId, 'notification', { from: user.username, chatId, content, userId: user.id })
            }

            let messageStatus = 'Sent'

            client.emit('messageStatus', { messageId: message.id, status: messageStatus })

            return { success: true, message };


        } catch (error) {
            return { success: false, message: error.message };
        }
    }


    @SubscribeMessage('deleteMessage')
    async handleDeleteMessage(
        @MessageBody('messageId') messageId: string,
        @ConnectedSocket() client: Socket,
    ) {
        const token = client.handshake.auth.token;
        const user = this.jwtService.verify(token);
        try {
            const message = await this.chatService.deleteMessage(messageId, user.id);
            return { success: true, message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Screen sharing handlers
    @SubscribeMessage('screenShare:start')
    async handleStartScreenShare(
        @MessageBody('roomId') roomId: string,
        @ConnectedSocket() client: Socket,
    ) {
        console.log("Screen share started")
        const token = client.handshake.auth.token;
        const user = this.jwtService.verify(token);

        try {
            // Register this user as the screen sharer for this room
            this.screenSharingSessions.set(roomId, user.id);

            // Notify everyone in the room
            this.server.to(roomId).emit('screenShare:started', {
                userId: user.id,
                roomId
            });



            return { success: true };
        } catch (error) {
            console.error('Error in handleStartScreenShare:', error);
            return { success: false, message: error.message };
        }
    }

    @SubscribeMessage('screenShare:stop')
    async handleStopScreenShare(
        @MessageBody('roomId') roomId: string,
        @ConnectedSocket() client: Socket,
    ) {
        const token = client.handshake.auth.token;
        const user = this.jwtService.verify(token);

        try {
            // Check if this user is the one sharing
            const currentSharingUserId = this.screenSharingSessions.get(roomId);
            if (currentSharingUserId !== user.id) {
                return { success: false, message: 'You are not currently sharing your screen' };
            }

            // Remove screen sharing session
            this.screenSharingSessions.delete(roomId);

            // Notify everyone
            this.server.to(roomId).emit('screenShare:ended', {
                userId: user.id,
                roomId
            });

            return { success: true };
        } catch (error) {
            console.error('Error in handleStopScreenShare:', error);
            return { success: false, message: error.message };
        }
    }

    @SubscribeMessage('signal')
    async handleSignal(
        @MessageBody('roomId') roomId: string,
        @MessageBody('signal') signal: any,
        @MessageBody('to') targetUserId: string,
        @ConnectedSocket() client: Socket,
    ) {
        console.log("I am here!!!!!!!!!!!!!!!!!!!!!!!!!")
        const token = client.handshake.auth.token;
        const user = this.jwtService.verify(token);

        try {
            const targetUser = await this.userService.findOneById(targetUserId);
            console.log('Target user:', targetUser);
            if (!targetUser || !targetUser.socketId) {
                return { success: false, message: 'Target user not found or not online' };
            }

            // Just relay the signal to the target user
            this.server.to(targetUser.socketId).emit('signal', {
                signal,
                from: user.id
            });

            return { success: true };
        } catch (error) {
            console.error('Error in handleSignal:', error);
            return { success: false, message: error.message };
        }
    }


    @SubscribeMessage('offer')
    async handleOffer(
        @MessageBody('roomId') roomId: string,
        @MessageBody('offer') offer: any,
        @MessageBody('targetUserId') targetUserId: string,
        @ConnectedSocket() client: Socket,
    ) {
        const token = client.handshake.auth.token;
        const user = this.jwtService.verify(token);

        try {
            // Get target user's socket ID
            const targetUser = await this.userService.findOneById(targetUserId);
            if (!targetUser || !targetUser.socketId) {
                return { success: false, message: 'Target user not found or not connected' };
            }

            // Send offer directly to the target user
            this.server.to(targetUser.socketId).emit('offer', {
                offer,
                from: user.id
            });

            return { success: true };
        } catch (error) {
            console.error('Error in handleOffer:', error);
            return { success: false, message: error.message };
        }
    }

    @SubscribeMessage('answer')
    async handleAnswer(
        @MessageBody('roomId') roomId: string,
        @MessageBody('answer') answer: any,
        @MessageBody('targetUserId') targetUserId: string,
        @ConnectedSocket() client: Socket,
    ) {
        const token = client.handshake.auth.token;
        const user = this.jwtService.verify(token);

        try {
            // Get target user's socket ID
            const targetUser = await this.userService.findOneById(targetUserId);
            if (!targetUser || !targetUser.socketId) {
                return { success: false, message: 'Target user not found or not connected' };
            }

            // Send answer directly to the target user
            this.server.to(targetUser.socketId).emit('answer', {
                answer,
                from: user.id
            });

            return { success: true };
        } catch (error) {
            console.error('Error in handleAnswer:', error);
            return { success: false, message: error.message };
        }
    }


    @SubscribeMessage('shareScreenData')
    async handleShareScreenData(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
        const { chatId, sdp } = data;
        const token = client.handshake.auth.token;
        const user = this.jwtService.verify(token);
        const room = await this.chatService.getRoomByChatId(chatId);

        console.log('Broadcasting screen share offer to room:', room.id);

        // Broadcast to everyone in the room except the sender
        client.to(room.id).emit('screenShareOffer', {
            sdp,
            userId: user.id,
            username: user.username
        });
    }

    @SubscribeMessage('screenShareAnswer')
    async handleScreenShareAnswer(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
        const { chatId, sdp, to } = data;
        const token = client.handshake.auth.token;
        const user = this.jwtService.verify(token);

        console.log('Sending screen share answer to:', to);

        // Send the answer directly to the sender
        this.server.to(to).emit('screenShareAnswer', {
            sdp,
            userId: user.id
        });
    }

    @SubscribeMessage('iceCandidate')
    async handleIceCandidate(
        @MessageBody('roomId') roomId: string,
        @MessageBody('candidate') candidate: any,
        @MessageBody('targetUserId') targetUserId: string,
        @ConnectedSocket() client: Socket,
    ) {
        const token = client.handshake.auth.token;
        const user = this.jwtService.verify(token);

        try {
            // Get target user's socket ID
            const targetUser = await this.userService.findOneById(targetUserId);
            if (!targetUser || !targetUser.socketId) {
                return { success: false, message: 'Target user not found or not connected' };
            }

            // Send ICE candidate directly to the target user
            this.server.to(targetUser.socketId).emit('iceCandidate', {
                candidate,
                from: user.id
            });

            return { success: true };
        } catch (error) {
            console.error('Error in handleIceCandidate:', error);
            return { success: false, message: error.message };
        }
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
