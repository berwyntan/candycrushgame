const BOARDWIDTH = 6;
const BOARDHEIGHT = 6;
const CANDIES = ["candy1", "candy2", "candy3", "candy4"];
const $container = $(".container");


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
            const candy = CANDIES[Math.floor(Math.random() * CANDIES.length)];
            array[j][i] = candy;
        }
    }   
    return array;     
}

const fillRowsThreeAndBelow = array => {
    for (let j = 2; j < BOARDHEIGHT; j++) {
        for (let i = 0; i < BOARDWIDTH; i++) {
            let candyAvailable = CANDIES.map((candy) => candy);
            if (array[j-2][i] === array[j-1][i]) {
                candyAvailable = candyAvailable.filter((candy) => candy !== array[j-2][i]);
                // console.log(candyAvailable);
            }
            if (i >= 2) {
                if (array[j][i-2] === array[j][i-1]) {
                    candyAvailable = candyAvailable.filter((candy) => candy !== array[j][i-2]);
                    // console.log(candyAvailable);
                }
            }
            const candy = candyAvailable[Math.floor(Math.random() * candyAvailable.length)];
            array[j][i] = candy;
        }
    }        
}

const getCandyTarget = event => {
    const candyTarget = event.target;
    console.log(candyTarget.className);
    const candyTargetInfoArray = candyTarget.className.split(" ");
    console.log(candyTargetInfoArray);
    highlightCandyTarget(candyTargetInfoArray);
    
}

const highlightCandyTarget = array => {
    const candyClass = `.${array[0]}`;
    const rowClass = `.${array[1]}`;
    const colClass = `.${array[2]}`;
    $(`${candyClass}${rowClass}${colClass}`).addClass("target");    
}

const render = array => {
    $container.html = "";
    const $gameBoard = $("<div>").addClass("game-board");
    for (let j = 0; j < array.length; j++) {
        const $row = $("<div>").addClass("row");
        for (let i=0; i < array[j].length; i++) {
            const $candyImg = $("<div>").addClass(`${array[j][i]}`);
            $candyImg.addClass(`row${j}`);
            $candyImg.addClass(`col${i}`);
            $candyImg.click(getCandyTarget);
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
    // create a score checker to remove scoring items

    
    
   }


$(main);