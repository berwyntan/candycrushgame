

// -------------------------------- MODEL -------------------------------------

const COMBORANK = [
    {points: 0, rank: "", text: ""},
    {points: 10, rank: "D", text: "Delicious!"},
    {points: 13, rank: "C", text: "Crazy!"},
    {points: 16, rank: "B", text: "Breathtaking!"},
    {points: 19, rank: "A", text: "Awesome!"},
    {points: 22, rank: "S", text: "Sweet!"},
    {points: 25, rank: "SS", text: "Super!!"},
    {points: 30, rank: "SSS", text: "SSStyle!!!"},
]
const HOWTOPLAY = [
    "Match 3 or more candies in a row or column",
    "Drag a candy to switch its place",
    "Meet the objective before you run out of moves!",
    "Chain candy crushes to unlock SSStyle",
    "SSStyle will remove a random row of candy as long as you keep chaining crushes"
];
const $container = $(".container");

// const winConStage1 = () => {
//     if (score>=50) {
//         console.log("checking win con stage 1")
//         return true;
//     } else return false;
// }

// const winConStage2 = () => {
//     if (stylePoints>=3) {
//         console.log("checking win con stage 2")
//         return true;
//     } else return false;
// }

// const winConStage3 = () => {
//     if (score>=100) {
//         console.log("checking win con stage 3")
//         return true;
//     } else return false;
// }

const stageData = [
    {
        name: "Stage 1",
        text: "Get 50 score",
        description: "Score 50 points before new candies run out your moves!",
        boardheight: 6,
        boardwidth: 6,
        candiesinit: ["candy1", "candy2", "candy3", "candy4"],
        candies: ["candy1", "candy2", "candy3", "candy4", "candy5", "candy6"],
        function: () => {
            if (score>=50) {
                console.log("checking win con stage 1")
                return true;
            } else return false;
        },
        
    },
    {
        name: "Stage 2",        
        text: "Remove all cherries",
        description: "Get rid of the cherries in your candies! Hint: Use SSStyle",
        boardheight: 8,
        boardwidth: 8,
        candiesinit: ["candy1", "candy2", "candy3", "candy4",
                        "candy1", "candy2", "candy3", "candy4",
                            "cherry"],
        candies: ["candy1", "candy2", "candy3", "candy4"],
        function: () => {
            getCherries();
            if (cherries===0) {
                console.log("checking win con stage 2")
                return true;
            } else return false;
        },
    },
    {
        name: "Stage 3",        
        text: "Get score: 99999",
        boardheight: 10,
        boardwidth: 10,
        candiesinit: ["candy1", "candy2", "candy3", "candy4", "candy5", "candy6", "cherry"],
        candies: ["candy1", "candy2", "candy3", "candy4", "candy5", "candy6"],
        function: () => {
            if (score>=99999) {
                console.log("checking win con stage 3")
                return true;
            } else return false;
        },
    },
]

// default stage data
let BOARDWIDTH = 6;
let BOARDHEIGHT = 8;
let CANDIESINIT = ["candy1", "candy2", "candy3", "candy4"];
let CANDIES = ["candy1", "candy2", "candy3", "candy4"];

let itemBoard = [];

let draggedCandyName = "";
let draggedCandyId = "";
let droppableCandiesId = [];
let droppedCandyName = "";
let droppedCandyId = "";

let draggables = [];
let droppables = [];

let candiesToCrush = [];

let comboMeter = 0;
let score = 0;
let moves = 0;
let stylePoints = 0;

let stage = 1;
let cherries = 0;

const createRandomArray = () => {
    let itemBoard = [];
    for (let j = 0; j < BOARDHEIGHT; j++) {
        let itemRow = [];
        for (let i = 0; i < BOARDWIDTH; i++) {
            const candyRandom = CANDIESINIT[Math.floor(Math.random() * CANDIESINIT.length)];
            itemRow[i] = candyRandom;            
        }
        itemBoard.push(itemRow);
    }
    return itemBoard;        
}

const getStageData = () => {
    BOARDWIDTH = stageData[stage-1].boardwidth;
    BOARDHEIGHT = stageData[stage-1].boardheight;
    CANDIESINIT = stageData[stage-1].candiesinit;
    CANDIES = stageData[stage-1].candies;
}

// check rows from bottom row
const checkRow = array => {
    
    for (let j = BOARDHEIGHT-1; j >=0; j--) {
        for (let i=2; i < BOARDWIDTH; i++) {
            
            const candyFirst = array[j][i-2];
            const candySecond = array[j][i-1];
            const candyThird = array[j][i];
            if (candyFirst === candySecond && candySecond === candyThird && candyThird !=="empty") {
                // itemBoard[j][i-2] = "empty";
                // itemBoard[j][i-1] = "empty";
                // itemBoard[j][i] = "empty";
                candiesToCrush.push(
                    `row${j}col${i-2}`,
                    `row${j}col${i-1}`,
                    `row${j}col${i}`,
                );
                
                // console.log("row " + j + "crushed");                  
            }
        }}        
    
    // render();       
        
}

// check col from bottom row
const checkCol = array => {
    
    for (let j = BOARDHEIGHT-1; j >=2; j--) {
        for (let i=0; i < BOARDWIDTH; i++) {
            
            const candyFirst = array[j][i];
            const candySecond = array[j-1][i];
            const candyThird = array[j-2][i];
            if (candyFirst === candySecond && candySecond === candyThird && candyThird !=="empty") {
                // itemBoard[j][i] = "empty";
                // itemBoard[j-1][i] = "empty";
                // itemBoard[j-2][i] = "empty";
                candiesToCrush.push(
                    `row${j}col${i}`,
                    `row${j-1}col${i}`,
                    `row${j-2}col${i}`,
                );
                // console.log("column " + i + "crushed");                    
            }
        }}
        
    // render();        
}

