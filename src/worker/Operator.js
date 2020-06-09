const log = require('loglevel-colors')('bc:Operator');
const io = require('socket.io')();

class Operator{
    constructor(options){
        log.info('Configuring socket server.');
        io.on('connection', (client) => {
            this.handleConnection(client);
        });

        io.listen(options.port);
        log.info(`Listening on port ${options.port}`);
    }

    handleConnection(client){
        console.log('client connected')
    }
}

module.exports = Operator;