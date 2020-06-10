const log = require('loglevel-colors')('bc:Operator');
const io = require('socket.io')();
const SystemInfo = require('./SystemInfo');

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

    handleConnection(client){
        this.client = client;
        log.info('Client Connected');

        //start heartbeat
        this.heartbeat();

        //set up callbacks
    }

    async heartbeat(){
        this.client.emit('heartbeat', {
            beatTimeout: this.beatTimeout,
            ...await this.sysinfo.getVitals()
        });
        setTimeout(() => {
            this.heartbeat();
        }, this.beatTimeout);
    }
}

module.exports = Operator;