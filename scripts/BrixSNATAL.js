var BrixGame = function(width, height, rowsOfBricks, columnsOfBricks){
    var self = this;
    var currentLevel;
    var currentBoard;
    
    this.generateBoard = function(current){
        currentBoard = new Board(width, height, rowsOfBricks, columnsOfBricks);
    }
    
    this.playGame = function() {
        var intID = setInterval(currentBoard.update(),1000);
        while (!currentBoard.gameOver()){
        }
        clearInterval(intID);
        self.init(currentLevel + 1);
    }
    
    this.getBoard = function(){
        return currentBoard;
    }
    
    this.init = function(current){
        currentLevel = current;
        self.generateBoard(currentLevel);
    };
    
    
    
    
    self.init(1);
};

var Board = function(width, height, rowsOfBricks, columnsOfBricks) {
    var self = this;
    var bricksAlive = rowsOfBricks*columnsOfBricks;
    var score = 0;
    var leftWall = new Wall(new Position(-10,0), 10, 610);
    var rightWall = new Wall(new Position(width,0), 10, 610);
    var topWall = new Wall(new Position(0,0), width, 1);
    var startPaddleWidth = width/8;
    var paddle = new Paddle(new Position((width/2)-(50), 590),100,10);

    var ball = new Ball(new Position(width/2,550), width * 0.05);
    var rowsOfBricks = rowsOfBricks;
    var columnsOfBricks = columnsOfBricks;
    var isReadyForChange = 0;
    var playAgain = 1;
    
    

     var audio = new Audio('assets/crash.mp3');
    
    var bricks = []; // an array of arrays of bricks
    
    // returns the complete arry of bricks ont the board
    
    this.getNumRows = function() {
        return rowsOfBricks;
    }
    
    this.getScore = function(){
        return score;
    }
    
    this.getNumCols = function(){
        return columnsOfBricks;
    }
    
    this.resetScore = function(){
        score = 0;
    }
    
    this.getAllBricks = function() {
        return bricks;
    }
    
    this.getBricksAlive = function(){
        return bricksAlive;
    }
    
    this.getPaddle = function(){
        return paddle;
    }
    
    this.getBrick = function(x, y) {
        if (x >= 0 && x <= columnsOfBricks && y >= 0 && y <= rowsOfBricks) {
            var result = bricks[y][x];
            return result;
        }
        else {
        }
    }
    
    this.getBall = function() {
        return ball;
    }
    
    this.getLeftWall = function() {
        return leftWall;
    }
    
    this.getIsReadyForChange = function(){
        return isReadyForChange;
    }
    
    this.setIsReadyForChange = function(num){
        isReadyForChange = num;
    }
    
    this.getRightWall = function() {
        return rightWall;
    }
    
    this.getTopWall = function() {
        return topWall;
    }
    
    this.getPlayAgain = function(){
        return playAgain;
    }
    
    this.gameOver = function(){
        if (ball.getCurrentPos().getY() > paddle.getPos().getY()-paddle.getHeight()){
            if (confirm("GAME OVER--with a score of " + score.toString() + "! \nHit OK to play again")) {
                playAgain = 1;
            }
            else{
                playAgain = 0;
            }
            return true;
        }
        if (bricksAlive <= 0){
            if (confirm("Congratulations! YOU WIN!\n\nHit OK to play again")) {
                playAgain = 1;
            }
            else{
                playAgain = 0;
            }
            return true;
        }
        return false;
    }
    
    this.resetGame = function(){
     bricksAlive = rowsOfBricks*columnsOfBricks;
     score = 0;
     leftWall = new Wall(new Position(-10,0), 10, 610);
     rightWall = new Wall(new Position(width,0), 10, 610);
     topWall = new Wall(new Position(0,0), width, 1);
     startPaddleWidth = width/8;
     paddle = new Paddle(new Position((width/2)-(50), 590),100,10);

     ball = new Ball(new Position(width/2,550), width * 0.05);
     rowsOfBricks = rowsOfBricks;
     columnsOfBricks = columnsOfBricks;
        isReadyForChange = 0;
        bricks = [];
        self.init();
    }
    
    this.update = function() {
        ball.updatePosition();
        
        // wall collision check
        if (ball.hasCollidedWith(leftWall)){
            ball.updateVectorUponCollisionWith(leftWall);
            return;
        }
        if (ball.hasCollidedWith(rightWall)){
            ball.updateVectorUponCollisionWith(rightWall);
            return;

        }
        if (ball.hasCollidedWith(topWall)){
            ball.updateVectorUponCollisionWith(topWall);
            return;
        }
        
        // paddle collision check
        if (ball.hasCollidedWith(paddle)){
            ball.updateVectorUponCollisionWith(paddle);
            isReadyForChange = 1;
            return;
        }
        
        // brick collision check
        var r;
        var c;
        var currentBrick;
        for (r= 0; r < rowsOfBricks; r++) {
          
            for (c = 0; c < columnsOfBricks; c++) {
                currentBrick = bricks[r][c];
                if (!currentBrick.getIsDestroyed()){
                    if (ball.hasCollidedWith(currentBrick)){
                        audio.play();
                        currentBrick.destroy();
                        score += 10;
                        bricksAlive = bricksAlive - 1;
                        return;
                    }
                }
            }
        }
        
    };
    
    // creates the array of bricks
this.init = function() {
        var r;
        var c;
        for (r= 0; r < rowsOfBricks; r++) {
            var brickArray = [];
            bricks.push(brickArray);
            for (c = 0; c < columnsOfBricks; c++) {
                var brickWidth = width/columnsOfBricks;
                var brickHeight = height/rowsOfBricks;
                var brickX = c * brickWidth;
                var brickY = (r + 1) * brickHeight;
                var brickPosition = new Position(1.05*brickX, brickY);
                var newBrick = new Brick(brickPosition, 0.9*brickWidth, 0.9*brickHeight);
                bricks[r].push(newBrick);
            }
        }
    };
    
    self.init();
};

