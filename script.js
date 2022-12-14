var canvas, ctx, WIDTH, HEIGHT, FPS, tileSizeX, tileSizeY, playing, scoreboard, score = 0;
var snake, playLabel, apple, tileSizeApple, movements = 0;
var globalTouch = [], offset = [];

var keys = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
};

window.addEventListener("touchstart", touchStart);
window.addEventListener("touchmove", touchMove);
window.addEventListener("touchend", touchEnd);

window.addEventListener("keydown", keyDown);

window.addEventListener("resize", resizeWindow);

function touchEnd(e){
    if(Math.abs(offset[0]) > Math.abs(offset[1])){
        if(offset[0] < 0 && snake.dirLabel != "right"){
            snake.direction = [-1, 0];
            snake.dirLabel = "left";
            movements++;
        }
        if(offset[0] > 0 && snake.dirLabel != "left"){
            snake.direction = [1, 0];
            snake.dirLabel = "right";
            movements++;
        }
    }else{
        if(offset[1] < 0 && snake.dirLabel != "down"){
            snake.direction = [0, -1];
            snake.dirLabel = "up";
            movements++;
        }
        if(offset[1] > 0 && snake.dirLabel != "up"){
            snake.direction = [0, 1];
            snake.dirLabel = "down";
            movements++;
        }
    }
}

function touchMove(e){
    var touch = e.touches[0];

    offset = [touch.pageX - globalTouch[0], touch.pageY - globalTouch[1]];
}

function touchStart(e){
    e.preventDefault();

    var touch = e.touches[0];
    globalTouch = [touch.pageX, touch.pageY];

    if(!playing)
        playing = true;
}

function keyDown(e){
    if(!playing && (e.keyCode == keys.up || e.keyCode == keys.left || e.keyCode == keys.right || e.keyCode == keys.down))
        playing = true;

    switch(e.keyCode){
        case keys.left:
            if(snake.dirLabel != "right"){
                snake.direction = [-1, 0];
                snake.dirLabel = "left";
                movements++;
            }
            break;

        case keys.up:
            if(snake.dirLabel != "down"){
                snake.direction = [0, -1];
                snake.dirLabel = "up";
                movements++;
            }
            break;

        case keys.right:
            if(snake.dirLabel != "left"){
                snake.direction = [1, 0];
                snake.dirLabel = "right";
                movements++;
            }
            break;

        case keys.down:
            if(snake.dirLabel != "up"){
                snake.direction = [0, 1];
                snake.dirLabel = "down";
                movements++;
            }
            break;
    }
}

function resizeWindow(){
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    var tileDiv = 60;
    var tileSizeFather;
                
    tileSizeFather = Math.max(Math.floor(WIDTH / tileDiv), Math.floor(HEIGHT / tileDiv));
                
    if(tileSizeFather == Math.floor(WIDTH/tileDiv)){
        tileSizeX = WIDTH/tileDiv;
        tileSizeY = HEIGHT/(Math.floor(HEIGHT/tileSizeX));
        tileSizeApple = tileSizeY;
    }else{
        tileSizeY = HEIGHT/tileDiv;
        tileSizeX = WIDTH/(Math.floor(WIDTH/tileSizeY));
        tileSizeApple = tileSizeX;
    }
}

