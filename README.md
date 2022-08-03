## Building Candy Crush
This is my first project for General Assembly's Software Engineering Immersive Flex program.

### Technologies & Tools Used
- HTML
- CSS
- JavaScript
- JQuery
- Git & GitHub

### Description
Candy Crush Saga is a puzzle game that involves making matches of 3 or more colored candy pieces. 
Players swap candy pieces either horizontally and vertically, and once a match is made, the candy disappears, 
causing the surrounding pieces of candy to fall into the empty spaces. Released by King in 2012, it is played by millions around the world.

### Deployment
https://candycrushgame-alpha.vercel.app/

### How To Play
Players drag a candy to swap its position. A candy can only be swapped if it leads to a match of 3 or more.
The candy can only be swapped with those that are adjacent to it. At the top, bottom, left and right.
If the player runs out of candies to swap, the game is over.

I have added my own spin to the game by creating a Sugar Crush Mode if the player crushes 
30 candies in a row continuously. The game will then randomly crush 1 row of candies, which builds up momentum leading to a feedback loop of more candies getting crushed leading to more possible matches and in turn more crushes. This idea was taken from the style rank mechanic of Devil May Cry games.

Sugar Crush Mode is needed to complete the 2nd and 3rd stage of the game.

### Wireframe
<!-- ![wireframe](/wireframe.jpg) -->
<img src="./wireframe.jpg" alt="wireframe" width="300">

The main parts of the game are:
1. creating the board of candies
2. drag and drop function for candies
3. checking whether if a candy can be dragged then dropped at its new position
4. checking the board if there is a match of 3 or more candies, then highlight the matching candies
5. those candies are then removed
6. there has to be a visual cue that the candies are dropping to the floor
7. the empty spaces left behind are then refilled with new candies
8. the new candies may create matches, so the game loops back to point 4
9. if there are no matches, the game waits for the next player move
10. the game ends if there are no more possible matches to be made or the objective like a certain numerical score is met

### Game Architecture
The architecture used is MVC - Model View Controller.

#### Model
The model consists of the information for each stage like objectives, types of candies available, game mechanics and most importantly the board of the candies. The board is an array with each item representing 1 row of the board. All the player interactions and candy crushing are calculated with the array before being rendered.

#### View
Document Object Model using Javascript and JQuery is used for rendering.

#### Controller
Functions to check points 3 to 8 of the wireframe above and then update the model.

### Approach to Development
- Take incremental steps and apply the simplest possible solution every step of the way.
- If I change any code, comment it out and add the new code below it for reference.
- Many console logs to check whether the outputs of all the functions are working as intended.
- If making drastic changes to the code, I will create a new branch out from the master branch to avoid breaking down the entire game.

### Key Learnings
- Learning how to implement the drag and drop functions like dragstart, dragover, dragenter and drop. My understanding of these functions is still superficial.
- Thinking how to write the functions to manipulate the model by creating and crushing candies, then dropping them towards the ground.
- Viewing things from the player's perspective, like how to show the player that the candies remaining are sliding down and that it is not just a new board of randomly generated candies. This led to writing the functions with the player in mind.

### Breakdown & Analysis of the Codes
#### Creating the Model Array
An array called *itemBoard* represents the game. For example, the first candy in the top left corner of the board will be *itemBoard[0][0] = candy1*. The candy below it is *itemBoard[1][0] = candy2*. The third candy from the top is *itemBoard[2][0] = candy5*.

#### Rendering the View
For loops to iterate through *itemBoard* then create an image file based on the candy name. There are also conditionals to assign additional properties to the image, like draggable, droppable, whether its css should be changed to show that it is going to be crushed.
##### Creating the Visual Feel of Candies Falling
I use *setTimeout* on the controller functions, so the player will see the candies getting crushed and disappearing. Then the candies above are suspended in midair for a short while before falling to the ground.

#### Controllers to Manipulate the Model 
##### Implementing Drag and Drop

##### Checking for Matches
Iterate through the array using for loops to check every possible scoring combination. Two functions, *checkCol* and *checkRow* check the vertical and horizontal combinations respectively. If a matching combination is found, the location of the candies get stored in an array called *candiesToCrush*. If *itemBoard[1][0]* needs to be crushed, *candiesToCrush* gets pushed a string *"row1col0"*.
##### Crushing Candies
Use array callbacks and slicing on *candiesToCrush* to access *itemBoard* and crush candies by replacing them to from say *"candy1"* to *"empty"*. There is an image file of the background color called *empty.jpg* to create the appearance of the candy disappearing. Then call the *render* function.
##### Making the Candies Fall
Tranpose *itemBoard* so that the next step of unshifting will be easier because the candies will get "pushed" towards the ground and not to the right. Use the filter callback to remove all instances of *"empty"* from the model. Then unshift *"empty"* into *itemBoard* until it has the right number of rows and columns before transposing back.


### Future Developments / Improvements

### Summary

#### References

#### Game Asset Atrributions