// replaced crushed candies for new game
const refillCandiesBoardNewGameOnly = () => {
    for (let j = 0; j < BOARDHEIGHT; j++) {
        for (let i = 0; i < BOARDWIDTH; i++) {
            if (itemBoard[j][i] === "empty") {
                const candyRandom = CANDIESINIT[Math.floor(Math.random() * CANDIESINIT.length)];
                itemBoard[j][i] = candyRandom;
            }}  
    
        }
    render();
    console.log("replaced crushed candies - new game")
    // setTimeout(checkForCandyCrush, 1200);
} 

const crushCandiesNewGameOnly = () => {
    console.log("crushing candies: " + candiesToCrush);
    candiesToCrush.forEach(candy => {
        const candyRow = sliceRowNumberFromId(candy);
        const candyCol = sliceColNumberFromId(candy);
        itemBoard[candyRow][candyCol] = "empty";
    })
    candiesToCrush = [];
    // console.log("cleared: candies to crush array " + candiesToCrush)
    render();
    // console.log("itemBoard: ")
    console.log("crushed candies: new game")
    
    // gravity();        
} 

const getCherries = () => {
    cherries = 0;
    itemBoard.forEach(array => {
        array.forEach(candy => {
            if (candy==="cherry") {
                cherries += 1;
            }
        })
    })
    console.log("cherries: " + cherries);
}

const newGame = () => {
    getStageData();
    // console.log(BOARDHEIGHT)
    // console.log(BOARDWIDTH)
    itemBoard = createRandomArray();  
    for (let i=0; i<10; i++) {
        checkRow(itemBoard);
        checkCol(itemBoard);
        
        crushCandiesNewGameOnly();
        // checkForCandyCrush();
        refillCandiesBoardNewGameOnly();   
        checkThreeAndFourCandiesMovesLeft();
    }  
    comboMeter = 0;
    score = 0;
    stylePoints = 0;
    getCherries();
      
}

    // ------------------------------------ CONTROLLER ---------------------------------------
// get number for array index
const sliceRowNumberFromId = id => {
    return parseInt(id.slice(3, 4));
}
// get number for array index
const sliceColNumberFromId = id => {
    return parseInt(id.slice(7, 8));
}

//get drag candy id
const getDraggedCandy = id => {
    const candyDraggedRow = sliceRowNumberFromId(id);
    const candyDraggedCol = sliceColNumberFromId(id);
    // console.log("dragged candy: " + candyDraggedRow, candyDraggedCol);
    // get candy number of dragged candy
    draggedCandyName = itemBoard[candyDraggedRow][candyDraggedCol];
    console.log("dragged candy name: " + draggedCandyName);
    // calculate id of droppable candy on top of dragged candy
    // const droppableCandyTopId = `row${candyDraggedRow-1}col${candyDraggedCol}`;
    // causing undefined errors and illegal moves still work
    // const droppableCandyTopName = itemBoard[candyDraggedRow-1][candyDraggedCol];
    // if (checkScorable(draggedCandyId, draggedCandyName, droppableCandyTopId, droppableCandyTopName)) {
    //     droppableCandiesId.push(droppableCandyTopId);
    // }
    // right droppable candy
    // const droppableCandyRightId = `row${candyDraggedRow}col${candyDraggedCol+1}`;
    // causing undefined errors and illegal moves still work
    // const droppableCandyRightName = itemBoard[candyDraggedRow][candyDraggedCol+1];
    // if (checkScorable(draggedCandyId, draggedCandyName, droppableCandyRightId, droppableCandyRightName)) {
    //     droppableCandiesId.push(droppableCandyRightId);
    // }
    // bottom droppable candy
    // const droppableCandyBottomId = `row${candyDraggedRow+1}col${candyDraggedCol}`;
    // causing undefined errors and illegal moves still work
    // const droppableCandyBottomName = itemBoard[candyDraggedRow+1][candyDraggedCol];
    // if (checkScorable(draggedCandyId, draggedCandyName, droppableCandyBottomId, droppableCandyBottomName)) {
    //     droppableCandiesId.push(droppableCandyBottomId);
    // }
    // left droppable candy
    // const droppableCandyLeftId = `row${candyDraggedRow}col${candyDraggedCol-1}`;
    // causing undefined errors and illegal moves still work
    // const droppableCandyLeftName = itemBoard[candyDraggedRow][candyDraggedCol-1];
    // if (checkScorable(draggedCandyId, draggedCandyName, droppableCandyLeftId, droppableCandyLeftName)) {
    //     droppableCandiesId.push(droppableCandyLeftId);
    // }
    
    // droppableCandiesId.push(
    //     droppableCandyTopId, 
    //     droppableCandyRightId, 
    //     droppableCandyBottomId, 
    //     droppableCandyLeftId,
    // );

    // droppableCandiesId.forEach(candy => {
    //     $(`#${candy}`).addClass("adjacent");
    // })

    for (let i=0; i<droppables.length-1; i++) {
        if (draggables[i]===id) {
            const candyTarget = droppables[i];
            $(`#${candyTarget}`).addClass("adjacent");
        }
    }

    // render();

    // console.log("drop targets: " + droppableCandiesId);
}

// const checkScorable = (id1, name1, id2, name2) => {
//     console.log("ids to check are: " + id1 + " and " + id2);
//     console.log("names to check are: " + name1 + " and " + name2);
//     let scorable = false;
//     let checkingArray = itemBoard.map(item => item);;
//     // swap immediately at the start
//     const candy1Row = sliceRowNumberFromId(id2);
//     const candy1Col = sliceColNumberFromId(id2);
//     const candy1 = name1;
//     console.log("candy1: " + name2 + " row " + candy1Row + " col " + candy1Col)
//     const candy2Row = sliceRowNumberFromId(id1);
//     const candy2Col = sliceColNumberFromId(id1);
//     const candy2 = name2;

//     checkingArray[candy1Row][candy1Col] = candy1;
//     checkingArray[candy2Row][candy2Col] = candy2;

