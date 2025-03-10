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
                request.user = decoded;
                return true;
            } catch (error) {
                return false;

            }
        } else {
            return false;

        }
    }

    private getRequest(context: ExecutionContext): any {

        if (context.getType() === 'http') {
            return context.switchToHttp().getRequest();
        } else {
            return context.switchToWs().getClient().handshake;
        }
    }

    private extractToken(request: any): string | null {
        const authHeader = request.headers.authorization;
        if (!authHeader) return null;
        const [, token] = authHeader.split(' ');
        return token;
    }
}
