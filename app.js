const main = () => { 

    // -------------------------------- MODEL -------------------------------------
    const BOARDWIDTH = 6;
    const BOARDHEIGHT = 8;
    const CANDIES = ["candy1", "candy2", "candy3", "candy4"];
    const COMBORANK = [
        {points: 0, rank: "", text: ""},
        {points: 10, rank: "D", text: "Delicious!"},
        {points: 13, rank: "C", text: "Crazy!"},
        {points: 16, rank: "B", text: "Bravo!"},
        {points: 19, rank: "A", text: "Awesome!"},
        {points: 22, rank: "S", text: "Sweet!"},
        {points: 25, rank: "SS", text: "Super!!"},
        {points: 30, rank: "SSS", text: "SSStyle!!!"},
    ]
    const $container = $(".container");

    let itemBoard = [];

    let draggedCandyName = "";
    let draggedCandyId = "";
    let droppableCandiesId = [];
    let droppedCandyName = "";
    let droppedCandyId = "";

    let candiesToCrush = [];

    let comboMeter = 0;
    let score = 0;
    let moves = 0;

    const createRandomArray = () => {
        let itemBoard = [];
        for (let j = 0; j < BOARDHEIGHT; j++) {
            let itemRow = [];
            for (let i = 0; i < BOARDWIDTH; i++) {
                const candyRandom = CANDIES[Math.floor(Math.random() * CANDIES.length)];
                itemRow[i] = candyRandom;            
            }
            itemBoard.push(itemRow);
        }
        return itemBoard;        
    }

    // check rows from bottom row
    const checkRow = () => {
        
        for (let j = BOARDHEIGHT-1; j >=0; j--) {
            for (let i=2; i < BOARDWIDTH; i++) {
                
                const candyFirst = itemBoard[j][i-2];
                const candySecond = itemBoard[j][i-1];
                const candyThird = itemBoard[j][i];
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
    const checkCol = () => {
        
        for (let j = BOARDHEIGHT-1; j >=2; j--) {
            for (let i=0; i < BOARDWIDTH; i++) {
                
                const candyFirst = itemBoard[j][i];
                const candySecond = itemBoard[j-1][i];
                const candyThird = itemBoard[j-2][i];
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

    // replaced crushed 
    const refillCandiesBoardNewGameOnly = () => {
        for (let j = 0; j < BOARDHEIGHT; j++) {
            for (let i = 0; i < BOARDWIDTH; i++) {
                if (itemBoard[j][i] === "empty") {
                    const candyRandom = CANDIES[Math.floor(Math.random() * CANDIES.length)];
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
    
    const newGame = () => {
        itemBoard = createRandomArray();  
        for (let i=0; i<10; i++) {
            checkRow();
            checkCol();
            crushCandiesNewGameOnly();
            // checkForCandyCrush();
            refillCandiesBoardNewGameOnly();   
        }              
    }

    // ------------------------------------ CONTROLLER ---------------------------------------

    const sliceRowNumberFromId = id => {
        return parseInt(id.slice(3, 4));
    }

    const sliceColNumberFromId = id => {
        return parseInt(id.slice(7, 8));
    }

    //get drop targets
    const getDroppableCandies = id => {
        const candyDraggedRow = sliceRowNumberFromId(id);
        const candyDraggedCol = sliceColNumberFromId(id);
        // console.log("dragged candy: " + candyDraggedRow, candyDraggedCol);
        // get candy number of dragged candy
        draggedCandyName = itemBoard[candyDraggedRow][candyDraggedCol];
        console.log("dragged candy name: " + draggedCandyName);
        // calculate id of droppable candy on top of dragged candy
        const droppableCandyTop = `row${candyDraggedRow-1}col${candyDraggedCol}`;
        // right droppable candy
        const droppableCandyRight = `row${candyDraggedRow}col${candyDraggedCol+1}`;
        // bottom droppable candy
        const droppableCandyBottom = `row${candyDraggedRow+1}col${candyDraggedCol}`;
        // left droppable candy
        const droppableCandyLeft = `row${candyDraggedRow}col${candyDraggedCol-1}`;
        
        droppableCandiesId.push(
            droppableCandyTop, 
            droppableCandyRight, 
            droppableCandyBottom, 
            droppableCandyLeft
            );

        droppableCandiesId.forEach(candy => {
            $(`#${candy}`).addClass("dropzone");
        })
        console.log("drop targets: " + droppableCandiesId);
    }

    // check for 3 or 4 in a row or col
    const checkForCandyCrush = () => {
        // map current candy array
        console.log("checking for crush");
        const checkingArray = itemBoard;
        // input in new candy arrnagement and check if any candy gets crushed
        // candy1 is the dragged candy

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

        }

        
        
        checkRow();
        checkCol();
        console.log("candies to crush: " + candiesToCrush)
        console.log("length of candies to crush array: " + candiesToCrush.length);

        
        if (candiesToCrush.length>2) {
            itemBoard = checkingArray;
            render();
            draggedCandyName = "";
            draggedCandyId = "";
            droppedCandyName = "";
            droppedCandyId = "";
            comboMeter += candiesToCrush.length;
            score += candiesToCrush.length;
            setTimeout(crushCandies, 1500);
        } else {
            comboMeter = 0;
            render();
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
        
        gravity();        
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

        initialBoard.forEach(column => {
            let newColumn = column.filter(candy => candy !== "empty")
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
        setTimeout(refillCandiesBoard, 1500);
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
        setTimeout(checkThreeAndFourCandiesMovesLeft, 1200);
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
        // for (let i=1; i>=14; i++) {
        //     movesLeft += `checkHorzPattern${i}`();
        // }
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
        console.log("moves left: " + movesLeft);
        moves = movesLeft;
        setTimeout(checkForCandyCrush, 1200);
    }

    // potential scoring patterns 

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
                    console.log(`row${j+1}col${i}`)
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
                    console.log(`row${j}col${i}`)
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
                    console.log(`row${j}col${i}`)
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
                    console.log(`row${j}col${i}`)
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
                    console.log(`row${j+1}col${i}`)
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
                    console.log(`row${j+1}col${i}`)
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
                    console.log(`row${j+1}col${i}`)
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
                    console.log(`row${j}col${i}`)
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
                    console.log(`row${j}col${i}`)
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
                    console.log(`row${j}col${i}`)
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
                    console.log(`row${j}col${i}`)
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
                    console.log(`row${j+1}col${i}`)
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
                    console.log(`row${j+1}col${i}`)
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
                    console.log(`row${j+1}col${i}`)
                }
            }
        }
        console.log("horz pattern 14: " + movesLeft);
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
                    console.log(`row${j}col${i+1}`)
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
                    console.log(`row${j}col${i}`)
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
                    console.log(`row${j}col${i}`)
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
                    console.log(`row${j}col${i}`)
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
                    console.log(`row${j}col${i+1}`)
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
                    console.log(`row${j}col${i+1}`)
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
                    console.log(`row${j}col${i+1}`)
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
                    console.log(`row${j}col${i}`)
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
                    console.log(`row${j}col${i}`)
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
                    console.log(`row${j}col${i}`)
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
                    console.log(`row${j}col${i}`)
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
                    console.log(`row${j}col${i+1}`)
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
                    console.log(`row${j}col${i+1}`)
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
                    console.log(`row${j}col${i+1}`)
                }
            }
        }
        console.log("vert pattern 14: " + movesLeft);
        return movesLeft;
    }

    
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
        getDroppableCandies(draggedCandyId);
        

    });

    document.addEventListener("dragend", event => {
        // reset the transparency
        event.target.classList.remove("dragging");
        droppableCandiesId.forEach(candy => {
            $(`#${candy}`).removeClass("dropzone");
        })
        droppableCandiesId = [];
        draggedCandyName = "";
        console.log("drop targets: " + droppableCandiesId)
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
        if (event.target.classList.contains("dropzone")) {
        // event.target.classList.add("dragover");
        event.preventDefault();
        }
    });

    document.addEventListener("dragleave", event => {
        // reset background of potential drop target when the draggable element leaves it
        if (event.target.classList.contains("dropzone")) {
        event.target.classList.remove("dragover");
        }
    });

    document.addEventListener("drop", event => {
        // prevent default action (open as link for some elements)
        event.preventDefault();
        const $droppable = $(event.target);
        // move dragged element to the selected drop target
        if (event.target.classList.contains("dropzone")) {
        event.target.classList.remove("dragover");

        // get candy name of drop target
        let candyDroppedOn = $droppable.attr("src");
        droppedCandyName = candyDroppedOn.slice(9, 15);
        console.log("dropped onto " + droppedCandyName);

        // get id of drop target
        droppedCandyId = $droppable.attr("id");
        console.log("dropped onto: " + droppedCandyId)
        droppableCandiesId = [];
        // console.log("drop targets: " + droppableCandiesId);
        checkForCandyCrush();


        // $dragged.parentNode.removeChild($dragged);
        // event.target.appendChild($dragged);
        }
    });

    // --------------------- VIEW -----------------------------------------

    const render = () => {
        $container.empty();
        const $moves = $("<div>").addClass("moves");
        if (moves===0) {
            $moves.text("");
        } else $moves.text(`Moves: ${moves}`);
        const $info = $("<div>").addClass("info");
        const $score = $("<div>").addClass("score").text(`Score: ${score}`);
        const $comboPoints = $("<span>").addClass("combo-points")
        if (comboMeter===0) {
            $comboPoints.text("")
        } else $comboPoints.text(`${comboMeter} hit combo`);
        const $comboText = $("<span>").addClass("combo-text").text(`${getComboText()}`);
        $info.append($score, $comboPoints, $comboText);

        const $gameBoard = $("<div>").addClass("game-board");
        
        for (let j = 0; j < BOARDHEIGHT; j++) {
            const $row = $("<div>").addClass("row");
            for (let i=0; i < BOARDWIDTH; i++) {
                const $candy = $("<img>");
                $candy.attr("id", `row${j}col${i}`);
                $candy.attr("src", `./images/${itemBoard[j][i]}.jpg`);
                $candy.attr("draggable", "true");
                
                $row.append($candy);

                candiesToCrush.forEach(candy => {
                    if (candy === $candy.attr("id")) {
                        $candy.addClass("crush");
                    }
                })
            }
            $gameBoard.append($row);
        }
        
        $container.append($moves, $info, $gameBoard);
    }

    const initialScreen = () => {
        const $title = $("<h1>").text("CANDY CRUSH");
        const $img = $("<p>").text(
            "Image"
            );
        const $startButton = $("<button>").text("PLAY");
        const $howToPlay = $("<p>").text(
            "Drag and drop a candy. Get 3 or 4 of the same horizontally or vertically."
            );
        $startButton.on("click", newGame);

        $container.append($title, $img, $howToPlay, $startButton);
    }
   

    // ----------------------------- GAME -----------------------------

    newGame();

    // load initial screen with button for new game
    // initialScreen();
      
    

}


$(main);