//     console.log(checkingArray);

//     for (let j = BOARDHEIGHT-1; j >=0; j--) {
//         for (let i=2; i < BOARDWIDTH; i++) {
            
//             const candyFirst = checkingArray[j][i-2];
//             const candySecond = checkingArray[j][i-1];
//             const candyThird = checkingArray[j][i];
//             if (candyFirst === candySecond && candySecond === candyThird && candyThird !=="empty") {
//                     scorable = true;       
//             }
//         }}  
//     for (let j = BOARDHEIGHT-1; j >=2; j--) {
//         for (let i=0; i < BOARDWIDTH; i++) {
            
//             const candyFirst = checkingArray[j][i];
//             const candySecond = checkingArray[j-1][i];
//             const candyThird = checkingArray[j-2][i];
//             if (candyFirst === candySecond && candySecond === candyThird && candyThird !=="empty") {
//                 scorable = true;               
//             }
//         }}      
//     console.log(scorable);
//     if (scorable===true) {
//         return true;
//     } else return false;
// }

// check for 3 or 4 in a row or col
const checkForCandyCrush = () => {
    // map current candy array
    console.log("checking for crush");
    let checkingArray = itemBoard.map(item => item);
    // input in new candy arrnagement and check if any candy gets crushed
    // candy1 is the dragged candy
    // skip block below for the chain combos
    if (draggedCandyId !== "") {
        
        let candy1Row = sliceRowNumberFromId(draggedCandyId);
        let candy1Col = sliceColNumberFromId(draggedCandyId);
        // candy2 is the candy being dropped on
        let candy2Row = sliceRowNumberFromId(droppedCandyId);
        let candy2Col = sliceColNumberFromId(droppedCandyId);
        // swop the candy names
        const candy1Name = droppedCandyName;
        const candy2Name = draggedCandyName;
        // update the checking Array
        checkingArray[candy1Row][candy1Col] = candy1Name;
        checkingArray[candy2Row][candy2Col] = candy2Name;
        checkRow(checkingArray);
        checkCol(checkingArray);
        console.log("candies to crush: " + candiesToCrush)
        console.log("length of candies to crush array: " + candiesToCrush.length);
    }
    
    
    // checkRow(itemBoard);
    // checkCol(itemBoard);
    // console.log("candies to crush: " + candiesToCrush)
    // console.log("length of candies to crush array: " + candiesToCrush.length);
    
    // if there are candies to crush, crush again
    if (candiesToCrush.length>2) {
        itemBoard = checkingArray;
        // checkRow(itemBoard);
        // checkCol(itemBoard);
        
        render();
        draggedCandyName = "";
        draggedCandyId = "";
        droppedCandyName = "";
        droppedCandyId = "";
        comboMeter += candiesToCrush.length;
        crushRandomRow();
        score += candiesToCrush.length;
        render();
        setTimeout(crushCandies, 1100);
    } else {
        checkRow(itemBoard);
        checkCol(itemBoard);
        console.log("candies to crush: " + candiesToCrush)
        console.log("length of candies to crush array: " + candiesToCrush.length);
        if (candiesToCrush.length>2) {
            comboMeter += candiesToCrush.length;
            crushRandomRow();
            score += candiesToCrush.length;            
            render();            
            setTimeout(crushCandies, 1100);
        } else {
            comboMeter = 0;            
            render();       
        
        }
        
    }
    
}    

const crushRandomRow = () => {
    if (comboMeter >= COMBORANK[COMBORANK.length-1].points) {
        const randomRow = Math.floor(Math.random()*BOARDHEIGHT);
        for (let i=0; i<BOARDWIDTH; i++) {
            candiesToCrush.push(`row${randomRow}col${i}`);
        }   
        
    }
}
    
const crushCandies = () => {
    console.log("crushing candies: " + candiesToCrush);
    candiesToCrush.forEach(candy => {
        const candyRow = sliceRowNumberFromId(candy);
        const candyCol = sliceColNumberFromId(candy);
        itemBoard[candyRow][candyCol] = "empty";
    })
    candiesToCrush = [];
    console.log("cleared: candies to crush array " + candiesToCrush)
    
    render();
    console.log("combo points: ")
    console.log(comboMeter)
    console.log(getComboRank());
    console.log("score: ")
    console.log(score)
    draggables = [];
    droppables = [];
    
    setTimeout(gravity, 800);        
} 

    

// pushes candies to the 'floor'   
const gravity = () => {
    // console.log("gravity board: ")
    // map the itemBoard
    let initialBoard = itemBoard;    

    // transpose mapped itemBoard
    initialBoard = initialBoard[0].map((_, colIndex) => initialBoard.map(row => row[colIndex]));
    console.log("initial gravity board: ");
    console.log(initialBoard);
    let gravityBoard = [];

    // remove all 'empty', reducing array.length
    initialBoard.forEach(column => {
        let newColumn = column.filter(candy => candy !== "empty")
        // prepend 'empty' until array is the right length
        while (newColumn.length < BOARDHEIGHT) {
            newColumn.unshift("empty");
        }               
        gravityBoard.push(newColumn);
    })
    // console.log(gravityBoard);

    // itemboard copys the mapped array
    
    itemBoard = gravityBoard[0].map((_, colIndex) => gravityBoard.map(row => row[colIndex]));
    render();
    // setTimeout(checkForCandyCrush, 1500);
    // refill candies board
    setTimeout(refillCandiesBoard, 1100);
}

const refillCandiesBoard = () => {
    for (let j = 0; j < BOARDHEIGHT; j++) {
        for (let i = 0; i < BOARDWIDTH; i++) {
            if (itemBoard[j][i] === "empty") {
                const candyRandom = CANDIES[Math.floor(Math.random() * CANDIES.length)];
                itemBoard[j][i] = candyRandom;
            }}  
    
        }
    render();
    console.log("replaced crushed candies")
    setTimeout(checkThreeAndFourCandiesMovesLeft, 100);
} 

