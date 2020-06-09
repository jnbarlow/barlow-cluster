const log = require('loglevel-colors')('bc:CentralRegistration');
const RegisteredWorker = require('./RegisteredWorker');

/**
 * class designed to handle registration and de-registration of new workers. 
 * Serves as the interface to send out jobs and pull worker status.
 */
class CentralRegistration {
    constructor(){
        //internal cache of workers, keyd by ip address.
        this.workers = {};
    }

    /**
     * registers a new worker into the internal object
     * @param {*} service 
     */
    register(service){
        log.info('Registering new worker...');
        if(!this.workers[service.referer.address]){
            this.workers[service.referer.address] = new RegisteredWorker(service);
            log.info(`...Worker Registered: ${service.referer.address}/${service.txt.id}`);
        } else {
            log.info(`...Worker already registered: ${service.referer.address}/${service.txt.id}`);
        }
    }

    /**
     * deregisters workers.
     * @param {*} service 
     */
    deregister(service){

    }
}

module.exports = CentralRegistration;