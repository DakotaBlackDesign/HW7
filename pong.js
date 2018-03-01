var paddle1, paddle2, ball;
var player1score, player2score;
var bounds;
var boop,env,env2,delay;
var point_sound;
var win_sound;
var point_sound;
var keyspressed;
var spin;
var factor;
var plusOrMinus;
var t = 4

var GAMESTATE = 'START_GAME';
//'GAME_OVER','POINT_OVER','IN_PLAY'


function setup() {
	createCanvas(400, 400);
	initializeGame();
	env = new p5.Env()
	env.setADSR(0.001, 0.1, 0.5, 0.02);
	env.setRange(0.5, 0);
	env2 = new p5.Env()
	env2.setADSR(0.2, 0.1, 0.5, 0.02);
	env2.setRange(100, 50);
	boop = new p5.Oscillator();
	boop.setType('sine');
	boop.freq(env2);
	boop.amp(env);
	boop.start();
	delay = new p5.Delay();
	delay.process(boop, 0.12, 0.2, 500);
} 

function draw() {
	background(0);
	getUserInput(); //take keyboard input
	updateGameState(); //check events and update positions
	displayStuff(); // draw all the things
}
function trigger(){
	env.play();
	env2.play();
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
		yspeed: 2,
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
	
	paddleUpdate();
	
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
		//check ball hit paddle
		//print("xspeed =", ball.xspeed,"  yspeed =", ball.yspeed)
		
	
		if ((ball.x > (bounds.w - 5) && ball.x < bounds.w) &&
				(ball.y >= paddle2.y-2) && (ball.y <= (paddle2.y + paddle2.l+2))){ 
			spin = abs(paddle2.y + paddle2.l/2 - ball.y)
			factor = map(spin,0,25,1.25,0.85)
			ball.xspeed = -(ball.xspeed*factor)
			trigger();
			print(spin)
	    }
	
		if ((ball.x < (bounds.x + 10) && ball.x > bounds.x+5) &&
				(ball.y >= paddle1.y-2) && (ball.y <= (paddle1.y + paddle1.l+2))){
			spin = abs(paddle1.y + paddle1.l/2 - ball.y)
			factor = map(spin,0,25,1.25,0.85)
			ball.xspeed = -(ball.xspeed*factor)
			trigger();
		}
		if (ball.x < bounds.x - 10) {
			player2score += 1
			ball.xspeed = random(2,2.3)
			plusOrMinus = Math.random() < 0.5 ? -1 : 1;
			ball.yspeed = random(2,2.3) * plusOrMinus
			GAMESTATE = 'POINT_OVER'
		}
		if (ball.x > bounds.w + 10) {
			player1score += 1
			ball.xspeed = -random(2,2.3) 
			plusOrMinus = Math.random() < 0.5 ? -1 : 1;
			ball.yspeed = random(2,2.3) * plusOrMinus
			GAMESTATE = 'POINT_OVER'
		}
		//update ball position
		ball.x = ball.x + ball.xspeed
		ball.y = ball.y + ball.yspeed

		//check ball hit top and bottom
		if (ball.y <= bounds.y || ball.y >= bounds.h) {
			ball.yspeed = -ball.yspeed
			trigger();
		}
		
	}
}

function paddleUpdate(){
//update paddle position
		if (keyspressed.a) { 
			paddle1.y -= t
			t += 0.1	
			print(t)
		}
		if (keyspressed.z) {
			paddle1.y += t
			t += 0.1
		}
		if (keyspressed.k) {
			paddle2.y -= t
			t += 0.1
		}
		if (keyspressed.m) {
			paddle2.y += t
			t += 0.1
		}
	
	paddleStop();
}

function paddleStop(){
	if (paddle1.y < bounds.y) {
			paddle1.y = bounds.y
		
		}
	if (paddle1.y > bounds.h - paddle1.l ) {
			paddle1.y = bounds.h - paddle1.l
		
		}
	if (paddle2.y < bounds.y) {
			paddle2.y = bounds.y
		
		}
	if (paddle2.y > bounds.h - paddle2.l ) {
			paddle2.y = bounds.h - paddle2.l
		
		}
}
	
function keyReleased() {
	t = 4
}
	
function displayStuff() { // draw all the things
	fill(255)
	//draw paddle 1
	rect(paddle1.x, paddle1.y, paddle1.w, paddle1.l)
	//draw paddle 2
	rect(paddle2.x, paddle2.y, paddle2.w, paddle2.l)
	//draw ball
	ellipse(ball.x, ball.y, ball.d)
	//draw score
	textSize(32);
	textAlign(CENTER);
	text(player1score, 50, 40);
	text(player2score, width - 50, 40);
}
