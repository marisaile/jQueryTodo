
import $ from 'jquery';

var app = {
  init: function(){
    app.render();
  },
  render: function(){
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    var ballRadius = 10;
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var dx = 2.5;
    var dy = -2.5;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width - paddleWidth) / 2;
    var rightPressed = false;
    var leftPressed = false;
    var score = 0;
    var lives = 3;
    var gameOn = false;

    var drawBall = function(){
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#16CCAE';
      ctx.fill();
      ctx.closePath();
    };
    var drawPaddle = function(){
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = '#16CCAE';
      ctx.fill();
      ctx.closePath();
    };

    // bricks 
    var brickRowCount = 3;
    var brickColumnCount = 5;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var c;
    var r;
    var bricks = [];

    for (c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    var drawBricks = function(){
      for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
            var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = '#DC0073';
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };

    var collisionDetection = function(){
      for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
          var b = bricks[c][r];
          if (b.status === 1) {
            if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
              dy = -dy;
              b.status = 0;
              score++;
              if (score === brickRowCount * brickColumnCount) {
                document.getElementById('win-message').className = 'you-won';
                debugger;
                document.location.reload();
              }
            }
          }
        }
      }
    };   
    var drawScore = function(){
      ctx.font = '16px Helvetica';
      ctx.fillStyle = '#16CCAE';
      ctx.fillText('Score: ' + score, 8, 20);
    }; 
    var drawLives = function(){
      ctx.font = '16px Helvetica';
      ctx.fillStyle = '#16CCAE';
      ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
    };
    var startGame = function(){
      if (gameOn === false) {
        gameOn = true;
        draw();
      }
    };
    var draw = function(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();
      drawScore();
      drawLives();
      // ball logic
      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
        } else {
          lives--;
          if (!lives) {
            alert('Game Over!');
            document.location.reload();
          } else {
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = 2.5;
            dy = -2.5;
            paddleX = (canvas.width - paddleWidth) / 2;
          }
        }
      }
      // paddle logic
      if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
      } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
      }
      x += dx;
      y += dy;
      requestAnimationFrame(draw);
    };
    // event handlers
    var keyDownHandler = function(e){
      if (e.keyCode === 39) {
        rightPressed = true;
      } else if (e.keyCode === 37) {
        leftPressed = true;
      }
    };
    var keyUpHandler = function(e) {
      if (e.keyCode === 39) {
        rightPressed = false;
      } else if (e.keyCode === 37) {
        leftPressed = false;
      }
    };
    var mouseMoveHandler = function(e){
      var relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    };
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    document.addEventListener('mousemove', mouseMoveHandler, false);
    document.getElementById('start-game').addEventListener('click', startGame, false);
  }
};

module.exports = app; 
