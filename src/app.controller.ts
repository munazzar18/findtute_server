import { Get } from "@nestjs/common";

export class App {
    constructor() { }



    @Get()
    async getHello() {
        return 'hello welcome to teachu server...'
    }

}