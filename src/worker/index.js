const bonjour = require('bonjour')();
const log = require('loglevel-colors')('bc:Worker');
const SystemInfo = require('./SystemInfo')
const Operator = require('./Operator');
const {v4} = require('uuid');

class Worker {
    constructor(options) {
        (async ()=>{
            log.info('Starting Barlow Custer Worker...')
            //fill out our options here.
            options = {
                ...{
                    port: 22580
                },
                ...(options || {})
            };

            //initialize the operator for socket stuff
            this.operator = new Operator(options);

            //get capabilities
            const si = new SystemInfo();
            log.info('Gathering System Capabilities...');
            const sysinfo = await si.getCapabilities();
            log.info(si.generateMOTD(sysinfo));

            //generate node id
            this.id = v4();
            log.info(`Node ID: ${this.id}`);
        
            //publish that we're up
            bonjour.publish({
                name: `BCW-${this.id}`,
                type: 'barlow-cluster-worker',
                port: options.port,
                txt: {
                    capabilities: sysinfo,
                    id: this.id
                }
            });
            log.info('Broadcasting via Bonjour.');
        })();
    }
}

module.exports = Worker;