const main = () => { 
    const BOARDWIDTH = 6;
    const BOARDHEIGHT = 6;
    const CANDIES = ["candy1", "candy2", "candy3", "candy4"];
    const $container = $(".container");

    let itemBoard = [];

    let $dragged;
    let draggedCandyName = "";
    let draggedCandyId = "";
    // array of 4
    let droppableCandiesId = [];
    let droppedCandyName = "";
    let droppedCandyId = "";

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

    // check row from bottom
    const checkRow = () => {
        
        for (let j = BOARDHEIGHT-1; j >=0; j--) {
            for (let i=2; i < BOARDWIDTH; i++) {
                
                let candyFirst = itemBoard[j][i-2];
                let candySecond = itemBoard[j][i-1];
                let candyThird = itemBoard[j][i];
                if (candyFirst === candySecond && candySecond === candyThird && candyThird !=="empty") {
                    itemBoard[j][i-2] = "empty";
                    itemBoard[j][i-1] = "empty";
                    itemBoard[j][i] = "empty";
                    
                    // console.log("row " + j + "crushed");                  
                }
            }}        
        
        render();       
            
    }

    // check col from bottom
    const checkCol = () => {
        
        for (let j = BOARDHEIGHT-3; j >=0; j--) {
            for (let i=0; i < BOARDWIDTH; i++) {
                
                let candyFirst = itemBoard[j][i];
                let candySecond = itemBoard[j+1][i];
                let candyThird = itemBoard[j+2][i];
                if (candyFirst === candySecond && candySecond === candyThird && candyThird !=="empty") {
                    itemBoard[j][i] = "empty";
                    itemBoard[j+1][i] = "empty";
                    itemBoard[j+2][i] = "empty";
                    // console.log("column " + i + "crushed");                    
                }
            }}
         
        render();        
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
    } 
    
    const newGame = () => {
        itemBoard = createRandomArray();  
        for (let i=0; i<10; i++) {
            checkRow();
            checkCol();
            refillCandiesBoard();   
        }              
    }

    const sliceRowNumberFromId = id => {
        return parseInt(id.slice(3, 4));
    }

    const sliceColNumberFromId = id => {
        return parseInt(id.slice(7, 8));
    }

    const getDroppableCandies = id => {
        const candyDraggedRow = sliceRowNumberFromId(id);
        const candyDraggedCol = sliceColNumberFromId(id);
        // console.log("dragged candy: " + candyDraggedRow, candyDraggedCol);
        // get candy number of dragged candy
        draggedCandyName = itemBoard[candyDraggedRow][candyDraggedCol];
        console.log("dragged candy name: " + draggedCandyName);
        // calculate id of droppable candy on top of dragged candy
        const droppableCandyTop = `row${candyDraggedRow-1}col${candyDraggedCol}`;
        // console.log(droppableCandyTop);
        droppableCandiesId.push(droppableCandyTop);
        // right droppable candy
        const droppableCandyRight = `row${candyDraggedRow}col${candyDraggedCol+1}`;
        // console.log(droppableCandyRight);
        droppableCandiesId.push(droppableCandyRight);
        // bottom droppable candy
        const droppableCandyBottom = `row${candyDraggedRow+1}col${candyDraggedCol}`;
        // console.log(droppableCandyBottom);
        droppableCandiesId.push(droppableCandyBottom);
        // left droppable candy
        const droppableCandyLeft = `row${candyDraggedRow}col${candyDraggedCol-1}`;
        // console.log(droppableCandyLeft);
        droppableCandiesId.push(droppableCandyLeft);

        droppableCandiesId.forEach(candy => {
            $(`#${candy}`).addClass("dropzone");
        })
        console.log("drop targets: " + droppableCandiesId);
    }

    const checkForCandyCrush = () => {
        // map current candy array
        console.log("checking for crush");
        const checkingArray = itemBoard.map(candy=>candy);
        // input in new candy arrnagement and check if any candy gets crushed
        // candy1 is the dragged candy
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
        // check rows
        for (let j = BOARDHEIGHT-1; j >=0; j--) {
            for (let i=2; i < BOARDWIDTH; i++) {
                
                let candyFirst = checkingArray[j][i-2];
                let candySecond = checkingArray[j][i-1];
                let candyThird = checkingArray[j][i];
                if (candyFirst === candySecond && candySecond === candyThird && candyThird !=="empty") {
                    // checkingArray[j][i-2] = "empty";
                    // checkingArray[j][i-1] = "empty";
                    // checkingArray[j][i] = "empty";
                    
                    console.log("row " + j + "crushed, but need to render change");    
                    itemBoard = checkingArray;
                    render();              
                }
            }} 
            // check col
            for (let j = BOARDHEIGHT-3; j >=0; j--) {
                for (let i=0; i < BOARDWIDTH; i++) {
                    
                    let candyFirst = checkingArray[j][i];
                    let candySecond = checkingArray[j+1][i];
                    let candyThird = checkingArray[j+2][i];
                    if (candyFirst === candySecond && candySecond === candyThird && candyThird !=="empty") {
                        // checkingArray[j][i] = "empty";
                        // checkingArray[j+1][i] = "empty";
                        // checkingArray[j+2][i] = "empty";
                        console.log("column " + i + "crushed, but need to render"); 
                        itemBoard = checkingArray;
                        render();                   
                    }
                }}
              
        
         

        // need to separate checkrow fn into 2: one for game start and one for game mid
        // if (checkRow(checkingArray) === true && checkCol(checkingArray) === true
        //     || checkCol(checkingArray) === true || checkRow(checkingArray) === true) {
            
        //     itemBoard = checkingArray;
        //     render();
        //     setTimeout(gravity, 2000);            
        //     setTimeout(refillCandiesBoard, 4000);           
        //     setTimeout(checkForCandyCrush, 8000);
        // }
        
        
        // += score
    }

    const gravity = () => {
        // need to compare rows for 'empty' then push rows down
        // maybe using some callback?
        for (let j = BOARDHEIGHT-1; j >=1; j--) {
            for (let i=0; i < BOARDWIDTH; i++) {
                let candy = itemBoard[j][i];
                let candyAbove = itemBoard[j-1][i];
                let temp;
                if (candy === "empty") {
                    temp = itemBoard[j-1][i];
                    itemBoard[j][i] = candyAbove;
                    itemBoard[j-1][i] = "empty";
                }}

            }
        // setTimeout(render, 2000);
        render();
        }

    // ---------------------drag and drop


    /* events fired on the draggable target */
    document.addEventListener("drag", event => {
        // console.log("dragging");
        // const candyId = event.target;
        // console.log(candyId);
        
    });

    document.addEventListener("dragstart", event => {
        // store a ref. on the dragged elem
        $dragged = $(event.target);
        // make it half transparent
        event.target.classList.add("dragging");
        // get 
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
        
        event.preventDefault();
        // console.log("no dropping")
        // if id of candy is next to candy being dragged, remove preventDefault
    });

    document.addEventListener("dragenter", event => {
        // highlight potential drop target when the draggable element enters it
        if (event.target.classList.contains("dropzone")) {
        event.target.classList.add("dragover");
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

        // need the name of candy AND the coordinates of the drop target
        // so as to MAP the itemBoard array and then check if any candies get crushed
        // if no candies crushed, nothing happens
        // if candies can be crushed, amend the itemBoard array and then render
        
        // get candy name of drop target
        let candyDroppedOn = $droppable.attr("src");
        droppedCandyName = candyDroppedOn.slice(9, 15);
        console.log("dropped onto " + droppedCandyName);

        // get id of drop target
        droppedCandyId = $droppable.attr("id");
        console.log("dropped onto: " + droppedCandyId)
        // droppableCandiesId = [];
        // console.log("drop targets: " + droppableCandiesId);
        checkForCandyCrush();


        // $dragged.parentNode.removeChild($dragged);
        // event.target.appendChild($dragged);
        }
    });

    // --------------------------------------------------

    const render = () => {
        $container.empty();
        const $gameBoard = $("<div>").addClass("game-board");
        
        for (let j = 0; j < BOARDHEIGHT; j++) {
            const $row = $("<div>").addClass("row");
            for (let i=0; i < BOARDWIDTH; i++) {
                const $candy = $("<img>");
                $candy.attr("id", `row${j}col${i}`);
                $candy.attr("src", `./images/${itemBoard[j][i]}.png`);
                $candy.attr("draggable", "true");
                
                $row.append($candy);
            }
            $gameBoard.append($row);
        }
        
        $container.append($gameBoard);
    }
   

    newGame();
      
    

}


$(main);