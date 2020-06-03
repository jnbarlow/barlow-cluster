const bonjour = require('bonjour')();
const log = require('loglevel-colors')('bc:Worker');
const SystemInfo = require('./SystemInfo')
const {v4} = require('uuid');

class Worker {
    constructor(options) {
        (async ()=>{
            log.info('Starting Barlow Custer Worker...')
            //fill out our options here.
            options = {
                ...{
                    port: 2580
                },
                ...(options || {})
            };

            
            //get capabilities
            const si = new SystemInfo();
            log.info('Gathering System Capabilities...');
            const sysinfo = await si.getCapabilities();
            log.info(si.generateMOTD(sysinfo));

            //generate node id
            this.id = v4();
            log.info(`Node ID: ${this.id}`);
        
            //start up express with socket.io
        
            //publish that we're up
            bonjour.publish({
                name: 'Barlow Cluster Worker',
                type: 'barlow-compute-worker',
                port: options.port,
                capabilities: sysinfo,
                id: this.id
            });
            log.info('Broadcasting via Bonjour.');
        })();
    }
}

module.exports = Worker;