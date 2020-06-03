const log = require('loglevel-colors')('bc:SystemInfo');
const si = require('systeminformation');

class SystemInfo {
    /**
     * get the capabilities of the server.
     */
    async getCapabilities(){
        
        const cpu = await si.cpu();
        const mem = await si.mem();
        const network = (await (await si.networkInterfaces()).filter(item =>{
            if(
                !item.virtual 
                && !item.internal
                && item.operstate == 'up'
                && (item.ip4 != '' || item.ip6 != '')
            ){
                return item;
            }
        }));

        return {
            cpu: {
                type: `${cpu.manufacturer} ${cpu.brand}`,
                cores: cpu.cores,
                physicalCores: cpu.physicalCores,
                speed: cpu.speedmax
            },
            memory: {
                total: mem.total,
                used: mem.used,
                free: mem.free
            },
            network: {
                ip4: network[0].ip4,
                ip6: network[0].ip6
            }
        }
    }

    /**
     * Generates the message of the day with specs and such
     */
    generateMOTD(sysinfo){
        const memTotal = sysinfo.memory.total/1024/1024/1024;
        const memFree = sysinfo.memory.free/1024/1024/1024;
        return `

    CPU: ${sysinfo.cpu.type} ${sysinfo.cpu.speed}Ghz, ${sysinfo.cpu.physicalCores} cores / ${sysinfo.cpu.cores} threads
    Memory: ${memTotal.toPrecision(4)}GB total, ${memFree.toPrecision(4)}GB total
    Network: 
        ipv4: ${sysinfo.network.ip4}
        ipv6: ${sysinfo.network.ip6}
            `;
    }
}

module.exports = SystemInfo;