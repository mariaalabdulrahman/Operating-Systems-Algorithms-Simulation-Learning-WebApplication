function processTimesPrioritizedRun(comparisonVariable, prioritizeRunningOverBurstTime){
    let data = getInputForJobs()
    let numberOfProcesses = data.length

    h = new ProcessQueue(comparisonVariable, 0, prioritizeRunningOverBurstTime)
    let finishedProcesses = []

    let t = 0
    let ganttChart = []
    let prevName = ""

    let count = 0
    while(true){
        if(count++==10000)throw "nah fam"
        for (let i = 0; i < h.data.length; i++) {
            h.data[i].increaseTurnaroundTime(1)
        }
        if(h.data.length !=0 && t!=0)h.data[0].decreaseRootBurst(1)

        for (let i = 0; i < data.length; i++) {
            if(data[i]==undefined)continue
            if(data[i][0]==t){
                var p = new Process(data[i][0], data[i][1], "P"+(data.indexOf(data[i])+1))
                h.insert(p)
                data[data.indexOf(data[i])] = undefined
                numberOfProcesses--;
            }
        }
        h.setResponseTime(t)

        if(h.data.length != 0 && h.data[0].burstTime == 0){
            finishedProcesses.push(h.data[0])
            h.pop()
            h.setResponseTime(t)
        }

        for (let i = 1; i < h.data.length; i++) {
            if(t!=0 || h.data[i].arrivalTime==0)
                h.data[i].increaseWaitingTime(1)
        }

        if(h.data.length!=0 && prevName!=h.data[0].name){
            prevName = h.data[0].name
            ganttChart.push(t, h.data[0].name)
        }
        else if(h.data.len==0 && numberOfProcesses!=0 && prevName!="P-"){
            prevName="P-"
            ganttChart.push(t,prevName)
        }

        t+=1
        if(h.data.length == 0 && numberOfProcesses==0) break
    }

    finishedProcesses.sort(function(a, b){
        if(a.name < b.name)return -1;
        if(a.name > b.name)return 1; 
        return 0;
    })
    ganttChart.push(t-1)
    
    printTextData(finishedProcesses)
    printGanttChart(ganttChart)
}

function cpuTimesPrioritizedRun(q){
    let data = getInputForJobs()
    let numberOfProcesses = data.length

    h = new ProcessQueue(-1, 1, false)
    let finishedProcesses = []

    let t = 0
    let ganttChart = []
    let prevName = ""

    while(true){
        for (let i = 0; i < h.data.length; i++) {
            h.data[i].increaseTurnaroundTime(1)
        }
        if(h.data.length !=0 && t!=0){
            h.data[0].decreaseRootBurst(1)
            h.data[0].increaseTimeOnCpu(1)
        }

        for (let i = 0; i < data.length; i++) {
            if(data[i]==undefined)continue
            if(data[i][0]==t){
                var p = new Process(data[i][0], data[i][1], "P"+(data.indexOf(data[i])+1))
                h.insert(p)
                data[data.indexOf(data[i])] = undefined
                numberOfProcesses--;
            }
        }
        h.setResponseTime(t)

        if(h.data.length != 0 && h.data[0].timeOnCpu != 0 && h.data[0].timeOnCpu%q == 0){
            h.data.push(h.data[0])
            h.data.shift()
            if(h.data[h.data.length-1].burstTime==0){
                finishedProcesses.push(h.data[h.data.length-1])
                h.removeLeaf()
            }
        }

        if(h.data.length != 0 && h.data[0].burstTime == 0){
            console.log(1)
            finishedProcesses.push(h.data[0])
            h.pop()
            h.setResponseTime(t)
        }

        for (let i = 1; i < h.data.length; i++) {
            if(t!=0 || h.data[i].arrivalTime==0)
                h.data[i].increaseWaitingTime(1)
        }

        if(h.data.length!=0 && h.data[0].timeOnCpu%q == 0){
            prevName = h.data[0].name
            ganttChart.push(t, h.data[0].name)
        }
        else if(h.data.len==0 && numberOfProcesses!=0 && prevName!="P-"){
            prevName="P-"
            ganttChart.push(t,prevName)
        }

        t+=1
        if(h.data.length == 0 && numberOfProcesses==0) break
    }

    finishedProcesses.sort(function(a, b){
        if(a.name < b.name)return -1;
        if(a.name > b.name)return 1; 
        return 0;
    })
    ganttChart.push(t-1)
    
    printTextData(finishedProcesses)
    printGanttChart(ganttChart)
}

function printTextData(data){
    let res=""

    for (let i = 0; i < data.length; i++) {
        res+="<h3>" + data[i].name + "</h3>"
        res+="<p>Waiting Time: " + data[i].waitingTime + "</p>"
        res+="<p>Response Time: " + data[i].responseTime + "</p>"
        res+="<p>Turnaround Time: " + data[i].turnaroundTime + "</p>"
        res+="<br>"
    }
    $("#scrollableTextOutput").html(res)
}
function printGanttChart(ganttChart){
    let res=""
    for (let i = 0; i < ganttChart.length; i++) {
        if(i%2==0)res+='<div class="gantTimeBox">'
        else res+='<div class="gantProcessBox">'

        res+='<span>'+ganttChart[i]+"</span>"
        res+='</div>'
    }

    $("#scrollableDiagramOutput").html(res)
}
function getInputForJobs(){
    let res = []
    let aTimes = $("#at").val().split(" ")
    let bTimes = $("#bt").val().split(" ")

    //test for everything except round robin
    // let aTimes = ["10","0","3","5","12"]
    // let bTimes = ["10","12","8","4","6"]

    //test for round robin
    // let aTimes = ["0","0","0","0","0"]
    // let bTimes = ["12","8","4","10","5"]
    
    for (let i = 0; i < aTimes.length; i++) res.push([parseInt(aTimes[i]), parseInt(bTimes[i])])
    return res
}