var Ball = function(startPos,startRadius){
    var self = this;
    var currentPos = startPos;
    var lastPos = startPos;
    var radius = startRadius;
    var deltaX = 1.5;
    var deltaY = 1.5;
    
    //Angle:
    //0 - Straight Right
    //90 - Straight Up
    //180 - Straight Left
    //270 - Straight Down
    
    // Getters and Setters
    this.getCurrentPos = function() {
        return currentPos;
    }
    
    this.getLastPos = function() {
        return lastPos;
    }
    
    this.getRadius = function() {
        return radius;
    };
    
    this.getSpeed = function() {
        return speed;
    };
    
    this.getAngle = function() {
        return angle;
    };
    
    this.setSpeed = function(newSpeed){
        speed = newSpeed;
    };
    
    this.setAngle = function(newAngle){
        angle = newAngle;
    };
    
    // updates the position of the ball based on ball's vector
    this.updatePosition = function() {
        self.lastPos = self.currentPos;
        
        var newX = currentPos.getX() + deltaX;
        var newY = currentPos.getY() + deltaY;
        currentPos.setX(newX);
        currentPos.setY(newY);
        
        if(deltaX < -1.5) {
            deltaX = -1.5;
        }
        
        else if(deltaX > 1.5) {
            deltaX = 3;
        }
        
        else if(deltaY < -1.5) {
            deltaY = -1.5;
        }
        
        else if(deltaY > 1.5) {
            deltaY = 1.5;
        }
    }
    
    // returns true if the ball has collided with the given body, otherwise false
    this.hasCollidedWith = function(body) {
        
        var centerPoint = new Position(self.getCurrentPos().getX() + radius/2, self.getCurrentPos().getY() + radius/2);
        var collision = body.collisionCheck(centerPoint, radius/2);
        
        if (collision == "top" || collision == "bottom") {
            if(body.getName() == "paddle") {
                var adjustment = (radius/2)/deltaY
                deltaY = -(deltaY * adjustment)
            }
            
            else {
                deltaY = -deltaY
            }
            
            return true;
        }
        
        
        else if(collision == "left" || collision == "right") {
            if(body.getName() == "paddle") {
                var adjustment = (radius/2)/deltaY
                deltaX = -(deltaX * adjustment)
            }
            
            else {
                deltaX = -deltaX
            }
            
            return true;
        }
        
        else {
            return false;
        }
        
    };
    
    // updates the vector of the ball after a collision - this function assumes that
    // the ball at its current position has collided with a body
    this.updateVectorUponCollisionWith = function(body) {
    }
    
    this.init = function(){
    };
    
    self.init();
};

var Position = function(x,y){
    var self = this;
    var x = x;
    var y = y;
    this.getX = function(){
        return x;
    };
    this.getY = function(){
        return y;
    };
    this.setX = function(newX){
        x = newX;
    };
    this.setY = function(newY){
        y = newY;
    };
};

