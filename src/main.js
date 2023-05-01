/*
Name: Sean Rowley
Mod Title: Rocket Patrol Live and Let Fly
Approx Time: 8-ish hours
The mods I chose (for a total of 95 points):
- Track a high score that persists across scenes and display it in the UI (5)
- Implement the 'FIRE' UI text from the original game (5)
- Implement the speed increase that happens after 30 seconds in the original game (5)
- Create a new scrolling tile sprite for the background (5)
- Allow the player to control the Rocket after it's fired (5)
- Create 4 new explosion sound effects and randomize which one plays on impact (10)
- Display the time remaining (in seconds) on the screen (10)
- Create a new title screen (e.g., new artwork, typography, layout) (10)
- Implement parallax scrolling for the background (10)
- Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (15)
- Implement mouse control for player movement and mouse click to fire (15)
Citations: https://stackoverflow.com/questions/37408825/create-a-high-score-in-phaser#41656615
*/


let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play]
}

let game = new Phaser.Game(config);
//reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keyDOWN, keyUP, mouse_check;

//set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
