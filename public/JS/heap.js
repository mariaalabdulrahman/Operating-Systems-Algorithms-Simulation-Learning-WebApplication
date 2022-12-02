class ProcessQueue{
    //comparison variable
    // 0 burst time
    // 1 arrival time

    //priority protocol
    //0 based on process specific times (burst or arrival time)
    //1 time process has spent on cpu
    constructor(comparisonVariable, priorityProtocol, prioritizeRunningOverBurstTime){
        this.data=[]
        this.comparisonVariable = comparisonVariable;
        this.priorityProtocol = priorityProtocol;
        this.prioritizeRunningOverBurstTime = prioritizeRunningOverBurstTime;
    }

    insert(node){
        this.data.push(node)
        if(this.priorityProtocol==0){
            let currIndex = this.data.length - 1

            while(true){
                let parentIndex = Math.floor((currIndex-1)/2)
                let oldComparisonVariable = this.comparisonVariable
                if(this.prioritizeRunningOverBurstTime && (currIndex==1||currIndex==2)){
                    try{
                        if(this.compare(this.data[currIndex],this.data[parentIndex],false)!=0){
                            this.comparisonVariable=1
                            if(this.compare(this.data[currIndex],this.data[parentIndex],false)!=0)break
                        }
                    }
                    catch(e){this.comparisonVariable = oldComparisonVariable}
                    finally{this.comparisonVariable = oldComparisonVariable}
                }
                if(currIndex==0)break
                if(this.compare(this.data[currIndex], this.data[parentIndex], true) == 1){
                    let t = this.data[currIndex]
                    this.data[currIndex] = this.data[parentIndex]
                    this.data[parentIndex] = t

                    currIndex = parentIndex
                }
                else break
            }
        }
    }

    pop(){
        if(this.priorityProtocol==0){
            this.data[0] = this.data[this.data.length-1]
            this.data.pop()
            let currIndex = 0

            while(true){
                let childIndex1 = (currIndex*2)+1
                let childIndex2 = (currIndex*2)+2

                if(this.data.length==currIndex) break
                if (this.data.length>childIndex1 && this.data.length>childIndex2){
                    if(this.compare(this.data[childIndex1], this.data[childIndex2], true) == 1){
                        let t = this.data[currIndex]
                        this.data[currIndex] = this.data[childIndex1]
                        this.data[childIndex1] = t
                        currIndex = childIndex1
                    }
                    else{
                        let t = this.data[currIndex]
                        this.data[currIndex] = this.data[childIndex2]
                        this.data[childIndex2] = t
                        currIndex = childIndex2
                    }
                }
                else if(this.data.length>childIndex1 && this.compare(this.data[currIndex], this.data[childIndex1], true) == -1){
                    let t = this.data[currIndex]
                    this.data[currIndex] = this.data[childIndex1]
                    this.data[childIndex1] = t
                    currIndex = childIndex1
                }
                else if(this.data.length>childIndex2 && this.compare(this.data[currIndex], this.data[childIndex2], true) == -1){
                    let t = this.data[currIndex]
                    this.data[currIndex] = this.data[childIndex2]
                    this.data[childIndex2] = t
                    currIndex = childIndex2
                }
                else break
            }
        }
        if(this.priorityProtocol==1) this.data.shift()
    }

    removeLeaf(){this.data.pop()}

    compare(node1,node2,compareNames){
        if(this.comparisonVariable==0){
            if(node1.burstTime<node2.burstTime)return 1
            if(node1.burstTime==node2.burstTime){
                if(compareNames){
                    if(parseInt(node1.name.substring(1)) < parseInt(node2.name.substring(1)))return 1
                    if(parseInt(node1.name.substring(1)) > parseInt(node2.name.substring(1)))return -1
                    return 0
                }
            }
            if(node1.burstTime>node2.burstTime)return -1
        }
        if(this.comparisonVariable==1){
            if(node1.arrivalTime<node2.arrivalTime)return 1
            if(node1.arrivalTime==node2.arrivalTime){
                if(compareNames){
                    if(parseInt(node1.name.substring(1)) < parseInt(node2.name.substring(1)))return 1
                    if(parseInt(node1.name.substring(1)) > parseInt(node2.name.substring(1)))return -1
                    return 0
                }
            }
            if(node1.arrivalTime>node2.arrivalTime)return -1
        }
    }

    setResponseTime(t){
        if(this.data.length==0)return
        this.data[0].runningCounter++;
        if(this.data[0].runningCounter==1)this.data[0].responseTime = t = this.data[0].arrivalTime
    }
}

class Process{
    constructor(arrivalTime, burstTime, name){
        this.arrivalTime = arrivalTime
        this.burstTime = burstTime
        this.name = name
        this.timeOnCpu = 0
        this.waitingTime = 0
        this.responseTime = 0
        this.turnaroundTime = 0
        this.runningCounter = 0
    }
    decreaseRootBurst(amt){this.burstTime-=amt}
    increaseTimeOnCpu(amt){this.timeOnCpu+=amt}
    increaseWaitingTime(amt){this.waitingTime+=amt}
    increaseTurnaroundTime(amt){this.turnaroundTime+=amt}
}