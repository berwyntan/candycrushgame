const BOARDWIDTH = 6;
const BOARDHEIGHT = 6;
const CANDIES = ["candy1", "candy2", "candy3", "candy4"];
const $container = $(".container");

let itemBoard = [];

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
    let checkCount = 0;
    for (let j = BOARDHEIGHT-1; j >=0; j--) {
        for (let i=2; i < BOARDWIDTH; i++) {
            if (checkCount < 1) {
                let candyFirst = itemBoard[j][i-2];
                let candySecond = itemBoard[j][i-1];
                let candyThird = itemBoard[j][i];
                if (candyFirst === candySecond && candySecond === candyThird && candyThird !=="empty") {
                    itemBoard[j][i-2] = "empty";
                    itemBoard[j][i-1] = "empty";
                    itemBoard[j][i] = "empty";
                    checkCount +=1;
                    
                }
            }}
    setTimeout(() => {render(), 2000});
            
}}

const gravity = () => {
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
    setTimeout(render(), 2000);
    }

let dragged;

/* events fired on the draggable target */
document.addEventListener("drag", event => {
    console.log("dragging");
});

document.addEventListener("dragstart", event => {
    // store a ref. on the dragged elem
    dragged = event.target;
    // make it half transparent
    event.target.classList.add("dragging");
});

document.addEventListener("dragend", event => {
    // reset the transparency
    event.target.classList.remove("dragging");
});

/* events fired on the drop targets */
document.addEventListener("dragover", event => {
    // prevent default to allow drop
    event.preventDefault();
}, false);

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
    // move dragged element to the selected drop target
    if (event.target.classList.contains("dropzone")) {
    event.target.classList.remove("dragover");
    dragged.parentNode.removeChild(dragged);
    event.target.appendChild(dragged);
    }
});

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

const main = () => {    

    itemBoard = createRandomArray();
    console.log(itemBoard);
    render();
    checkRow();
    gravity();


}


$(main);