const getComboRank = () => {
    for (let i=COMBORANK.length-1; i>=0; i--) {
        if (comboMeter >= COMBORANK[i].points) {
            return `${COMBORANK[i].rank}`;
        }   
    }
}  

const getComboText = () => {
    for (let i=COMBORANK.length-1; i>=0; i--) {
        if (comboMeter >= COMBORANK[i].points) {
            return `${COMBORANK[i].text}`;
        }   
    }
} 

const checkThreeAndFourCandiesMovesLeft = () => {
    let movesLeft = 0;
    draggables = [];
    droppables = [];

    movesLeft += checkHorzPattern1();
    movesLeft += checkHorzPattern2();
    movesLeft += checkHorzPattern3();
    movesLeft += checkHorzPattern4();
    movesLeft += checkHorzPattern5();
    movesLeft += checkHorzPattern6();
    movesLeft += checkHorzPattern7();
    movesLeft += checkHorzPattern8();
    movesLeft += checkHorzPattern9();
    movesLeft += checkHorzPattern10();
    movesLeft += checkHorzPattern11();
    movesLeft += checkHorzPattern12();
    movesLeft += checkHorzPattern13();
    movesLeft += checkHorzPattern14();
    movesLeft += checkHorzPattern15();
    movesLeft += checkHorzPattern16();
    movesLeft += checkHorzPattern17();
    movesLeft += checkHorzPattern18();
    movesLeft += checkVertPattern1();
    movesLeft += checkVertPattern2();
    movesLeft += checkVertPattern3();
    movesLeft += checkVertPattern4();
    movesLeft += checkVertPattern5();
    movesLeft += checkVertPattern6();
    movesLeft += checkVertPattern7();
    movesLeft += checkVertPattern8();
    movesLeft += checkVertPattern9();
    movesLeft += checkVertPattern10();
    movesLeft += checkVertPattern11();
    movesLeft += checkVertPattern12();
    movesLeft += checkVertPattern13();
    movesLeft += checkVertPattern14();
    movesLeft += checkVertPattern15();
    movesLeft += checkVertPattern16();
    movesLeft += checkVertPattern17();
    movesLeft += checkVertPattern18();
    console.log("moves left: " + movesLeft);
    moves = movesLeft;
    // setTimeout(checkForCandyCrush, 1200);
    draggables.forEach(candy => {
        droppables.push(candy);
    })
    droppables.forEach(candy => {
        draggables.push(candy);
    })
    console.log("draggables: ")
    console.log(draggables)
    console.log("droppables: ")
    console.log(droppables)    
    checkWinCon();
}

const checkWinCon = () => {
    const winCon = stageData[stage-1].function();
    if (moves===0) {
        console.log("You are out of moves!");
    } else if (winCon===true) {
        console.log("You win!");
        $(".game-board").append($("<span>").addClass("stage-end").text("STAGE CLEAR!"));
        $("img").attr("draggable", "false");
        $("img").css("cursor", "auto");
        stage += 1;
        comboMeter = 0;
        // stylePoints = 0;
        score = 0;
        moves = 0;
        setTimeout(renderStageInfo, 2500);
    } else setTimeout(checkForCandyCrush, 1000);
}





// potential scoring patterns --------------------------------

// horizontal

// 3 candies
// pattern 1
const checkHorzPattern1 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-2; j>=1; j--) {
        for (let i=0; i<BOARDWIDTH-3; i++) {
            const candyFirst = itemBoard[j+1][i];
            const candySecond = itemBoard[j][i+1];
            const candyThird = itemBoard[j][i+2];
            if (candyFirst===candySecond && candySecond===candyThird && candyThird!=="empty") {
                movesLeft += 1;
                // console.log(`row${j+1}col${i}`)
                draggables.push(`row${j+1}col${i}`);
                droppables.push(`row${j}col${i}`);
                
            }
        }
    }
    console.log("horz pattern 1: " + movesLeft);
    return movesLeft;
}

// pattern 2
const checkHorzPattern2 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-2; j>=1; j--) {
        for (let i=0; i<BOARDWIDTH-3; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j+1][i+1];
            const candyThird = itemBoard[j][i+2];
            if (candyFirst===candySecond && candySecond===candyThird && candyThird!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i}`);
                draggables.push(`row${j+1}col${i+1}`);
                droppables.push(`row${j}col${i+1}`);
            }
        }
    }
    console.log("horz pattern 2: " + movesLeft);
    return movesLeft;
}

// pattern 3
const checkHorzPattern3 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-2; j>=1; j--) {
        for (let i=0; i<BOARDWIDTH-3; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j][i+1];
            const candyThird = itemBoard[j+1][i+2];
            if (candyFirst===candySecond && candySecond===candyThird && candyThird!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i}`)
                draggables.push(`row${j+1}col${i+2}`);
                droppables.push(`row${j}col${i+2}`);
            }
        }
    }
    console.log("horz pattern 3: " + movesLeft);
    return movesLeft;
}

