const log = require('loglevel-colors')('bc:Job');
class Job {
    name = null;
    main = async ()=>{};

    /**
     * main constuctor, takes the following options object:
     * {
     *      name: // name of the plugin/job
     *      callback: // main code to kick off your job
     * }
     * @param {*} options
     */
    constructor(options) {
        options = options || {}
        if(!options.name && !this.name) {
            throw 'Job name required';
        }

        if(!this.name) {
            this.name = options.name;
        }

        if(options.callabck){
            this.main = callback
        }
    }

    /**
     * this is the main process runner for the job.  It takes the payload passed
     * from the manager and runs it on the defined callback. The callback can be as simple as an
     * inline function, or as complex as an exported function from an elaborate package that does a ton of
     * behind the scenes work.
     * @param {*} payload
     */
    async run(payload) {
        return await this.callback(payload);
    }

    /**
     * returns the name of the plugin/job. Used for registration
     */
    getName(){
        return this.name;
    }
}

module.exports = Job;