import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FileUrlInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => {
                const baseUrl = process.env.BASE_URL || 'http://localhost:3500';

                // Check if data contains a "data" field that is an array of users
                if (data && Array.isArray(data.data)) {
                    data.data.forEach(user => {
                        if (user.avatar && user.avatar.startsWith('/images')) {
                            user.avatar = `${baseUrl}${user.avatar}`;
                        }
                    });
                } else if (data && data.data && data.data.avatar && data.data.avatar.startsWith('/images')) {
                    // If it's a single user object in data.data, modify directly
                    data.data.avatar = `${baseUrl}${data.data.avatar}`;
                }

                return data;
            })
        );
    }
}