// pattern 4
const checkHorzPattern4 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-2; j>=1; j--) {
        for (let i=0; i<BOARDWIDTH-3; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j+1][i+1];
            const candyThird = itemBoard[j+1][i+2];
            if (candyFirst===candySecond && candySecond===candyThird && candyThird!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i}`)
                draggables.push(`row${j}col${i}`);
                droppables.push(`row${j+1}col${i}`);
            }
        }
    }
    console.log("horz pattern 4: " + movesLeft);
    return movesLeft;
}

// pattern 5
const checkHorzPattern5 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-2; j>=1; j--) {
        for (let i=0; i<BOARDWIDTH-3; i++) {
            const candyFirst = itemBoard[j+1][i];
            const candySecond = itemBoard[j][i+1];
            const candyThird = itemBoard[j+1][i+2];
            if (candyFirst===candySecond && candySecond===candyThird && candyThird!=="empty") {
                movesLeft += 1;
                // console.log(`row${j+1}col${i}`)
                draggables.push(`row${j}col${i+1}`);
                droppables.push(`row${j+1}col${i+1}`);
            }
        }
    }
    console.log("horz pattern 5: " + movesLeft);
    return movesLeft;
}

// pattern 6
const checkHorzPattern6 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-2; j>=1; j--) {
        for (let i=0; i<BOARDWIDTH-3; i++) {
            const candyFirst = itemBoard[j+1][i];
            const candySecond = itemBoard[j+1][i+1];
            const candyThird = itemBoard[j][i+2];
            if (candyFirst===candySecond && candySecond===candyThird && candyThird!=="empty") {
                movesLeft += 1;
                // console.log(`row${j+1}col${i}`)
                draggables.push(`row${j}col${i+2}`);
                droppables.push(`row${j+1}col${i+2}`);
            }
        }
    }
    console.log("horz pattern 6: " + movesLeft);
    return movesLeft;
}

// 4 candies
// pattern 7
const checkHorzPattern7 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-2; j>=1; j--) {
        for (let i=0; i<BOARDWIDTH-4; i++) {
            const candyFirst = itemBoard[j+1][i];
            const candySecond = itemBoard[j][i+1];
            const candyThird = itemBoard[j][i+2];
            const candyFourth = itemBoard[j][i+3];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j+1}col${i}`)
                draggables.push(`row${j+1}col${i}`);
                droppables.push(`row${j}col${i}`);
            }
        }
    }
    console.log("horz pattern 7: " + movesLeft);
    return movesLeft;
}

const checkHorzPattern8 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-2; j>=1; j--) {
        for (let i=0; i<BOARDWIDTH-4; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j+1][i+1];
            const candyThird = itemBoard[j][i+2];
            const candyFourth = itemBoard[j][i+3];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i}`)
                draggables.push(`row${j+1}col${i+1}`);
                droppables.push(`row${j}col${i+1}`);
            }
        }
    }
    console.log("horz pattern 8: " + movesLeft);
    return movesLeft;
}

const checkHorzPattern9 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-2; j>=1; j--) {
        for (let i=0; i<BOARDWIDTH-4; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j][i+1];
            const candyThird = itemBoard[j+1][i+2];
            const candyFourth = itemBoard[j][i+3];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i}`)
                draggables.push(`row${j+1}col${i+2}`);
                droppables.push(`row${j}col${i+2}`);
            }
        }
    }
    console.log("horz pattern 9: " + movesLeft);
    return movesLeft;
}

const checkHorzPattern10 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-2; j>=1; j--) {
        for (let i=0; i<BOARDWIDTH-4; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j][i+1];
            const candyThird = itemBoard[j][i+2];
            const candyFourth = itemBoard[j+1][i+3];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i}`)
                draggables.push(`row${j+1}col${i+3}`);
                droppables.push(`row${j}col${i+3}`);
            }
        }
    }
    console.log("horz pattern 10: " + movesLeft);
    return movesLeft;
}

const checkHorzPattern11 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-2; j>=1; j--) {
        for (let i=0; i<BOARDWIDTH-4; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j+1][i+1];
            const candyThird = itemBoard[j+1][i+2];
            const candyFourth = itemBoard[j+1][i+3];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i}`)
                draggables.push(`row${j}col${i}`);
                droppables.push(`row${j+1}col${i}`);
            }
        }
    }
    console.log("horz pattern 11: " + movesLeft);
    return movesLeft;
}

const checkHorzPattern12 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-2; j>=1; j--) {
        for (let i=0; i<BOARDWIDTH-4; i++) {
            const candyFirst = itemBoard[j+1][i];
            const candySecond = itemBoard[j][i+1];
            const candyThird = itemBoard[j+1][i+2];
            const candyFourth = itemBoard[j+1][i+3];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j+1}col${i}`)
                draggables.push(`row${j}col${i+1}`);
                droppables.push(`row${j+1}col${i+1}`);
            }
        }
    }
    console.log("horz pattern 12: " + movesLeft);
    return movesLeft;
}

const checkHorzPattern13 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-2; j>=1; j--) {
        for (let i=0; i<BOARDWIDTH-4; i++) {
            const candyFirst = itemBoard[j+1][i];
            const candySecond = itemBoard[j+1][i+1];
            const candyThird = itemBoard[j][i+2];
            const candyFourth = itemBoard[j+1][i+3];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j+1}col${i}`)
                draggables.push(`row${j}col${i+2}`);
                droppables.push(`row${j+1}col${i+2}`);
            }
        }
    }
    console.log("horz pattern 13: " + movesLeft);
    return movesLeft;
}

const checkHorzPattern14 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-2; j>=1; j--) {
        for (let i=0; i<BOARDWIDTH-4; i++) {
            const candyFirst = itemBoard[j+1][i];
            const candySecond = itemBoard[j+1][i+1];
            const candyThird = itemBoard[j+1][i+2];
            const candyFourth = itemBoard[j][i+3];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j+1}col${i}`)
                draggables.push(`row${j}col${i+3}`);
                droppables.push(`row${j+1}col${i+3}`);
            }
        }
    }
    console.log("horz pattern 14: " + movesLeft);
    return movesLeft;
}
// space between
// pattern 15
const checkHorzPattern15 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=0; j--) {
        for (let i=0; i<BOARDWIDTH-4; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j][i+2];
            const candyThird = itemBoard[j][i+3];
            if (candyFirst===candySecond && candySecond===candyThird && candyThird!=="empty") {
                movesLeft += 1;
                // console.log(`row${j+1}col${i}`)
                draggables.push(`row${j}col${i}`);
                droppables.push(`row${j}col${i+1}`);
            }
        }
    }
    console.log("horz pattern 15: " + movesLeft);
    return movesLeft;
}

// pattern 16
const checkHorzPattern16 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=0; j--) {
        for (let i=0; i<BOARDWIDTH-4; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j][i+1];
            const candyThird = itemBoard[j][i+3];
            if (candyFirst===candySecond && candySecond===candyThird && candyThird!=="empty") {
                movesLeft += 1;
                // console.log(`row${j+1}col${i}`)
                draggables.push(`row${j}col${i+3}`);
                droppables.push(`row${j}col${i+2}`);
            }
        }
    }
    console.log("horz pattern 16: " + movesLeft);
    return movesLeft;
}

// pattern 17
const checkHorzPattern17 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=0; j--) {
        for (let i=0; i<BOARDWIDTH-5; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j][i+2];
            const candyThird = itemBoard[j][i+3];
            const candyFourth = itemBoard[j][i+4];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j+1}col${i}`)
                draggables.push(`row${j}col${i}`);
                droppables.push(`row${j}col${i+1}`);
            }
        }
    }
    console.log("horz pattern 17: " + movesLeft);
    return movesLeft;
}

