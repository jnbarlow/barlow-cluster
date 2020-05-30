const bonjour = require('bonjour')();

class Worker {
    constructor(options) {
        //fill out our options here.
        options = {
            ...{
                port: 22580
            },
            ...(options || {})
        };
        
        //start up express with socket.io
    
        //publish that we're up
        bonjour.publish({
            name: 'Barlow Cluster Worker',
            type: 'barlow-compute-worker',
            port: options.port,
            address:'<todo>'
        });
    }
}

module.exports = Worker;