const bonjour = require('bonjour')();
const log = require('loglevel-colors')('bc:Manager');
const CentralRegistration = require('./CentralRegistration');
class Manager {
    constructor(){
        log.info('Starting Barlow Cluster Manager...');
        this.cr = new CentralRegistration();

        log.info('Looking for Workers...');
        const browser = bonjour.find({type:'barlow-cluster-worker'});

        browser.on('up', (service) => {
            this.cr.register(service)
        });

        browser.on('down', (service) => {
            this.cr.deregister(service)
        });
    }
}

module.exports = Manager;