// pattern 18
const checkHorzPattern18 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=0; j--) {
        for (let i=0; i<BOARDWIDTH-5; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j][i+1];
            const candyThird = itemBoard[j][i+2];
            const candyFourth = itemBoard[j][i+4];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j+1}col${i}`)
                draggables.push(`row${j}col${i+4}`);
                droppables.push(`row${j}col${i+3}`);
            }
        }
    }
    console.log("horz pattern 18: " + movesLeft);
    return movesLeft;
}


// vertical

// 3 candies
// pattern 1
const checkVertPattern1 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=2; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i+1];
            const candySecond = itemBoard[j-1][i];
            const candyThird = itemBoard[j-2][i];
            if (candyFirst===candySecond && candySecond===candyThird && candyThird!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i+1}`)
                draggables.push(`row${j}col${i+1}`);
                droppables.push(`row${j}col${i}`);
            }
        }
    }
    console.log("vert pattern 1: " + movesLeft);
    return movesLeft;
}

// pattern 2
const checkVertPattern2 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=2; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j-1][i+1];
            const candyThird = itemBoard[j-2][i];
            if (candyFirst===candySecond && candySecond===candyThird && candyThird!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i}`)
                draggables.push(`row${j-1}col${i+1}`);
                droppables.push(`row${j-1}col${i}`);
            }
        }
    }
    console.log("vert pattern 2: " + movesLeft);
    return movesLeft;
}

// pattern 3
const checkVertPattern3 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=2; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j-1][i];
            const candyThird = itemBoard[j-2][i+1];
            if (candyFirst===candySecond && candySecond===candyThird && candyThird!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i}`)
                draggables.push(`row${j-2}col${i+1}`);
                droppables.push(`row${j-2}col${i}`);
            }
        }
    }
    console.log("vert pattern 3: " + movesLeft);
    return movesLeft;
}

// pattern 4
const checkVertPattern4 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=2; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j-1][i+1];
            const candyThird = itemBoard[j-2][i+1];
            if (candyFirst===candySecond && candySecond===candyThird && candyThird!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i}`)
                draggables.push(`row${j}col${i}`);
                droppables.push(`row${j}col${i+1}`);
            }
        }
    }
    console.log("vert pattern 4: " + movesLeft);
    return movesLeft;
}

// pattern 5
const checkVertPattern5 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=2; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i+1];
            const candySecond = itemBoard[j-1][i];
            const candyThird = itemBoard[j-2][i+1];
            if (candyFirst===candySecond && candySecond===candyThird && candyThird!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i+1}`)
                draggables.push(`row${j-1}col${i}`);
                droppables.push(`row${j-1}col${i+1}`);
            }
        }
    }
    console.log("vert pattern 5: " + movesLeft);
    return movesLeft;
}

// pattern 6
const checkVertPattern6 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=2; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i+1];
            const candySecond = itemBoard[j-1][i+1];
            const candyThird = itemBoard[j-2][i];
            if (candyFirst===candySecond && candySecond===candyThird && candyThird!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i+1}`)
                draggables.push(`row${j-2}col${i}`);
                droppables.push(`row${j-2}col${i+1}`);
            }
        }
    }
    console.log("vert pattern 6: " + movesLeft);
    return movesLeft;
}

// 4 candies
// pattern 7
const checkVertPattern7 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=3; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i+1];
            const candySecond = itemBoard[j-1][i];
            const candyThird = itemBoard[j-2][i];
            const candyFourth = itemBoard[j-3][i];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i+1}`)
                draggables.push(`row${j}col${i+1}`);
                droppables.push(`row${j}col${i}`);
            }
        }
    }
    console.log("vert pattern 7: " + movesLeft);
    return movesLeft;
}

// pattern 8
const checkVertPattern8 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=3; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j-1][i+1];
            const candyThird = itemBoard[j-2][i];
            const candyFourth = itemBoard[j-3][i];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i}`)
                draggables.push(`row${j-1}col${i+1}`);
                droppables.push(`row${j-1}col${i}`);
            }
        }
    }
    console.log("vert pattern 8: " + movesLeft);
    return movesLeft;
}

// pattern 9
const checkVertPattern9 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=3; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j-1][i];
            const candyThird = itemBoard[j-2][i+1];
            const candyFourth = itemBoard[j-3][i];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i}`)
                draggables.push(`row${j-2}col${i+1}`);
                droppables.push(`row${j-2}col${i}`);
            }
        }
    }
    console.log("vert pattern 9: " + movesLeft);
    return movesLeft;
}

// pattern 10
const checkVertPattern10 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=3; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j-1][i];
            const candyThird = itemBoard[j-2][i];
            const candyFourth = itemBoard[j-3][i+1];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i}`)
                draggables.push(`row${j-3}col${i+1}`);
                droppables.push(`row${j-3}col${i}`);
            }
        }
    }
    console.log("vert pattern 10: " + movesLeft);
    return movesLeft;
}

// pattern 11
const checkVertPattern11 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=3; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j-1][i+1];
            const candyThird = itemBoard[j-2][i+1];
            const candyFourth = itemBoard[j-3][i+1];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i}`)
                draggables.push(`row${j}col${i}`);
                droppables.push(`row${j}col${i+1}`);
            }
        }
    }
    console.log("vert pattern 11: " + movesLeft);
    return movesLeft;
}

