const log = require('loglevel-colors')('bc:RegisteredWorker');

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
    }
}

module.exports = RegisteredWorker;