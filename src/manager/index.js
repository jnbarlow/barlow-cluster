const bonjour = require('bonjour')();
const log = require('loglevel-colors')('bc:Manager');
const CentralRegistration = require('./CentralRegistration');
const express = require('express');
const EventEmitter = require('events').EventEmitter;
class Manager extends EventEmitter{
    constructor(options){
        super();
         //fill out our options here.
         options = {
            ...{
                port: 22581
            },
            ...(options || {})
        };
        log.info('Starting Barlow Cluster Manager...');
        this.cr = new CentralRegistration();

        log.info('Looking for Workers...');
        const browser = bonjour.find({type:'barlow-cluster-worker'});

        browser.on('up', (service) => {
            this.cr.register(service);
            this.emit('ready');
        });

        browser.on('down', (service) => {
            this.cr.deregister(service)
        });

        this.io = this.webServer(options);
        this.cr.on('beat', (data)=>{
            this.handleBeat(data);
        })
    }

    /**
     * starts up the status web server and socket connection for updates.
     * options.port (default 22581)
     * @param {*} options
     */
    webServer(options){
        log.info(`Starting status page on port ${options.port}`);
        const path = require('path');
        const app = express();
        app.use('/vendor', express.static('./node_modules/barlow-cluster/node_modules'));
        const server = require('http').Server(app);
        const io = require('socket.io')(server);
        const statusPage = path.resolve('./node_modules/barlow-cluster/src/manager/html/status.html');

        app.get('/', (req,res,next)=>{
            res.sendFile(statusPage);
        });

        server.listen(options.port);
        return io;
    }

    /**
     * handle the heartbeat from the client, just emit the data for the web page to show.
     * @param {*} data
     */
    handleBeat(data){
        this.io.emit('beat', data);
    }

    //test stub for sending jobs
    sendJob(data){
        log.info('Registering Job');
        this.cr.sendJob(data);
    }
}

module.exports = Manager;