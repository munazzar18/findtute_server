import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";
import { serializedUser } from "src/user/user.entity";
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(email: string, password: string): Promise<serializedUser>;
}
export {};
