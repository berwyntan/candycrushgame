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

const fillRowsTopTwo = (array) => {
    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < BOARDWIDTH; i++) {
            const candy = CANDIES[Math.floor(Math.random() * CANDIES.length)];
            array[j][i] = candy;
        }
    }   
    return array;     
}

const fillRowsThreeAndBelow = (array) => {
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
            // array[j][i] = candy;
        }
    }        
}

const main = () => {
    

    // create a row wo 3 in a row
    // create another row wo 3 in a row
    // create another row wo 3 in a row & wo 3 in a col
    // repeat
    // NOTE create in array first before using jquery and html

    // create randomized board
//    for (let j=0; j<BOARDHEIGHT; j++) {
//         const $row = $("<div>").addClass(`row${j}`);
//         $row.addClass("row");
//         let itemRow = [];
//         for (let i=0; i<BOARDWIDTH; i++) {
            
//             // prevent 3 in a row
//             let randInt = Math.ceil(Math.random()*CANDIES);    
//             if (i>=2) {
//                 while (randInt===itemRow[i-1] && itemRow[i-2]===itemRow[i-1]) {                
//                     randInt = Math.ceil(Math.random()*CANDIES);   
//                     }
//                 }
            
        
//             const $item = $("<div>").addClass(`item${randInt}`);
//             $item.addClass(`col${i}`);
//             $row.append($item);
//             itemRow.push(randInt);
            
//         }
//         $container.append($row);
//         itemMap.push(itemRow);
//     }
//     // check 3 in a column
//     for (let j=2; j<BOARDHEIGHT; j++) {
//         for (let i=0; i<BOARDWIDTH; i++) {
//             if (itemMap[j][i]===itemMap[j-1][i] && itemMap[j-2][i]===itemMap[j-1][i]) {
//                 console.log("3 in a col")
                
//             }
//         }
        
//     }

    let newGameArray = createEmptyArray();
    fillRowsTopTwo(newGameArray);
    fillRowsThreeAndBelow(newGameArray);
    console.log(newGameArray);
    // create a score checker to remove scoring items

    
    
   }


$(main);