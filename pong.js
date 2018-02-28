var paddle1, paddle2, ball;
var player1score, player2score;
var bounds;
var boop_oscillator;
var point_sound;
var win_sound;
var point_sound;
var keyspressed;

var GAMESTATE = 'START_GAME';
//'GAME_OVER','POINT_OVER','IN_PLAY'


function setup() {
	createCanvas(400, 400);
	initializeGame();
}

function draw() {
	background(0);
	getUserInput(); //take keyboard input
	updateGameState(); //check events and update positions
	displayStuff(); // draw all the things
}

function initializeGame() {
	bounds = {
		x: 20,
		y: 80,
		h: height - 80,
		w: width - 20,
	}
	paddle1 = {
		x: bounds.x,
		y: bounds.y + bounds.h / 2,
		l: 50,
		w: 5
		//speed:
	}
	paddle2 = {
		x: bounds.w,
		y: bounds.y + bounds.h / 2,
		l: 50,
		w: 5
		//speed:	
	}
	ball = {
		x: width / 2,
		y: height / 2,
		xspeed: 2,
		yspeed: random(1, 3),
		d: 10
	}
	keyspressed = {
		a: false,
		z: false,
		k: false,
		m: false,
		space: false
	}
	player1score = 0
	player2score = 0
}

function getUserInput() { //take keyboard input
	if (keyIsDown(65)) {
		keyspressed.a = true;
	} else {
		keyspressed.a = false;
	}
	if (keyIsDown(90)) {
		keyspressed.z = true;
	} else {
		keyspressed.z = false;
	}
	if (keyIsDown(75)) {
		keyspressed.k = true;
	} else {
		keyspressed.k = false;
	}
	if (keyIsDown(77)) {
		keyspressed.m = true;
	} else {
		keyspressed.m = false;
	}
	if (keyIsDown(32)) {
		keyspressed.space = true;
	} else {
		keyspressed.space = false;
	}
}

function updateGameState() { //check events and update positions
	//'START_GAME'
	if (GAMESTATE == 'START_GAME') {
		if (keyspressed.space) {
			initializeGame();
			GAMESTATE = 'IN_PLAY'
		}
	} else if (GAMESTATE == 'GAME_OVER') {
		textSize(50);
		textAlign(CENTER) 
		text("GAME OVER", width / 2, height / 2);
		textSize(18);
		text("press SPACE to continue...", width / 2, height / 2 + 60);
		if (keyspressed.space) {
			GAMESTATE = 'START_GAME'
		}
	} else if (GAMESTATE == 'POINT_OVER') {
		textSize(32);
		textAlign(CENTER);
		text("SCORE !!!", width / 2, 40);
		textSize(18);
		text("press SPACE to continue...", width / 2, height - 20);
		ball.x = width / 2
		ball.y = height / 2
		if (player1score >= 10 || player2score >= 10) {
			GAMESTATE = 'GAME_OVER'
		} else if (keyspressed.space) {
			GAMESTATE = 'IN_PLAY'
		}
	} else { //'IN_PLAY'

		//update ball position
		ball.x = ball.x + ball.xspeed
		ball.y = ball.y + ball.yspeed

		//check ball hit paddle
		if ((ball.x == bounds.w - ball.d / 2 - paddle2.w &&
				ball.y > paddle2.y && ball.y < paddle2.y + paddle2.l) ||
			(ball.x == bounds.x + ball.d / 2 + paddle2.w &&
				ball.y > paddle1.y && ball.y < paddle1.y + paddle1.l)) {
			ball.xspeed = -ball.xspeed
		}
		if (ball.x < bounds.x - 10) {
			player2score += 1
			GAMESTATE = 'POINT_OVER'
		}
		if (ball.x > bounds.w + 10) {
			player1score += 1
			GAMESTATE = 'POINT_OVER'
		}

		//check ball hit top and bottom
		if (ball.y <= bounds.y || ball.y >= bounds.h) {
			ball.yspeed = -ball.yspeed
		}

		//update paddle position
		if (keyspressed.a) {
			paddle1.y -= 4
		}
		if (keyspressed.z) {
			paddle1.y += 4
		}
		if (keyspressed.k) {
			paddle2.y -= 4
		}
		if (keyspressed.m) {
			paddle2.y += 4
		}
	}
}

function displayStuff() { // draw all the things
	fill(255)
	//draw paddle 1
	rect(paddle1.x, paddle1.y, paddle1.w, paddle1.l)
	//draw paddle 2
	rect(paddle2.x, paddle2.y, paddle2.w, paddle2.l)
	//draw ball
	ellipse(ball.x, ball.y, ball.d)
	textSize(32);
	textAlign(CENTER);
	text(player1score, 50, 40);
	text(player2score, width - 50, 40);
}
