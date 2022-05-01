let cellsArray = [];
let dificulty = 1;
let minesNumber = [8,16,32,64,128];
let canvasSize = [30,20];
let zoneRange = 5;
let gameStatus = 0; // 0 ongoing, 1 win, -1 loose
let minesLocation = [];
let canvasId = "Canvas";
createCellsArray(canvasSize[0],canvasSize[1]);
/**
 * 
 * @param {Int} rows 
 * @param {Int} columns 
 */
function createCellsArray(rows,columns) {
    
    for (let i = 0; i < rows; i++) {
        let tempArray = [];
        for (let j = 0; j < columns; j++) {
            tempArray[j] = 0;
        }
        cellsArray[i] = tempArray;
    }

    
    console.log("dificulty: "+dificulty);
    console.log(minesNumber[dificulty]);
    flushMines(minesNumber[dificulty]).then(
        function(value) { 
            drawCells(cellsArray,canvasId);
            addEvents(".cell");
         },
    );
    // console.log(cellsArray);

}


/**
 * 
 * @param {Int} minesCount (even positive numbers only)
 */
 async function flushMines(minesCount) {
    let zones = minesCount/4;

    
    for (let i = 0; i < zones; i++) {
        const zone = i;
        let mainPoint = getPoint(0,canvasSize[0],0,canvasSize[1]);
        for (let j = 0; j < 4; j++) {
            let checkDoublicate = true;
            let point = [];
            while(checkDoublicate) {
                point = getPoint(mainPoint[0]-zoneRange,mainPoint[0]+zoneRange,mainPoint[1]-zoneRange,mainPoint[1]+zoneRange);
                if(cellsArray[point[0]][point[1]] != "F") {
                    checkDoublicate = false;
                }
            }
            drawTheMine(point);
            minesLocation.push(point);
        }
    }
    console.log(minesLocation);
}

/**
 * 
 * @param {Int[x,y]} point 
 */
function drawTheMine(point) {
    cellsArray[point[0]][point[1]] = "F";
    let minRaw = (parseInt(point[0])-1);
    let maxRaw = (parseInt(point[0])+1);
    let minCol = (parseInt(point[1])-1);
    let maxCol = (parseInt(point[1])+1);


    for (let i = minRaw; i <= maxRaw; i++) {
        let txt = "";
        for (let j = minCol; j <= maxCol; j++) {
            txt += j + ", ";
            if(j >= 0 && i >= 0 && i < canvasSize[0] && j < canvasSize[1]) {
                if(cellsArray[i][j] != "F") {
                    cellsArray[i][j] += 1;
                }
            }
        }
    }
}



/**
 * 
 * @param {Array[][]} cellsArray 
 * @param {HolderID} Holder
 */
function drawCells(cellsArray,HolderID) {
    let txt = ""; 
    for (let i = 0; i < canvasSize[1]; i++) {
        for (let j = 0; j < canvasSize[0]; j++) {
            const cell = cellsArray[j][i];
            let id = "c-" + j + "-" + i;
            txt += '<div class="cell" id="'+id+'"><b data-type="'+cell+'">';
            if(cell != 0) {
                txt += cell;
            }
            txt +='</b></div>';
        }
    }
    document.getElementById(HolderID).innerHTML = txt;
}







/**
 * 
 * @param {String} cellsClass
 */
function addEvents(cellsClass) {
    let cells = document.querySelectorAll(cellsClass);
    Array.from(cells).forEach(cell => {
        cell.addEventListener('click', function(event) {
            let id = cell.getAttribute('id');
            let temp = id.split("-");
           let point = [temp[1],temp[2]];
           openCell(point,1);
           checkForWin();
        });
    });
}

/**
 * 
 * @param {Int[][]} point 
 * @param {Int} type (1 means the main point that the user clicked, 2 is a secindary point) 
 */
function openCell(point,type) {
    let id = "c-"+point[0]+"-"+point[1];
    let cell = document.getElementById(id);
    // console.log(id);
    if(!cell.classList.contains('visible')) {
        if(type == 1) {
            cell.classList.add('visible');
            if(cellsArray[point[0]][point[1]] == "F") {
                gameOver();
            }
        }
        if(cellsArray[point[0]][point[1]] == 0) {
            if(type != 1) {
                cell.classList.add('visible');
            }

            let minRaw = (parseInt(point[0])-1);
            let maxRaw = (parseInt(point[0])+1);
            let minCol = (parseInt(point[1])-1);
            let maxCol = (parseInt(point[1])+1);
            // console.log(point);
            // console.log("minR: " + minRaw + " - maxR: " + maxRaw);
            // console.log("minC: " + minCol + " - maxC: " + maxCol);

            for (let i = minRaw; i <= maxRaw; i++) {
                let txt = "";
                for (let j = minCol; j <= maxCol; j++) {
                    txt += j + ", ";
                    if(j >= 0 && i >= 0 && i < canvasSize[0] && j < canvasSize[1]) {
                        // if(cellsArray[i][j] == 0) {
                            openCell([i,j],2);
                            // cellsArray[i][j] 
                        // }
                    }
                }
            }

        }
    }
}

/**
 * 
 * @param {Int} min 
 * @param {Int} max 
 * @param {Int} type (0 means a row, 1 means a column) 
 * @returns 
 */
function randomInteger(min, max, type) {
    if(min < 0) {
        min = 0;
    }
    if (max >=canvasSize[type]) {
        max = canvasSize[type] -1;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 
 * @param {Int} rowMin 
 * @param {Int} rowMax 
 * @param {Int} colMin 
 * @param {Int} colMax 
 * @returns {Int[x,y]} point
 */
function getPoint(rowMin,rowMax,colMin,colMax) {
    let point = [
        randomInteger(rowMin, rowMax, 0),
        randomInteger(colMin, colMax, 1),
    ];

    return point;
}

function gameOver() {
    gameStatus = -1;
    console.log("Game Over");
    document.getElementById(canvasId).innerHTML += '<div class="Menu"><h1>Game Over</h1></div>';
}

function Win() {
    gameStatus = 1;
    console.log("WIN");
    document.getElementById(canvasId).innerHTML += '<div class="Menu"><h1>You Win</h1></div>';
}

function checkForWin() {
    if (gameStatus == 0) {
        let cellsOpen = document.querySelectorAll(".visible");
        let cellsOpenCount = cellsOpen.length;
        let minesCount = minesLocation.length;
        console.log(cellsOpenCount);
        if(cellsOpenCount + minesCount == (canvasSize[0]*canvasSize[1])) {
            Win();
        }

    }
}

function ChangeDiffeculty(dif) {
    dificulty = parseInt(dif);
    console.log(dificulty);
    document.getElementById(canvasId).innerHTML = "";
    createCellsArray(canvasSize[0],canvasSize[1]);
}


