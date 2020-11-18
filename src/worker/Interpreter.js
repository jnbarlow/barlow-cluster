const log = require('loglevel-colors')('bc:Interpreter');

/**
 * The Interpreter class acts as a command interpreter, taking instruction from
 * the client and running code, returning the results.
 */
class Interpreter {
    jobs
    /**
     *
     * @param {*} client Socket io Client
     */
    constructor(options){
        const client = options.client;
        this.jobs = options.jobs;
        client.on('foo', ()=>{
            this.handlefoo();
        });
    }

    handlefoo(){
        log.debug('foo!');
    }
}

module.exports = Interpreter;