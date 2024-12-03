// auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = this.getRequest(context);
        const token = this.extractToken(request);

        if (token) {
            try {
                const decoded = this.jwtService.verify(token);
                request.user = decoded; // Attach the decoded token to the request object
                return true;
            } catch (error) {
                return false;
                throw new WsException('Invalid token');
            }
        } else {
            return false;
            throw new WsException('No token provided');
        }
    }

    private getRequest(context: ExecutionContext): any {
        // For HTTP requests or WebSocket connections
        if (context.getType() === 'http') {
            return context.switchToHttp().getRequest();
        } else {
            return context.switchToWs().getClient().handshake; // WebSocket handshake
        }
    }

    private extractToken(request: any): string | null {
        const authHeader = request.headers.authorization;
        if (!authHeader) return null;
        const [, token] = authHeader.split(' ');
        return token;
    }
}