var Paddle = function(startPos,startWidth,startHeight){
    var self = this;
    
    this.moveLeft = function(inc) {
        self.setX(self.getPos().getX() - inc);
    }
    this.moveRight = function(inc) {
        self.setX(self.getPos().getX() + inc);
    }
    
    this.init = function() {
        Body.call(this, startPos, startWidth, startHeight, "paddle");
    };
    
    self.init();
    
};

var Brick = function(startPos, startWidth, startHeight) {
    var self = this;
    var isDestroyed;
    
    this.getIsDestroyed = function() {
        return self.isDestroyed;
    };
    
    this.isWithinThisBrick = function(aPos) {
        if(aPos.getX() >= self.getPos().getX() && aPos.getX() <= self.getPos().getX() + self.getWidth()) {
            if(aPos.getY() >= self.getPos().getY() && aPos.getY() <= self.getPos().getY() + self.getHeight()) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    
    this.destroy = function() {
        self.isDestroyed = true;
    };
    
    this.init = function() {
        Body.call(this, startPos, startWidth, startHeight, "brick");
        self.isDestroyed = false;
    };
    
    this.init();
    
};

var Wall = function(pos, width, height) {
    
    var self = this;
    
    this.init = function() {
        Body.call(this, pos, width, height, "wall");
    }
    
    this.init();
};

// A Body is a rectangular structure in the game i.e. a brick, wall, or paddle
var Body = function(pos, width, height, name) {
    var self = this;
    
    this.init = function() {
        self.pos = pos;
        self.width = width;
        self.height = height;
        self.name = name;
    }
    
    this.getPos = function() {
        return self.pos
    }
    
    this.getX = function() {
        return self.getPos().getX();
    }
    
    this.getY = function() {
        return self.getPos().getY();
    }
    
    this.getWidth = function() {
        return self.width;
    }
    
    this.getHeight = function() {
        return self.height;
    }
    
    this.getName = function() {
        return self.name;
    }
    
    this.setPos = function(newPos) {
        self.pos = newPos;
    };
    
    this.setX = function(newX) {
        self.pos.setX(newX);
    }
    
    this.setY = function(newY) {
        self.pos.setY(newY);
    }
    
    this.setWidth = function(newWidth) {
        self.width = newWidth;
    }
    
    this.setHeight = function(newHeight) {
        self.height = newHeight;
    }
    
    this.isWithinMe = function(pos) {
        var myMinX = self.getPos().getX();
        var myMinY = self.getPos().getY();
        var myMaxX = myMinX + self.getWidth();
        var myMaxY = myMinY + self.getHeight();
        
        return ((pos.getX() >= myMinX) && (pos.getX() <= myMaxX) && (pos.getY() >= myMinY) && (pos.getY() <= myMaxY));
    }
    
    this.collisionCheck = function(pos, threshold) {
        
        var x;
        var y;
        var distance;
        
        // check top border
        for (x = self.getX() + 1; x < self.getX() + self.getWidth(); x++) {
            y = self.getY()
            distance = Math.sqrt(Math.pow((x - pos.getX()), 2) + Math.pow((y - pos.getY()), 2));
            if (distance < threshold) {
                return "top";
            }
        }
        
        // check bottom border
        for (x = self.getX() + 1; x < self.getX() + self.getWidth(); x++) {
            y = self.getY() + self.getHeight()
            distance = Math.sqrt(Math.pow((x - pos.getX()), 2) + Math.pow((y - pos.getY()), 2));
            if (distance < threshold) {
                return "bottom";
            }
        }
        
        // check left border
        for (y = self.getY(); y < self.getY() + self.getHeight() - 1; y++) {
            x = self.getX();
            distance = Math.sqrt(Math.pow((x - pos.getX()), 2) + Math.pow((y - pos.getY()), 2));
            if (distance < threshold) {
                return "left";
            }
        }
        
        // check right border
        for (y = self.getY(); y < self.getY() + self.getHeight() - 1; y++) {
            x = self.getX() + self.getWidth();
            distance = Math.sqrt(Math.pow((x - pos.getX()), 2) + Math.pow((y - pos.getY()), 2));
            if (distance < threshold) {
                return "right";
            }
        }
        
        return "no collision";
    }
    
    this.printAttributes = function() {
        var result = "X position: " + self.getPos().getX() + "; ";
        result += "Y position " + self.getPos().getY() + "; ";
        result += "Width: " + self.getWidth() + "; ";
        result += "Height: " + self.getHeight() + "; ";
        return result;
    }
    
    this.init();

}

var ball = new Ball(new Position(100, 100), 10);


