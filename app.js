const BOARDWIDTH = 5;
const BOARDHEIGHT = 5;
const $container = $(".container");
let itemMap = [];

const main = () => {
    
   for (let j=0; j<BOARDHEIGHT; j++) {
        const $row = $("<div>").addClass(`row${j}`);
        $row.addClass("row");
        let itemRow = [];
        for (let i=0; i<BOARDWIDTH; i++) {
            // if i>=2, while assigned item ===
            // itemRow[i-1] && itemRow[i-2]==itemRow[i-1]
            // recalculate assigned item
         
            const randInt = Math.ceil(Math.random()*4);
            const $item = $("<div>").addClass(`item${randInt}`);
            $item.addClass(`col${i}`);
            $row.append($item);
            itemRow.push(randInt);
        }
        $container.append($row);
        itemMap.push(itemRow);
    }

    console.log(itemMap);
    // create a score checker to remove scoring items

    
    

};

$(main);