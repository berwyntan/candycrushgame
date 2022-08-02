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
causing the surrounding pieces of candy to fall into the empty spaces.
Released by King in 2012, it is played by millions around the world.

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
![wireframe](/wireframe.jpg)

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
I take incremental steps and apply the simplest possible solution every step of the way.
If I change any code, I would comment it out and add the new code below it for reference.
There will be frequent console logs to check whether the outputs of all the functions are working as intended.
If I am making drastic changes to the code, I will create a new branch out from the master branch to avoid breaking down the entire game.

### Key Learnings
- Learning how to implement the drag and drop functions like dragstart, dragover, dragenter and drop. My understanding of these functions is still superficial.
- Thinking how to write the functions to manipulate the model by creating and crushing candies, then dropping them towards the ground.
- Viewing things from the player's perspective, like how to show the player that the candies remaining are sliding down and that it is not just a new board of randomly generated candies. This led to writing the functions with the player in mind.

### Breakdown & Analysis of the Codes

### Future Developments / Improvements

### Summary

#### References

#### Game Asset Atrributions

