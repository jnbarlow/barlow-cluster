const log = require('loglevel-colors')('bc:Interpreter');

/**
 * The Interpreter class acts as a command interpreter, taking instruction from
 * the client and running code, returning the results.
 */
class Interpreter {
    /**
     *
     * @param {*} client Socket io Client
     */
    constructor(client){
        this.client = client;

        client.on('foo', ()=>{
            this.handlefoo();
        });
    }

    handlefoo(){
        log.debug('foo!');
    }
}

module.exports = Interpreter;