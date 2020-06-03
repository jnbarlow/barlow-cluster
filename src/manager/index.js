const bonjour = require('bonjour')();
const log = require('loglevel-colors')('bc:Manager');
class Manager {
    constructor(){
        log.info('Starting Barlow Cluster Manager...');
        log.info('Looking for Workers...');
        var browser = bonjour.find({type:'barlow-cluster-worker'});
        
        browser.on('up', (service)=>{
            console.log('found service');
        });

        browser.on('down', (service)=>{
            console.log('lost service');
        });

    }
}

module.exports = Manager;