// pattern 12
const checkVertPattern12 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=3; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i+1];
            const candySecond = itemBoard[j-1][i];
            const candyThird = itemBoard[j-2][i+1];
            const candyFourth = itemBoard[j-3][i+1];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i+1}`)
                draggables.push(`row${j-1}col${i}`);
                droppables.push(`row${j-1}col${i+1}`);
            }
        }
    }
    console.log("vert pattern 12: " + movesLeft);
    return movesLeft;
}

// pattern 13
const checkVertPattern13 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=3; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i+1];
            const candySecond = itemBoard[j-1][i+1];
            const candyThird = itemBoard[j-2][i];
            const candyFourth = itemBoard[j-3][i+1];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i+1}`)
                draggables.push(`row${j-2}col${i}`);
                droppables.push(`row${j-2}col${i+1}`);
            }
        }
    }
    console.log("vert pattern 13: " + movesLeft);
    return movesLeft;
}

// pattern 14
const checkVertPattern14 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=3; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i+1];
            const candySecond = itemBoard[j-1][i+1];
            const candyThird = itemBoard[j-2][i+1];
            const candyFourth = itemBoard[j-3][i];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i+1}`)
                draggables.push(`row${j-3}col${i}`);
                droppables.push(`row${j-3}col${i+1}`);
            }
        }
    }
    console.log("vert pattern 14: " + movesLeft);
    return movesLeft;
}
// space between patterns
// pattern 15
const checkVertPattern15 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=3; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j-1][i];
            const candyThird = itemBoard[j-3][i];
            if (candyFirst===candySecond && candySecond===candyThird && candyThird!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i+1}`)
                draggables.push(`row${j-3}col${i}`);
                droppables.push(`row${j-2}col${i}`);
            }
        }
    }
    console.log("vert pattern 15: " + movesLeft);
    return movesLeft;
}

// pattern 16
const checkVertPattern16 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=3; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j-2][i];
            const candyThird = itemBoard[j-3][i];
            if (candyFirst===candySecond && candySecond===candyThird && candyThird!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i+1}`)
                draggables.push(`row${j}col${i}`);
                droppables.push(`row${j-1}col${i}`);
            }
        }
    }
    console.log("vert pattern 16: " + movesLeft);
    return movesLeft;
}
// pattern 17
const checkVertPattern17 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=4; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j-1][i];
            const candyThird = itemBoard[j-2][i];
            const candyFourth = itemBoard[j-4][i];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i+1}`)
                draggables.push(`row${j-4}col${i}`);
                droppables.push(`row${j-3}col${i}`);
            }
        }
    }
    console.log("vert pattern 17: " + movesLeft);
    return movesLeft;
}
// pattern 18
const checkVertPattern18 = () => {
    let movesLeft = 0;
    for (let j=BOARDHEIGHT-1; j>=4; j--) {
        for (let i=0; i<BOARDWIDTH-1; i++) {
            const candyFirst = itemBoard[j][i];
            const candySecond = itemBoard[j-2][i];
            const candyThird = itemBoard[j-3][i];
            const candyFourth = itemBoard[j-4][i];
            if (candyFirst===candySecond && candySecond===candyThird && 
                candyThird===candyFourth && candyFourth!=="empty") {
                movesLeft += 1;
                // console.log(`row${j}col${i+1}`)
                draggables.push(`row${j}col${i}`);
                droppables.push(`row${j-1}col${i}`);
            }
        }
    }
    console.log("vert pattern 18: " + movesLeft);
    return movesLeft;
}


    // --------------------- VIEW -----------------------------------------

const render = () => {

    $container.empty();

    const $gameControl = $("<div>").addClass("control");
    const $restartLevel = $("<button>").addClass("restart-button").text("Restart Stage");
    const $quitGame = $("<button>").addClass("quit-game").text("Quit");

    $restartLevel.on("click", renderStageInfo);
    $quitGame.on("click", renderInitialScreen);
    $gameControl.append($restartLevel, $quitGame);

    const $objective = $("<div>").addClass("objective");
    const $stage = $("<div>").addClass("stage").text(`${stageData[stage-1].name} | ${stageData[stage-1].text}`);
    $objective.append($stage);
    
    const $info1 = $("<div>").addClass("info-1");
    const $moves = $("<div>").addClass("moves").text(`Moves left: ${moves}`);
    if (moves===0) {
        $moves.css("color", "transparent");
    };
    const $score = $("<div>").addClass("score").text(`Score: ${score}`);

    // const $stylePoints = $("<span>").addClass("style-points").text(`Style score: ${stylePoints}`);
    
    $info1.append($moves, $score, /*$stylePoints*/);

    const $info2 = $("<div>").addClass("info-2");

    
    const $comboPoints = $("<span>").addClass("combo-points").text(`${comboMeter} hit combo`);
    if (comboMeter===0) {
        $comboPoints.css("color", "transparent");
    };
    const $comboText = $("<span>").addClass("combo-text").text(`${getComboText()}`);
    $info2.append($comboPoints, $comboText);

    const $gameBoard = $("<div>").addClass("game-board");
    
    for (let j = 0; j < BOARDHEIGHT; j++) {
        const $row = $("<div>").addClass("row");
        for (let i=0; i < BOARDWIDTH; i++) {
            const $candy = $("<img>");
            $candy.attr("id", `row${j}col${i}`);
            $candy.attr("src", `./images/${itemBoard[j][i]}.jpg`);
            // $candy.attr("draggable", "true");

            droppables.forEach(candy => {
                if (candy === $candy.attr("id")) {
                    $candy.addClass("dropzone");
                }
            })

            draggables.forEach(candy => {
                if (candy === $candy.attr("id")) {
                    $candy.attr("draggable", "true");
                }
            })           
            
            candiesToCrush.forEach(candy => {
                if (candy === $candy.attr("id")) {
                    $candy.addClass("crush");
                }
            })

            $row.append($candy);
        }
        $gameBoard.append($row);
    }
    
    $container.append($gameControl, $objective, $info1, $info2, $gameBoard);
}

