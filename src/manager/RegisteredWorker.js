const log = require('loglevel-colors')('bc:RegisteredWorker');
const socket = require('socket.io-client');

/**
 * Class representing a registered worker.  This keeps track of all the metadata as well as serves
 * for the interface to send and receive work, as well as connecting and keep alive stuff.
 */
class RegisteredWorker{
    constructor(service){
        this.capabilities = service.txt.capabilities;
        this.address = service.referer.address;
        this.port = service.port;
        this.id = service.txt.id;
        this.io = socket(`http://${this.address}:${this.port}`);
        log.info('Connecting Socket...');

        //set up callbacks
        this.io.on('heartbeat', (data)=>{this.handleHeartbeat(data)});
    }

    handleHeartbeat(data){
        const now = new Date().getTime();
        this.vitals = {
            ...data,
            lastBeat: now,
            expires: now + data.beatTimeout
        }
    }
}

module.exports = RegisteredWorker;