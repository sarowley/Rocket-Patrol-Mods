class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        //load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        //this.add.text(20,20, "Rocket Patrol Play");
        // place tile sprite
        this.starfield = this.add.tileSprite(0,0,640,480, 'starfield').setOrigin(0,0);
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        //addS rocket
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        //add spaceship
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);

        //doing the random direction spaceship start
        //let number01 = Math.floor(Math.random() * 2);
        let number01 = 0;
        let number02 = Math.floor(Math.random() * 2);
        let number03 = Math.floor(Math.random() * 2);
        console.log(number01);
        //console.log(number02);
        //console.log(number03);
        if (number01 == 0){
                this.ship01.moveSpeed = game.settings.spaceshipSpeed *-1;
        }
        

        //increasing the ships speed after 30 seconds
        this.speed_clock = this.time.delayedCall(30000, () => {
            this.ship03.moveSpeed = game.settings.spaceshipSpeed *1.5;
            this.ship02.moveSpeed = game.settings.spaceshipSpeed *1.5;
            this.ship01.moveSpeed = game.settings.spaceshipSpeed *1.5;
            }, null, this);

        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        //initialize score
        this.p1Score = 0;

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        //game over flag
        this.gameOver = false;

        //setting up high score
        this.highScore = 0;
        this.high_score_text = this.add.text(borderUISize + borderPadding + 150, borderUISize + borderPadding*2, this.highScore, scoreConfig);

        //setting up fire ui
        this.fire_text = this.add.text(borderUISize + borderPadding + 300, borderUISize + borderPadding*2, "FIRE", scoreConfig);
        this.fire_text.setVisible(false);


        //60 second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
        //this.clock = this.time.delayedCall(5000, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

    }

    update() {

        //check for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        //code for high score
        //recieved divine inspiration from "https://stackoverflow.com/questions/37408825/create-a-high-score-in-phaser#41656615"
        this.high_score_text.text = localStorage.getItem("highScore");{
            if (this.p1Score > localStorage.getItem("highScore")){
                localStorage.setItem("highScore", this.p1Score);
            }
       }

        this.starfield.tilePositionX -= 4;

        if (!this.gameOver) {
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }    

        //doing fire button ui thing

        if (this.p1Rocket.isFiring == true) {
            this.fire_text.setVisible(true);
        }

        if (this.p1Rocket.isFiring == false) {
            this.fire_text.setVisible(false);
        }
        

        //check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            //console.log('sploosh kaboom ship 03');
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            //console.log('sploosh kaboom ship 02');
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            //console.log('sploosh kaboom ship 01');
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket,ship) {
        //simple aabb checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y) {
                return true;
            } else {
                return false;
            }
    }

    shipExplode(ship) {
        //temporary hide ship
        ship.alpha = 0;
        //create explosion
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
}