const renderInitialScreen = () => {
    stage = 1;
    $container.empty();
    const $title = $("<h1>").text("CANDY CRUSH");
    const $img = $("<p>").text(
        "Placeholder image"
        );
    const $startButton = $("<button>").text("PLAY");      
    $startButton.on("click", renderStageInfo);

    const $howToPlay = $("<button>").text("GAME INFO");
    $howToPlay.on("click", renderHowToPlay);

    $container.append($title, $img, $howToPlay, $startButton);
}

const renderHowToPlay = () => {
    $container.empty();
    const $title = $("<h2>").text("How to play");
    const $img = $("<p>").text(
        "Placeholder image"
        );
    const $backButton = $("<button>").text("BACK");
    $backButton.on("click", renderInitialScreen);

    const $howToPlay = $("<div>")
    const $howToPlay0 = $("<div>").text(HOWTOPLAY[0]);  
    const $howToPlay1 = $("<div>").text(HOWTOPLAY[1]); 
    const $howToPlay2 = $("<div>").text(HOWTOPLAY[2]); 
    const $howToPlay3 = $("<div>").text(HOWTOPLAY[3]); 
    const $howToPlay4 = $("<div>").text(HOWTOPLAY[4]); 
    $howToPlay.append($howToPlay0, $howToPlay1, $howToPlay2, $howToPlay3, $howToPlay4); 

    $container.append($title, $img, $howToPlay, $backButton);
}

const renderStageInfo = () => {
    $container.empty();
    const $title = $("<h2>").text(`${stageData[stage-1].name}`);
    const $img = $("<p>").text(
        "Placeholder image"
        );
    const $startButton = $("<button>").text("START");
    const $stageInfo = $("<div>")
    const $infoText = $("<div>").text(/*"Get a score of 50"*/stageData[stage-1].description);  
    // const $howToPlay1 = $("<div>").text(HOWTOPLAY[1]); 
    // const $howToPlay2 = $("<div>").text(HOWTOPLAY[2]); 
    $stageInfo.append($infoText); /*, $howToPlay1, $howToPlay2);*/   
    const $quitGame = $("<button>").addClass("quit-game").text("QUIT");     
        
    $startButton.on("click", newGame);
    $quitGame.on("click", renderInitialScreen);

    $container.append($title, $img, $stageInfo, $quitGame, $startButton);

}
   

    // ----------------------------- GAME -----------------------------
const main = () => { 
    // newGame();
    
    // load initial screen with button for new game
    renderInitialScreen();

    
    // drag and drop code adapted from MDN

    /* events fired on the draggable target */
    document.addEventListener("drag", event => {
        // console.log("dragging");
        // const candyId = event.target;             
    });

    document.addEventListener("dragstart", event => {
        // store a ref. on the dragged elem
        const $dragged = $(event.target);
        // make it half transparent
        event.target.classList.add("dragging");
        // console.log(event.target)
        // get id of dragged candy
        draggedCandyId = $dragged.attr("id");
        console.log("dragging candy " + draggedCandyId);
        getDraggedCandy(draggedCandyId);        
                

    });

    document.addEventListener("dragend", event => {
        // reset the transparency
        event.target.classList.remove("dragging");
        droppableCandiesId.forEach(candy => {
            $(`#${candy}`).removeClass("adjacent");
            console.log("removed adjacent from " + candy)
        })
        droppableCandiesId = [];
        // // draggedCandyName = "";
        // console.log("drop targets: " + droppableCandiesId)
        console.log("dragged candy name: " + draggedCandyName)
        
    });

    /* events fired on the drop targets */
    document.addEventListener("dragover", event => {
        // prevent default to allow drop 
        
        if (event.target.classList.contains("dropzone")) {
            // event.target.classList.add("dragover");
            event.preventDefault();}
            // if id of candy is next to candy being dragged, preventDefault
    });

    document.addEventListener("dragenter", event => {
        // highlight potential drop target when the draggable element enters it
        // if (event.target.classList.contains("dropzone")) {
        // // event.target.classList.add("dragover");
        //     event.preventDefault();
        // }
    });

    document.addEventListener("dragleave", event => {
        // reset background of potential drop target when the draggable element leaves it
        // if (event.target.classList.contains("dropzone")) {
        // event.target.classList.remove("dragover");
        // }
    });

    document.addEventListener("drop", event => {
        // prevent default action (open as link for some elements)
        
        const $droppable = $(event.target);
        // move dragged element to the selected drop target
        if (event.target.classList.contains("dropzone") && 
            event.target.classList.contains("adjacent")) {
            // event.target.classList.remove("dragover");
            event.preventDefault();
            // get candy name of drop target
            let candyDroppedOn = $droppable.attr("src");
            droppedCandyName = candyDroppedOn.slice(9, 15);
            console.log("dropped onto " + droppedCandyName);

            // get id of drop target
            droppedCandyId = $droppable.attr("id");
            console.log("dropped onto: " + droppedCandyId)

            // clear droppable candies array and class
            // droppableCandiesId.forEach(candy => {
            //     $(`#${candy}`).removeClass("dropzone");
            //     console.log("removed dropzone from " + candy)
            // })
            // droppableCandiesId = [];
            // console.log("drop targets: " + droppableCandiesId);
            
            checkForCandyCrush();


            // $dragged.parentNode.removeChild($dragged);
            // event.target.appendChild($dragged);
        }
    });        

}


$(main);