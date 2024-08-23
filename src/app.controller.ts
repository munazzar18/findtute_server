import { Controller, Get } from '@nestjs/common';

@Controller() // This is the default route prefix
export class AppController { // Name the class with the Controller suffix
    constructor() { }

    @Get('/') // This defines a GET route at the root URL '/'
    async getHello() {
        return 'Hello, welcome to TeachU server...';
    }
}
