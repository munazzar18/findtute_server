// chat.controller.ts
import { Body, ClassSerializerInterceptor, Controller, Get, Param, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/auth.guard';
import { sendJson } from 'src/helpers/helpers';

@Controller('chat')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) { }


    @Get('/:chatId/messages')
    async getChatMessages(@Param('chatId') chatId: string) {
        const messages = await this.chatService.getChatMessages(chatId);
        return sendJson(true, 'Messages fetched successfully', messages);
    }

    @Get('rooms')
    async getUserRooms(@Request() req) {
        const userId = req.user.id;
        if (!userId) {
            return sendJson(false, 'User ID is required', null);
        }
        const rooms = await this.chatService.getUserRooms(userId);
        return sendJson(true, 'User rooms fetched successfully', rooms);
    }
}
