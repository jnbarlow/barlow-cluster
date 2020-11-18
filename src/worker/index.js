const bonjour = require('bonjour')();
const log = require('loglevel-colors')('bc:Worker');
const SystemInfo = require('./SystemInfo')
const Operator = require('./Operator');
const {v4} = require('uuid');

class Worker {
    jobs = {}

    constructor(options) {
        (async ()=>{
            log.info('Starting Barlow Custer Worker...')
            //fill out our options here.
            options = {
                ...{
                    port: 22580,
                    jobs: this.jobs
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

    /**
     * Takes an object that is/inherits from the barlow-cluster Job class.
     * @param {Job} job
     */
    registerJob(job){
        try{
            log.info(`Registering job: ${job.getName()}`);
            this.jobs[job.getName()] = job;
        } catch (e) {
            log.error('Error registering job. ', e);
        }
    }

    /**
     * Takes an array of jobs and registers them
     * @param {Array[jobs]} jobs
     */
    registerJobs(jobs){
        try {
            jobs.forEach(job => {
                try {
                    log.info(`Registering Job: ${job.getName()}`);
                    this.jobs[job.getName()] = job;
                } catch (e) {
                    log.error('Error registering Job. ', e);
                }
            });
        } catch (e) {
            log.error('Error processing Job array. ', e);
        }
    }
}

module.exports = Worker;