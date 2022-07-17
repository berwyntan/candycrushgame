const BOARDWIDTH = 6;
const BOARDHEIGHT = 6;
const CANDIES = ["candy1", "candy2", "candy3", "candy4"];
const $container = $(".container");

// create a totally random array
// run through first 2 rows to remove 3 in a row
// run thru subsequent rows to remove 3 in a row and 3 in a col
// run thru the 12 patterns to check available moves
// try out the draggable and droppable jquery
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
            // let candyAvailable = CANDIES.map((candy) => candy);
            // if (i>=2) {
            //     if (array[j][i-2].name === array[j][i-1].name) {
            //         candyAvailable = candyAvailable.filter((candy) => candy.name !== array[j][i-2].name);
            //         // console.log(candyAvailable);
            //     }
            // }
            // const candyRandom = candyAvailable[Math.floor(Math.random() * candyAvailable.length)];
            // array[j][i] = new Candy(candyRandom, j, i);
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
    return array;      
}

const getCandyTarget = event => {
    const candyTarget = event.target;
    console.log(candyTarget.className);
    const candyTargetInfoArray = candyTarget.className.split(" ");
    console.log(candyTargetInfoArray);
    const candyClass = `${candyTargetInfoArray[0]}`;
    const rowClass = `${candyTargetInfoArray[1]}`;
    const colClass = `${candyTargetInfoArray[2]}`;
    newGameArray.forEach(array => {
        array.forEach(candy => {
            if (candy.name === candyClass && candy.row === rowClass && candy.col === colClass) {
                console.log("target found"+ candy.row + candy.col)
                candy.target = true;
            }
        })
    })
    
}

const highlightCandyTarget = array => {
    const candyClass = `.${array[0]}`;
    const rowClass = `.${array[1]}`;
    const colClass = `.${array[2]}`;
    $(`${candyClass}${rowClass}${colClass}`).addClass("target");    
}



const render = array => {
    $container.empty();
    const $gameBoard = $("<div>").addClass("game-board");
    for (let j = 0; j < array.length; j++) {
        const $row = $("<div>").addClass("row");
        for (let i=0; i < array[j].length; i++) {
            const $candyImg = $("<div>").addClass(`${array[j][i].name}`);
            $candyImg.addClass(`${array[j][i].row}`);
            $candyImg.addClass(`${array[j][i].col}`);
            $candyImg.click(getCandyTarget);//use on click and run a function
            $row.append($candyImg);
        }
        $gameBoard.append($row);
    }
    return $gameBoard;
}

const main = () => {    

    let newGameArray = createEmptyArray();
    

    fillRowsTopTwo(newGameArray);
    fillRowsThreeAndBelow(newGameArray);
    console.log(newGameArray);
    $container.append(render(newGameArray));
    
    
    


    
    
   }


$(main);