const BOARDWIDTH = 6;
const BOARDHEIGHT = 6;
const CANDIES = ["candy1", "candy2", "candy3", "candy4"];
const $container = $(".container");

// candy class
class Candy {
    constructor(name, row, col, target=false, clickable=false, scorableHorz=false, scorableVert=false) {
        this.name = name;
        this.row = `row${row}`;
        this.col = `col${col}`;
        this.target = target;
        this.clickable = clickable;
        this.scorableHorz = scorableHorz;
        this.scorableVert = scorableVert;
    }
}

const createEmptyArray = () => {
    let itemMap = [];
    for (let j = 0; j < BOARDHEIGHT; j++) {
        let itemRow = [];
        for (let i = 0; i < BOARDWIDTH; i++) {
            itemRow.push("empty");
        }
        itemMap.push(itemRow);
    }
    return itemMap;        
}

const fillRowsTopTwo = array => {
    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < BOARDWIDTH; i++) {
            const candyRandom = CANDIES[Math.floor(Math.random() * CANDIES.length)];
            array[j][i] = new Candy(candyRandom, j, i);
        }
    }   
    return array;     
}

const fillRowsThreeAndBelow = array => {
    for (let j = 2; j < BOARDHEIGHT; j++) {
        for (let i = 0; i < BOARDWIDTH; i++) {
            let candyAvailable = CANDIES.map((candy) => candy);
            if (array[j-2][i].name === array[j-1][i].name) {
                candyAvailable = candyAvailable.filter((candy) => candy.name !== array[j-2][i].name);
                // console.log(candyAvailable);
            }
            if (i >= 2) {
                if (array[j][i-2].name === array[j][i-1].name) {
                    candyAvailable = candyAvailable.filter((candy) => candy.name !== array[j][i-2].name);
                    // console.log(candyAvailable);
                }
            }
            const candyRandom = candyAvailable[Math.floor(Math.random() * candyAvailable.length)];
            array[j][i] = new Candy(candyRandom, j, i);
        }
    }        
}

const paintTarget = event => {
    const candyTarget = event.target;
    // console.log(candyTarget.className);
    const candyTargetInfoArray = candyTarget.className.split(" ");
    // console.log(candyTargetInfoArray);
    const candyClass = `${candyTargetInfoArray[0]}`;
    const rowClass = `${candyTargetInfoArray[1]}`;
    const colClass = `${candyTargetInfoArray[2]}`;
    newGameArray.forEach(array => {
        array.forEach(candy => {
            if (candy.name === candyClass && candy.row === rowClass && candy.col === colClass) {
                // console.log("target found"+ candy.row + candy.col)
                candy.target = true;
            }
        })
    })
    $(`.${candyClass}.${rowClass}.${colClass}`).addClass("target");
    render();
}

const checkTargets = array => {
    let candyTargetArray = [];
    array.forEach(array => {
        array.forEach(candy => {
            if (candy.target === true) {
                candyTargetArray.push(candy);
            }
        })
    })
    console.log(candyTargetArray)
    return candyTargetArray;
}

const render = () => {
    $container.empty();
    const $gameBoard = $("<div>").addClass("game-board");
    candyTargetArray = checkTargets(newGameArray);
    for (let j = 0; j < newGameArray.length; j++) {
        const $row = $("<div>").addClass("row");
        for (let i=0; i < newGameArray[j].length; i++) {
            const $candyImg = $("<div>").addClass(`${newGameArray[j][i].name}`);
            $candyImg.addClass(`${newGameArray[j][i].row}`);
            $candyImg.addClass(`${newGameArray[j][i].col}`);
            if (newGameArray[j][i].target === true) {
                $candyImg.addClass("target")
            }
            if (candyTargetArray.length <=1) {
                $candyImg.click(paintTarget);
            }
            
            $row.append($candyImg);
        }
        $gameBoard.append($row);
    }
    // console.log("hihi");
    $container.append($gameBoard);
}

const main = () => {    

    newGameArray = createEmptyArray();
    fillRowsTopTwo(newGameArray);
    fillRowsThreeAndBelow(newGameArray);
    // console.log(newGameArray);
    render();
    
    
    
   }

let newGameArray = [];
let candyTargetArray = [];
$(main);