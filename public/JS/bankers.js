function bankers(){
    let data = getInputForBankers()
    let allocations = data[0]
    let need = data[1]
    let available = data[2]

    let textRes = "<p>Safe sequence exists. System is in safe state</p>"
    let diagramRes = ""
    let sequence = []

    while(true){
        let currAvailable = available[available.length-1]
        let foundNextProcess = false
        let breakFlag = false
        
        for (let i = 0; i < need.length; i++) {
            if(need[i]==undefined){
                if(i==need.length-1){
                    breakFlag=true
                    foundNextProcess=true
                }
                continue
            }
            if(checkIfAvailableMeetsNeeds(need[i],currAvailable)){
                foundNextProcess = true
                diagramRes+="<div class='processBox'><span>P"+(i+1)+"</span></div>"
                sequence.push((i+1))

                let nextAvailable = []
                for (let j = 0; j < need[i].length; j++)nextAvailable.push((allocations[i][j]+currAvailable[j]))

                need[i]= undefined
                available.push(nextAvailable)
                break
            }
        }

        if(!foundNextProcess){
            textRes = "<p>Safe sequence does not exist. System is in unsafe state</p>"
            diagramRes = ""
            break
        }
        if(breakFlag)break
    }
    
    $("#scrollableTextOutput").html(textRes)
    $("#scrollableDiagramOutput").html(diagramRes)
}

function checkIfAvailableMeetsNeeds(a1, a2){
    for (let i = 0; i < a1.length; i++) {
        if(a1[i]>a2[i])return false
    }
    return true
}


function getInputForBankers(){
    // let allocations = [
    //     [0,0,1,2],
    //     [1,0,0,0],
    //     [1,3,5,4],
    //     [0,6,3,2],
    //     [0,0,1,4],
    // ]
    // let max = [
    //     [0,0,1,2],
    //     [1,7,5,0],
    //     [2,3,5,6],
    //     [0,6,5,2],
    //     [0,6,5,6],
    // ]
    // let available = [[1,5,2,0]]

    let allocations = [], max = [], available = [], need = []
    let numP = parseInt($("#numProcesses").val())

    available.push($("#av").val().split(" ").map(function(item){return parseInt(item);}))
    for (let i = 1; i <=numP; i++) {
        allocations.push($("#P" + i + "ar").val().split(" ").map(function(item){return parseInt(item);}))
        max.push($("#P" + i + "mr").val().split(" ").map(function(item){return parseInt(item);}))
    }

    for (let i = 0; i < allocations.length; i++) {
        let temp = []
        for (let j = 0; j < allocations[0].length; j++)temp.push(max[i][j] - allocations[i][j])
        need.push(temp)        
    }
    
    return [allocations, need, available]
}