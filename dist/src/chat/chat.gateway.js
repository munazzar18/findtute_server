"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const user_service_1 = require("./../user/user.service");
;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let ChatGateway = class ChatGateway {
    constructor(jwtService, userService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.logger = new common_1.Logger('ChatGateway');
        this.clients = new Map();
    }
    afterInit(server) {
        console.log('WebSocket server initialized');
    }
    handleConnection(socket, ...args) {
        const token = socket.handshake.auth.token;
        try {
            const decodedToken = this.jwtService.verify(token);
            const userId = decodedToken.id;
            socket.data.userId = userId;
            this.logger.log(`Client connected: User Id - ${userId}`);
        }
        catch (error) {
            this.logger.error(`Invalid token: ${error}`);
            socket.disconnect();
        }
    }
    handleDisconnect(socket) {
        this.logger.log(`Client disconnected: User ID - ${socket.data.userId}`);
    }
    handleJoinRoom(room, socket) {
        socket.join(room);
        this.logger.log(`User ID ${socket.data.userId} joined room ${room}`);
        socket.to(room).emit('userJoined', {
            userId: socket.data.userId
        });
    }
    handleLeaveRoom(room, socket) {
        socket.leave(room);
        this.logger.log(`User ID ${socket.data.userId} left room ${room}`);
        socket.to(room).emit('userLeft', {
            userId: socket.data.userId
        });
    }
    handleMessage(data, socket) {
        this.logger.log(`Message from User ID ${data.userId} in room ${data.room}: ${data.message}`);
        this.server.to(data.room).emit('receiveMessage', data);
    }
    handleSignal(data, socket) {
        console.log("I am signal");
        this.logger.log(`Signal from User ID ${data.userId} in room ${data.room}`);
        const { room, signalData } = data;
        socket.to(room).emit('signal', signalData);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('signal'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleSignal", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: '/chat',
    }),
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map