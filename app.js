const BOARDWIDTH = 6;
const BOARDHEIGHT = 6;
const CANDIES = 4;
const $container = $(".container");
let itemMap = [];

const main = () => {
    
    // create randomized board
   for (let j=0; j<BOARDHEIGHT; j++) {
        const $row = $("<div>").addClass(`row${j}`);
        $row.addClass("row");
        let itemRow = [];
        for (let i=0; i<BOARDWIDTH; i++) {
            
            // prevent 3 in a row
            let randInt = Math.ceil(Math.random()*CANDIES);    
            if (i>=2) {
                while (randInt===itemRow[i-1] && itemRow[i-2]===itemRow[i-1]) {                
                    randInt = Math.ceil(Math.random()*CANDIES);   
                    }
                }
            
        
            const $item = $("<div>").addClass(`item${randInt}`);
            $item.addClass(`col${i}`);
            $row.append($item);
            itemRow.push(randInt);
            
        }
        $container.append($row);
        itemMap.push(itemRow);
    }
    // check 3 in a column
    for (let j=2; j<BOARDHEIGHT; j++) {
        for (let i=0; i<BOARDWIDTH; i++) {
            if (itemMap[j][i]===itemMap[j-1][i] && itemMap[j-2][i]===itemMap[j-1][i]) {
                console.log("3 in a col")
                
            }
        }
        
    }

    console.log(itemMap);
    // create a score checker to remove scoring items

    
    
   }


$(main);