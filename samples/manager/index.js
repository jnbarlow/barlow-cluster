const {BCManager} = require('barlow-cluster');

const bcManager = new BCManager();

bcManager.on('ready', ()=>{
    bcManager.sendJob('foo!!');
});