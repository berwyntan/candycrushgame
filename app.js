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
    constructor(name, row, col, target=false, clickable=false, remove=false) {
        this.name = name;
        this.row = `row${row}`;
        this.col = `col${col}`;
        this.target = target;
        this.clickable = clickable;
        this.remove = remove;
    }
}
// make a non empty totally random array
const createRandomArray = () => {
    let itemMap = [];
    for (let j = 0; j < BOARDHEIGHT; j++) {
        let itemRow = [];
        for (let i = 0; i < BOARDWIDTH; i++) {
            // itemRow.push("empty");
            const candyRandom = CANDIES[Math.floor(Math.random() * CANDIES.length)];
            itemRow[i] = new Candy(candyRandom, j, i);
            
        }
        itemMap.push(itemRow);
    }
    return itemMap;        
}
// filter the candies -- not working----------------
const filterRows = array => {
    for (let j = 0; j < BOARDHEIGHT; j++) {
        for (let i = 2; i < BOARDWIDTH; i++) {
            if (array[j][i-2] === array[j][i-1]) {
                
                console.log("3 in a row " + "row " + j + " col " + i)
                
                // candyAvailable = candyAvailable.filter(candy => candy !== array[j][i-2]);
                // console.log(candyAvailable);
                
                let candyRandom = candyAvailable[Math.floor(Math.random() * candyAvailable.length)];
                while (candyRandom === array[j][i-1]) {
                    candyRandom = candyAvailable[Math.floor(Math.random() * candyAvailable.length)];
                }
                console.log(candyRandom)
                array[j][i] = candyRandom;
                    
            //         for (const candy of CANDIES) {
            //             if (candy !== candyToRemove.name) {
            //                 candyAvailable.push(candy);
            //             }
            //         }
            //         console.log(candyAvailable);
            //         const candyRandom = candyAvailable[Math.floor(Math.random() * candyAvailable.length)];
            //         console.log(candyRandom)
            //         array[j][i] = new Candy(candyRandom, j, i);
            //     }
            // }                
        }
    }   
    return array;     
}}

const filterColumns = array => {
    for (let j = 2; j < BOARDHEIGHT; j++) {
        for (let i = 0; i < BOARDWIDTH; i++) {
            let candyAvailable = CANDIES;
            if (array[j-2][i].name === array[j-1][i].name) {
                for (let k=0; k<candyAvailable.length; k++) {
                    if (candyAvailable[k] === array[j-2][i].name) {
                        candyAvailable.splice(k, 1);
                    }
                }
                console.log(candyAvailable)
                // if (i >= 2) {
                //     if (array[j][i-2].name === array[j][i-1].name) {
                //         if (array[j][i-2].name !== candyToRemove1) {
                //             candyToRemove2 = array[j][i-2];
                //         }
                //         for (const candy of CANDIES) {
                //             if (candy !== candyToRemove1.name) {
                //                 if (candy !== candyToRemove2.name) {
                //                     candyAvailable.push(candy);
                //                 }}}}}
                // for (const candy of CANDIES) {
                //     if (candy !== candyToRemove1.name) {
                //         candyAvailable.push(candy);
                //         } }
                const candyRandom = candyAvailable[Math.floor(Math.random() * candyAvailable.length)];
                array[j][i] = new Candy(candyRandom, j, i);

            //     if (i >= 2) {
            //         if (array[j][i-2].name === array[j][i-1].name) {
            //             const candyToRemove2 = array[j][i-2];
            //             console.log(candyToRemove2);
            //             for (const candy of CANDIES) {
            //                 if (candy !== candyToRemove1.name) {
            //                     if (candy !== candyToRemove2.name) {
            //                         candyAvailable.push(candy);
            //                     }
            //                 }
            //             } }
            //         else {
            //             for (const candy of CANDIES) {
            //                 if (candy !== candyToRemove1.name) {
            //                     candyAvailable.push(candy);
            //                     }                   
            //                 }}}
            // console.log(candyAvailable)
            // const candyRandom = candyAvailable[Math.floor(Math.random() * candyAvailable.length)];
            // array[j][i] = new Candy(candyRandom, j, i);
            
        }
    } 
    return array;      
}}
// --------------------------------------------------
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

const fillInCandies = array => {
    array.forEach(rowArray => {
        rowArray.forEach(candy => {
            $(`.${candy.row}.${candy.col}`).addClass(`${candy.name}`);
        })
    })
}

const checkCandiesInARow = array => {
    let sum = 0;
    for (let j=BOARDHEIGHT-1; j>=0; j--) {
        for (let i=2; i<BOARDWIDTH; i++) {
            if (sum < 1) {
                if (array[j][i-2].name === array[j][i-1].name && array[j][i-1].name === array[j][i].name) {
                    array[j][i-2].remove = true;
                    array[j][i-1].remove = true;
                    array[j][i].remove = true;
                    sum += 1;
                    }      
                }                 
            }
        }
    return array;
}

const markCandiesToRemove = array => {
    array.forEach(rowArray => {
        rowArray.forEach(candy => {
            if (candy.remove === true) {
                $(`.${candy.row}.${candy.col}`).addClass("scored");
            }            
        })
    })
}

const removeCandiesFromArray = array => {
    for (let j=0; j<BOARDHEIGHT; j++) {
        for (let i=0; i<BOARDWIDTH; i++) {
            if (array[j][i].remove === true) {
                array[j][i]
            }
        }
    }
    return array;
}

const render = () => {
    $container.empty();
    const $gameBoard = $("<div>").addClass("game-board");
    // candyTargetArray = checkTargets(newGameArray);
    for (let j = 0; j < BOARDHEIGHT; j++) {
        const $row = $("<div>").addClass(`row`);
        for (let i=0; i < BOARDWIDTH; i++) {
            const $candyImg = $("<div>").addClass(`row${j}`);
            $candyImg.addClass(`col${i}`);
            // $candyImg.addClass(`${array[j][i].row}`);
            // $candyImg.addClass(`${array[j][i].col}`);
            // $candyImg.click(getCandyTarget);//use on click and run a function
            // $candyImg.draggable();
            $row.append($candyImg);
        }
        $gameBoard.append($row);
    }
    // console.log("hihi");
    $container.append($gameBoard);
}

const main = () => {    

    let newGameArray = createRandomArray();
    

    filterRows(newGameArray);
    // filterColumns(newGameArray);
    console.log(newGameArray);
    render();
    fillInCandies(newGameArray);
    checkCandiesInARow(newGameArray);
    markCandiesToRemove(newGameArray);
    console.log(newGameArray);
    removeCandiesFromArray(newGameArray);
    console.log(newGameArray);
    
    
    
    
    


    
    
   }

// let newGameArray = [];
// let candyTargetArray = [];
$(main);