
function optimal(){
    let data = getInputForPR()
    let numFrames = parseInt(data[0])
    data = data[1]

    let frames = new Array(numFrames)
    let nextIndex = 0;
    let pageFaults = 0

    let res=""
    
    for (let i = 0; i < data.length; i++) {
        let page = data[i];
        let visibility = "style='visibility:hidden'"

        res+= '<div class="frameBox">'
        res+= '<p>' + data[i] + '</p>'

        if(!frames.includes(page)){
            frames[nextIndex] = page
            visibility=""
            pageFaults++
        }
        if(frames.includes(undefined))nextIndex = (nextIndex+1)%numFrames
        if(!frames.includes(undefined) || nextIndex==0) {
            let trackedPages = []
            for (let j = i+1; j < data.length; j++){
                if(!frames.includes(data[j]))continue
                if(!trackedPages.includes(data[j]))trackedPages.push(data[j])
            }
            try{
                for (let j = 0; j < frames.length; j++) {
                    if(!trackedPages.includes(frames[j]))trackedPages.push(frames[j])
                }
                nextIndex = frames.indexOf(trackedPages[trackedPages.length-1])
            }
            catch(e){nextIndex = frames.length-1}
                
        }
        for (let j = 0; j < numFrames; j++) {
            let currPageNum = "-"
            if(frames[j]!=undefined)currPageNum = frames[j]
            res+="<span " + visibility + ">" + currPageNum + "</span>"
        }
        res += "</div>"
    }
    $("#scrollableDiagramOutput").html(res)
    $("#scrollableTextOutput").html("<p>Number of page faults: "+pageFaults+"</p>")
}


function lru(){
    let data = getInputForPR()
    let numFrames = parseInt(data[0])
    data = data[1]

    let frames = new Array(numFrames)
    let nextIndex = 0;
    let pageFaults = 0

    let res=""

    for (let i = 0; i < data.length; i++) {
        let page = data[i];
        let visibility = "style='visibility:hidden'"
        let includes = false

        for (let j = 0; j < frames.length; j++) {
            if(frames[j]==undefined)continue
            if(frames[j].data == page){
                includes=true
                frames[j].dataIndex = i
                break
            }
        }

        res+= '<div class="frameBox">'
        res+= '<p>' + page + '</p>'
        if(!includes){
            frames[nextIndex] = {"data":page, "dataIndex":i}
            visibility=""
            pageFaults++
        }
        if(frames.includes(undefined))nextIndex = (nextIndex+1)%numFrames
        if(!frames.includes(undefined) || nextIndex==0) {
            let minDataIndex = Number.MAX_SAFE_INTEGER
            for (let j = 0; j < frames.length; j++) {
                if(minDataIndex>frames[j].dataIndex)nextIndex = j
                minDataIndex = Math.min(minDataIndex, frames[j].dataIndex)
            }
        }
        for (let j = 0; j < numFrames; j++) {
            let currPageNum = "-"
            if(frames[j]!=undefined)currPageNum = frames[j].data
            res+="<span " + visibility + ">" + currPageNum + "</span>"
        }
        res += "</div>"
    }
    $("#scrollableDiagramOutput").html(res)
    $("#scrollableTextOutput").html("<p>Number of page faults: "+pageFaults+"</p>")
}

function fifo(){
    let data = getInputForPR()
    let numFrames = parseInt(data[0])
    data = data[1]

    let frames = new Array(numFrames)
    let nextIndex = 0;
    let pageFaults = 0

    let res=""
    for (let i = 0; i < data.length; i++) {
        let page = data[i];
        res+= '<div class="frameBox">'
        res+= '<p>' + page + '</p>'

        let visibility = "style='visibility:hidden'"
        if(!frames.includes(page)){
            frames[nextIndex] = page
            nextIndex = (nextIndex+1)%numFrames
            visibility=""
            pageFaults++
        }
        for (let j = 0; j < numFrames; j++) {
            let currPageNum = "-"
            if(frames[j]!=undefined)currPageNum = frames[j]
            res+="<span " + visibility + ">" + currPageNum + "</span>"
        }
        res += "</div>"
    }

    $("#scrollableDiagramOutput").html(res)
    $("#scrollableTextOutput").html("<p>Number of page faults: "+pageFaults+"</p>")
}

function getInputForPR(){
    let rs = $("#rs").val().split(" ")
    let frameNum = $("#numFrames").val()
    
    // let rs = ["7","0","1","2","0","3","0","4","2","3","0","3","2","1","2","0","1","7","0","1"]
    // let frameNum = 4

    return [frameNum, rs]
}