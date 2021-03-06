const log = require('loglevel-colors')('bc:SystemInfo');
const si = require('systeminformation');

/**
 * Class to get different bits of system info for a worker.  Cpu type/load, network info, memory usage..
 */
class SystemInfo {
    /**
     * get the capabilities of the server.
     */
    async getCapabilities(){
        return {
            cpu: await this.getCPU(),
            memory: await this.getMemory(),
            load: await this.getLoad(),
            network: await this.getNetwork()
        }
    }

    /**
     * Gets the memory stats for the host system.
     */
    async getMemory(){
        const mem = await si.mem();
        return {
            total: mem.total,
            used: mem.used,
            free: mem.free
        };
    }

    /**
     * gets the CPU stats for the host system
     */
    async getCPU(){
        const cpu = await si.cpu();
        return {
            type: `${cpu.manufacturer} ${cpu.brand}`,
            cores: cpu.cores,
            physicalCores: cpu.physicalCores,
            speed: cpu.speedmax
        };
    }

    /**
     * gets the current CPU load for the host system
     */
    async getLoad(){
        const cpuLoad = await si.currentLoad();
        return {
            currentLoad: cpuLoad.currentload,
            cpus: cpuLoad.cpus.map(cpu =>{
                return cpu.load
            })
        }
    }

    /**
     * gets the network configuration for the host system.
     */
    async getNetwork() {
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
            ip4: network[0].ip4,
            ip6: network[0].ip6
        }
    }

    /**
     * Gets the current vitals of the machine... used for the heartbeat.
     */
    async getVitals() {
        return {
            load: await this.getLoad(),
            memory: await this.getMemory()
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
    Load: ${sysinfo.load.currentLoad.toPrecision(4)}%
    Memory: ${memTotal.toPrecision(4)}GB total, ${memFree.toPrecision(4)}GB free
    Network:
        ipv4: ${sysinfo.network.ip4}
        ipv6: ${sysinfo.network.ip6}
            `;
    }
}

module.exports = SystemInfo;