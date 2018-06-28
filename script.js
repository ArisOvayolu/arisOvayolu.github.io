class Paddle {
	constructor(config) {
		this.config = config;
		this.fullPaddle = []
	}
	create() {
		for (let length = 0; length < 5; length++) {
			this.player = createSprite(this.config.x+((length*30)*this.config.directionX), this.config.y+((length*30)*this.config.directionY));
			this.player.addImage(this.config.image)
			this.player.scale = 0.30;
			this.player.immovable = true;
			this.fullPaddle.push(this.player);
		}
	}
	move() {
		if(this.config.directionX == 1) {
			if (keyDown(this.config.up) && this.player.position.x < 700) {
				for (let loop = 0; loop < this.fullPaddle.length; loop++) {
					this.fullPaddle[loop].position.x += 10 * this.config.directionX
				}
			}
			if (keyDown(this.config.down) && this.player.position.x > 220) {
				for (let loop = 0; loop < this.fullPaddle.length; loop++) {
					this.fullPaddle[loop].position.x -= 10 * this.config.directionX
				}
			}
		}
		if(this.config.directionX != 1) {
			if (keyDown(this.config.up) && this.player.position.y > 220) {
				for (let loop = 0; loop < this.fullPaddle.length; loop++) {
					this.fullPaddle[loop].position.y -= 10 * this.config.directionY
				}
			}
			if (keyDown(this.config.down) && this.player.position.y < 700) {
				for (let loop = 0; loop < this.fullPaddle.length; loop++) {
					this.fullPaddle[loop].position.y += 10 * this.config.directionY
				}
			}
		}
	}
}

function preload() {
	ballImage = loadImage('./assets/ball.png');
	wallImage = loadImage('./assets/wall.png');
	teamOneImage = loadImage('./assets/teamOne.png');
	teamTwoImage = loadImage('./assets/teamTwo.png');
	crownImage = loadImage('./assets/crown.png');
	
	numberImage = [];
	for (let i = 0; i < 4; i++) {
    numImage = loadImage(`./assets/scores/${i}.png`)
    numberImage.push(numImage);
  }
}

paddles = [];
walls = [];
win = false;

function setup() {
	createCanvas(800,800);
	
	paddle = new Paddle({x: 50, y: height/2, image: teamOneImage, directionX: 0, directionY: 1, up: "w", down: "s"});
	paddle.create();
	paddles.push(paddle);
	
	paddle = new Paddle({x: width/2, y: 50, image: teamOneImage, directionX: 1, directionY: 0, up: "w", down: "s"});
	paddle.create();
	paddles.push(paddle);
	
	paddle = new Paddle({x: height-50, y: height/2, image: teamTwoImage, directionX: 0, directionY: 1, up: "w", down: "s"});
	paddle.create();
	paddles.push(paddle);
	
	paddle = new Paddle({x: width/2, y: width-50, image: teamTwoImage, directionX: 1, directionY: 0, up: "w", down: "s"});
	paddle.create();
	paddles.push(paddle);
	
	ball = createSprite(width/2, height/2, 50, 50);
	ball.addImage(ballImage);
	ball.scale = 0.5;
	ball.setSpeed(5, random(360));
	
	wall = createSprite(43,43);
	wall.addImage(wallImage);
	wall.immovable = true;
	wall.setCollider("rectangle",0,0,86,86)
	walls.push(wall);
	
	wall = createSprite(width-43,43);
	wall.addImage(wallImage);
	wall.immovable = true;
	wall.setCollider("rectangle",0,0,86,86)
	walls.push(wall);
	
	wall = createSprite(43,height-43);
	wall.addImage(wallImage);
	wall.immovable = true;
	wall.setCollider("rectangle",0,0,86,86)
	walls.push(wall);
	
	wall = createSprite(width-43,height-43);
	wall.addImage(wallImage);
	wall.immovable = true;
	wall.setCollider("rectangle",0,0,86,86)
	walls.push(wall);
	
	teamOneGoals = [createSprite(11,height/2,25,height), createSprite(width/2,11,width,25)]
	for (let i = 0; i < teamOneGoals.length; i++) {
		teamOneGoals[i].visible = false;
	}
	
	teamTwoGaols = [createSprite(width-11,height/2,25,height), createSprite(width/2,height-11,width,25)]
	for (let i = 0; i < teamTwoGaols.length; i++) {
		teamTwoGaols[i].visible = false;
	}
	
	playerScores = [createSprite(43,43), createSprite(width-43,43), {one: 0, two: 0}]
	for (let i = 0; i < 2; i++) {
		playerScores[i].addImage(numberImage[0])
	}
}

function draw() {
	background(0);
	if (!win) {
		for (let movement = 0; movement < paddles.length; movement++) {
			paddles[movement].move();

			for (let moves = 0; moves < paddles[movement].fullPaddle.length; moves++) {
				if (ball.bounce(paddles[movement].fullPaddle[moves])) {
					console.log('true')
				}
			}
			for (let wallCheck = 0; wallCheck < walls.length; wallCheck++) {
				ball.bounce(walls[wallCheck]);
			}
		}

		for (let goalCheck = 0; goalCheck < teamOneGoals.length; goalCheck++) {
			if(ball.overlap(teamOneGoals[goalCheck])) {
				playerScores[2].one += 1
				playerScores[1].addImage(numberImage[playerScores[2].one])
				ball.position.x = width/2
				ball.position.y = width/2
				ball.setSpeed(5, random(360));
			}
			if(ball.overlap(teamTwoGaols[goalCheck])) {
				playerScores[2].two += 1
				playerScores[0].addImage(numberImage[playerScores[2].two])
				ball.position.x = width/2
				ball.position.y = width/2
				ball.setSpeed(5, random(360));
			}
		}
		if (playerScores[2].one == 3 || playerScores[2].two == 3) {
			win = true;
		}
	}
	if (win) {
		for (let delet = 0; delet < paddles.length; delet++) {
			for (let deletPad = 0; deletPad < paddles[delet].fullPaddle.length; deletPad++) {
				paddles[delet].fullPaddle[deletPad].remove();
			}
			walls[delet].remove();
		}
		for (let goalCheck = 0; goalCheck < 2; goalCheck++) {
			playerScores[goalCheck].remove();
		}
		paddles = [];
		walls = [];
		ball.remove();
		if (playerScores[2].two == 3) {
			winners = createSprite(width/2, height/2);
			winners.addImage(teamOneImage);
		}
		if (playerScores[2].one == 3) {
			winners = createSprite(width/2, height/2);
			winners.addImage(teamTwoImage);
		}
		winners = createSprite(width/2, height/2-80);
		winners.addImage(crownImage);
	}
	
	drawSprites();
}