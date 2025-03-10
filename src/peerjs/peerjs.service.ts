import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ExpressPeerServer } from 'peer';
import { HttpAdapterHost } from '@nestjs/core';

@Injectable()
export class PeerJsService implements OnModuleInit, OnModuleDestroy {
    private peerServer: any;

    constructor(private httpAdapterHost: HttpAdapterHost) { }

    onModuleInit() {
        const { httpAdapter } = this.httpAdapterHost;
        const app = httpAdapter.getInstance();

        // Create ExpressPeerServer
        this.peerServer = ExpressPeerServer(app, {
            path: '/peerjs',
            port: 9000,
            proxied: true,
        });

        // Use PeerJS server with Express
        app.use('/peerjs', this.peerServer);

        console.log('PeerJS server initialized');

        // Optional: Add event listeners
        this.peerServer.on('connection', (client) => {
            console.log('Client connected to PeerJS server:', client.getId());
        });

        this.peerServer.on('disconnect', (client) => {
            console.log('Client disconnected from PeerJS server:', client.getId());
        });
    }

    onModuleDestroy() {
        if (this.peerServer) {
            // Close PeerJS server
            console.log('Closing PeerJS server');
        }
    }
}