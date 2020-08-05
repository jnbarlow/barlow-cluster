const log = require('loglevel-colors')('bc:Operator');
const io = require('socket.io')();
const SystemInfo = require('./SystemInfo');
const Interpreter = require('./Interpreter');

/**
 * The Operator class acts like a "switchboard" for all the client connections.
 * It handles getting all the connections, setting up the heartbeat, and passing the client
 * off to the Interpreter to run commands.
 */
class Operator{
    constructor(options){
        log.info('Configuring socket server.');
        io.on('connection', (client) => {
            this.handleConnection(client);
        });

        io.listen(options.port);
        log.info(`Listening on port ${options.port}`);

        this.sysinfo = new SystemInfo();
        this.beatTimeout = 5000;
    }

    /**
     * Handles connections from managers.  Starts up the hearbeat process and
     * sets up all callbacks on the client connection to process commands.
     * @param {*} client
     */
    handleConnection(client){
        this.client = client;
        log.info('Client Connected');

        //start heartbeat
        this.heartbeat(client);

        //set up callbacks
        new Interpreter(client);
    }

    /**
     * Sends a heartbeat of system information back to the client.
     * @param {*} client
     */
    async heartbeat(client){
        client.emit('heartbeat', {
            beatTimeout: this.beatTimeout,
            ...await this.sysinfo.getVitals()
        });
        setTimeout(() => {
            this.heartbeat(client);
        }, this.beatTimeout);
    }
}

module.exports = Operator;