function isMobileDevice(){
    return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

function init(){
    canvas = document.createElement("canvas");
    resizeWindow();
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    FPS = 15;
    newGame();
    run();
}

function newGame(){
    snake = new Snake();
    playLabel = new PlayLabel();
    apple = new Apple();
    scoreboard = new ScoreBoard();

    playing = false;
}

function PlayLabel(){
    this.text;
    this.color = "#5b8357";
    this.messages = {
        phone: "Arraste a tela para jogar.",
        pc: "Pressione as setas para jogar."
    };

    if(isMobileDevice()){
        this.text = this.messages["phone"];
    }else{
        this.text = this.messages["pc"];
    }

    this.draw = function(){
        ctx.fillStyle = this.color;
        ctx.font = tileSizeX * 2 + "px Arial";
        ctx.fillText(this.text, WIDTH/2 - ctx.measureText(this.text).width/2, HEIGHT/2);
    }
}

function ScoreBoard(){
    this.color = "#5d8357";
    this.draw = function(){
        this.text = score;
        ctx.fillStyle = this.color;
        ctx.font = tileSizeX * 2 + "px Arial";
        ctx.fillText(this.text, WIDTH/2 - ctx.measureText(this.text).width/2, HEIGHT*0.1);
    }

}

function Snake(){
    this.body = [[10,10], [10,11]];
    this.color = "#000";
    this.direction = [0, -1];
    this.dirLabel = "";

    this.update = function(){
        var nextPos = [this.body[0][0] + this.direction[0], this.body[0][1] + this.direction[1]];

        if(!playing){
            if(this.direction[1] == -1 && nextPos[1] <= (HEIGHT * 0.1 / tileSizeY)){
                this.direction = [1, 0];
                this.dirLabel = "right";
            }
            else if (this.direction[0] == 1 && nextPos[0] >= (WIDTH * 0.9 / tileSizeX)){
                this.direction = [0, 1];
                this.dirLabel = "down";
            }
            else if (this.direction[1] == 1 && nextPos[1] >= (HEIGHT * 0.9 / tileSizeY)){
                this.direction = [-1, 0];
                this.dirLabel = "left";
            }
            else if (this.direction[0] == -1 && nextPos[0] <= (WIDTH * 0.1 / tileSizeX)){
                this.direction = [0, -1];
                this.dirLabel = "up";
            }
        }

        if(nextPos[0]<0){
            nextPos = [WIDTH/tileSizeX-1, this.body[0][1] + this.direction[1]];
        }
        if(nextPos[0]>WIDTH/tileSizeX-1){
            nextPos = [0, this.body[0][1] + this.direction[1]];
        }
        if(nextPos[1]<0){
            nextPos = [this.body[0][0] + this.direction[0], HEIGHT/tileSizeY-1];
        }
        if(nextPos[1]>HEIGHT/tileSizeY-1){
            nextPos = [this.body[0][0] + this.direction[0], 0];
        }

        this.body.splice(0, 0, nextPos);
    }

    this.draw = function(){
        ctx.fillStyle = this.color;

        for(var i = 0; i < this.body.length; i++){
            ctx.fillRect(this.body[i][0]*tileSizeX+tileSizeX*0.05, this.body[i][1]*tileSizeY+tileSizeY*0.05, tileSizeX-tileSizeX*0.1, tileSizeY-tileSizeY*0.1);
        }
    }

}

function Apple(){
    this.body = [];
    this.reloca = function(){
        this.body = [Math.floor(Math.random()*WIDTH/tileSizeX)*tileSizeX,Math.floor(Math.random()*HEIGHT/tileSizeY)*tileSizeY];
    }

    this.color = "red";

    this.draw = function (){
        
        if(snake.body[0][0]==Math.round(this.body[0]/tileSizeX) && snake.body[0][1]==Math.round(this.body[1]/tileSizeY)){
            this.reloca();
            score++;
            scoreboard.draw();
        }else{
            snake.body.pop();
        }

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.body[0]+(tileSizeX/2), this.body[1]+(tileSizeY/2), (tileSizeApple/2)-tileSizeApple*0.05, 0, 2*Math.PI);
        ctx.fill();
    }

}

function update(){
    snake.update();
    
}

function run(){
    update();
    draw();
    setTimeout(run, 1000/FPS);
}

function draw(){
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    snake.draw();

    if(movements==1 && apple.body==""){
        apple.reloca();
    }

    apple.draw();

    if(movements>=1){
        scoreboard.draw();
    }

    if(!playing)
        playLabel.draw();
}
init();