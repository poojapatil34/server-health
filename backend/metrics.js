const si=require('systeminformation');

async function getMetrics(){
    const [cpu,mem,disks]=await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.fsSize()
    ])

    const cpuPercent=Number(cpu.currentLoad.toFixed(1));  //cpu usage percent ...toFixed used to fix percent 
    // to 1 decimal place 
    const ramPercent=Number(((mem.active/mem.total)*100).toFixed(1));

    const disk=disks[0];
    const diskPercent=Number(((disk.used/disk.size)*100).toFixed(1));

    return{
        cpuPercent,
        ramPercent,
        diskPercent,
        timestamp:Date.now()
    }
}

module.exports = { getMetrics };