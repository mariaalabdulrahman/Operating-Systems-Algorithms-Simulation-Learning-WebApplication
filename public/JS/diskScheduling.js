let ySupplement = 40
let unitDistance = 10
let staryYForPoints = 80

function diskScheduling(){
    let data = getInputForDS()
    let algo = data[0]
    let qLimit = data[1]
    let q = data[2]
    let headPointer = data[3]

    if(algo == "fcfs")fcfs(qLimit, headPointer, q)
    if(algo == "sstf")sstf(qLimit, headPointer, q)
    if(algo == "scan")scan(qLimit, headPointer, q)
    if(algo == "cscan")cscan(qLimit, headPointer, q)
    if(algo == "clook")clook(qLimit, headPointer, q)
}

function fcfs(qLimit, headPointer, q){
    let pointPairs = []

    let prevSpot = headPointer
    let sumCylinders = 0
    for (let i = 0; i < q.length; i++) {
        pointPairs.push({"p1":prevSpot, "p2":q[i]})
        sumCylinders += Math.abs(prevSpot-q[i])
        prevSpot=q[i]
    }
    
    $("#scrollableTextOutput").html("Head movement: "+ sumCylinders)
    doCanvas(qLimit,pointPairs)
}
function sstf(qLimit, headPointer, q){
    let pointPairs = []

    let prevSpot = headPointer
    let sumCylinders = 0
    while(true){
        let definedFound = false
        let minIndex = 0
        let tempDiff = Number.MAX_SAFE_INTEGER
        for (let i = 0; i < q.length; i++) {
            if(q[i]==undefined)continue
            definedFound = true
            if(Math.abs(prevSpot-q[i])<tempDiff){
                tempDiff = Math.abs(prevSpot-q[i])
                minIndex = i
            }
        }    
        pointPairs.push({"p1":prevSpot, "p2":q[minIndex]})
        if(q[minIndex]!=undefined)sumCylinders += Math.abs(prevSpot-q[minIndex])
        prevSpot = q[minIndex]
        q[minIndex] = undefined
        if(!definedFound)break
    }

    $("#scrollableTextOutput").html("Head movement: "+ sumCylinders)
    doCanvas(qLimit,pointPairs)
}
function scan(qLimit, headPointer, q){
    let pointPairs = []

    let prevSpot = headPointer
    let zeroReached = false
    let sumCylinders = 0
    while(true){
        let definedFound = false
        let nextIndex = 0
        let temp = zeroReached?Number.MAX_SAFE_INTEGER:Number.MIN_SAFE_INTEGER
        for (let i = 0; i < q.length; i++) {
            if(q[i]==undefined)continue
            if(!zeroReached){
                if(q[i]<=prevSpot && temp<q[i]){
                    definedFound = true
                    temp = q[i]
                    nextIndex = i
                }
            }
            else{
                if(q[i]>prevSpot && temp>q[i]){
                    definedFound = true
                    temp = q[i]
                    nextIndex = i
                }
            }
        }
        if(!definedFound&&zeroReached)break
        else if(!definedFound) zeroReached = true

        if(zeroReached&&!definedFound){
            pointPairs.push({"p1":prevSpot, "p2":0})
            sumCylinders += Math.abs(prevSpot)
        }
        else{
            pointPairs.push({"p1":prevSpot, "p2":q[nextIndex]})
            sumCylinders += Math.abs(prevSpot-q[nextIndex])
            q[nextIndex] = undefined
        }
        prevSpot = pointPairs[pointPairs.length-1]["p2"]
    }

    $("#scrollableTextOutput").html("Head movement: "+ sumCylinders)
    doCanvas(qLimit,pointPairs)
}
function cscan(qLimit, headPointer, q){
    let pointPairs = []

    let prevSpot = headPointer
    let endReached = false
    let sumCylinders = 0
    while(true){
        let definedFound = false
        let nextIndex = 0
        let temp = Number.MAX_SAFE_INTEGER
        for (let i = 0; i < q.length; i++) {
            if(q[i]==undefined)continue
            if(q[i]>prevSpot && temp>q[i]){
                definedFound = true
                temp = q[i]
                nextIndex = i
            }
        }
        if(!definedFound&&endReached)break
        else if(!definedFound) endReached = true

        if(endReached&&!definedFound){
            pointPairs.push({"p1":prevSpot, "p2":qLimit})
            pointPairs.push({"p1":qLimit, "p2":0})
            sumCylinders += Math.abs(prevSpot-qLimit)
            sumCylinders += Math.abs(qLimit)
        }
        else{
            pointPairs.push({"p1":prevSpot, "p2":q[nextIndex]})
            sumCylinders += Math.abs(prevSpot-q[nextIndex])
            q[nextIndex] = undefined
        }
        prevSpot = pointPairs[pointPairs.length-1]["p2"]
    }
    
    $("#scrollableTextOutput").html("Head movement: "+ sumCylinders)
    doCanvas(qLimit,pointPairs)
}
function clook(qLimit, headPointer, q){
    let pointPairs = []

    let prevSpot = headPointer
    let endReached = false
    let sumCylinders = 0
    while(true){
        let definedFound = false
        let nextIndex = 0
        let temp = Number.MAX_SAFE_INTEGER
        for (let i = 0; i < q.length; i++) {
            if(q[i]==undefined)continue
        
            if(q[i]>prevSpot && temp>q[i]){
                definedFound = true
                temp = q[i]
                nextIndex = i
            }
        }
        if(!definedFound&&endReached)break
        else if(!definedFound) endReached = true

        if(endReached&&!definedFound){
            let min = Number.MAX_SAFE_INTEGER
            for (let i = 0; i < q.length; i++) {
                if(q[i]==undefined)continue
                if(min>q[i])min = q[i]
            }
            pointPairs.push({"p1":prevSpot, "p2":min})
            sumCylinders += Math.abs(prevSpot-min)
            q[q.indexOf(min)] = undefined
        }
        else{
            pointPairs.push({"p1":prevSpot, "p2":q[nextIndex]})
            sumCylinders += Math.abs(prevSpot-q[nextIndex])
            q[nextIndex] = undefined
        }
        prevSpot = pointPairs[pointPairs.length-1]["p2"]
    }
    
    $("#scrollableTextOutput").html("Head movement: "+ sumCylinders)
    doCanvas(qLimit,pointPairs)
}

function doCanvas(qLimit, pointPairs){
    document.getElementById("canvas").scrollTo(0, 0);

    canvas= document.getElementById("cvs");
    context= canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath()
    context.strokeStyle = context.fillStyle = "black";
    context.font = "10px Georgia";
    for (let i = 0; i <=qLimit; i++) {
        let yEnd = i==qLimit?canvas.height:40

        context.beginPath()
        context.moveTo(i*unitDistance, 0)
        context.lineTo(i*unitDistance, yEnd)
        context.stroke()
        
        if(i%10==0)context.fillText(i, i*10, 60);
    }
    
    context.strokeStyle = context.fillStyle = "red";
    let currY = staryYForPoints
    for (let i = 0; i < pointPairs.length; i++) {
        context.beginPath()
        context.arc(pointPairs[i]["p1"]*unitDistance, currY, 5, 0, 2 * Math.PI);
        context.arc(pointPairs[i]["p2"]*unitDistance, currY+ySupplement, 5, 0, 2 * Math.PI);
        context.fill()
        context.beginPath()
        context.moveTo(pointPairs[i]["p1"]*unitDistance, currY)
        context.lineTo(pointPairs[i]["p2"]*unitDistance, currY+ySupplement)
        context.stroke()

        currY+=ySupplement
    }
}

function getInputForDS(){
    let algo = $("#dss").val()
    let qLimit =  parseInt($("#dsn").val())
    let q = $("#dsq").val().split(" ").map(function(item){return parseInt(item);})
    // let q = "98 183 37 122 14 124 65 67".split(" ").map(function(item){return parseInt(item);})
    let headPointer = parseInt($("#dsh").val())

    return [algo, qLimit, q, headPointer]
}