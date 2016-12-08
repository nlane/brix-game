var BrixUI = function() {
    var self=this;
    this.game=undefined;
    this.running=false;
    this.initialize=function()
    {
        alert("Press OK to Begin!");
        var boardWidth = $('#board').width();
        var boardHeight = $('#board').height();

        self.game=new BrixGame(boardWidth,boardHeight, 10, 7); //set according to CSS, pass in game board w and h
        

        $("#paddle").css("width", self.game.getBoard().getPaddle().getWidth() + 'px');
        $("#paddle").css("background-size", self.game.getBoard().getPaddle().getWidth() + 'px');
        $("#paddle").css("height", self.game.getBoard().getPaddle().getHeight() + 'px');
        $("#paddle").css("top", self.game.getBoard().getPaddle().getPos().getY() + 'px');

        $("#ball").css("width", self.game.getBoard().getBall().getRadius() + 'px');
        $("#ball").css("height", self.game.getBoard().getBall().getRadius() + 'px');
        $("#ball").css("background-size", self.game.getBoard().getBall().getRadius() + 'px');
        $("#ball").css("top", (boardHeight - self.game.getBoard().getBall().getCurrentPos().getY()).toString() + "px");
        $("#ball").css("left", self.game.getBoard().getBall().getCurrentPos().getX().toString() + "px");
        

        var board = new this.createBoard(10, 7);
     

     
      $('body').keypress(function(event){
            if (event.which==97) //a
            {
                if(self.game.getBoard().getPaddle().getPos().getX() > 15) {
                      self.game.getBoard().getPaddle().moveLeft((1/30)*boardWidth);
                  }
                  
            }
            else if (event.which==100) //d
            {
                if(self.game.getBoard().getPaddle().getPos().getX() < 510) {
                       self.game.getBoard().getPaddle().moveRight((1/30)*boardWidth);
                  }

            }
            //510 and 0 are walls
            $('#paddle').css("left",self.game.getBoard().getPaddle().getPos().getX()+'px');
        });
        this.moveBall();

    };
    this.refreshView=function(){
        $('#paddle').css("left",self.game.getBoard().getPaddle().getPos().getX()+'px');
        self.game.getBoard().update();
        $("p#score").text("Score : " + self.game.getBoard().getScore().toString());
        //loop through bricks, make sure destroyed ones disappear
        var brickArray = self.game.getBoard().getAllBricks();
        for(var i = 0; i < self.game.getBoard().getNumRows(); i++){
            for(var j = 0; j < self.game.getBoard().getNumCols(); j++){
                if(self.game.getBoard().getBrick(j,i).getIsDestroyed()){
                    $("#" + (j).toString() + "_" + i.toString()).css("background-image", "none");
                }
            }
        }
        $('#ball').css({"top": self.game.getBoard().getBall().getCurrentPos().getY().toString() + "px"});
        $('#ball').css({"left": self.game.getBoard().getBall().getCurrentPos().getX().toString() + "px"});
        if(self.game.getBoard().getIsReadyForChange()){
            var emoji = Math.random();
            self.game.getBoard().setIsReadyForChange(0);
            if(emoji < .2){
                 $('#ball').css({"background-image": "url('../assets/img/straight_emoji.png')"});
            }
            else if(emoji < .4){
                $('#ball').css({"background-image": "url('../assets/img/heart_emoji.png')"});
            }
            else if(emoji < .6){
                $('#ball').css({"background-image": "url('../assets/img/kiss_emoji.png')"});
            }
            else if(emoji < .8){
                $('#ball').css({"background-image": "url('../assets/img/shocked_ball.png')"});
            }
            else{
                $('#ball').css({"background-image": "url('../assets/img/happy_emoji.png')"});
            }
        }
    };
    this.createBoard=function(width, height)
    {
            for(var i = 0; i < height; i++){
                for(var j = 0; j < width; j++){
                    var currentBrick = self.game.getBoard().getBrick(i, j);
                        //set position, width, and height based on model
                        $("<div id=" + i.toString() + "_" + j.toString() + "></div>").appendTo("#board");
                        $("#" + (i).toString() + "_" + j.toString()).css({"width":currentBrick.getWidth().toString() + "px"});
                        $("#" + (i).toString() + "_" + j.toString()).css({"height": currentBrick.getHeight().toString() + "px"});
                        $("#" + (i).toString() + "_" + j.toString()).css({"top": currentBrick.getPos().getY().toString() + "px"});
                        $("#" + (i).toString() + "_" + j.toString()).css({"left": currentBrick.getPos().getX().toString() + "px"});
                        $("#" + (i).toString() + "_" + j.toString()).css({"background-size":currentBrick.getWidth().toString() + "px"});
                    //setting color
                    if(j == 0){
                        $("#" + (i).toString() + "_" + j.toString()).css({"clear":"both"});
                    }
                    if(j==1 || j==6){
                       $("#" + (i).toString() + "_" + j.toString()).css("background-image", "url(../assets/img/green_brick.png)");
                    }
                    else if(j==2 || j==7){
                        $("#" + (i).toString() + "_" + j.toString()).css("background-image", "url(../assets/img/red_brick.png)");
                    }
                    else if(j==3 || j==8){
                        $("#" + (i).toString() + "_" + j.toString()).css("background-image", "url(../assets/img/purple_brick.png)");
                    }
                    else if (j==4 || j==9){
                        $("#" + (i).toString() + "_" + j.toString()).css("background-image", "url(../assets/img/yellow_brick.png)");
                    }
                    else{
                        $("#" + (i).toString() + "_" + j.toString()).css("background-image", "url(../assets/img/blue_brick.png)");
                    }
                }
            }
    }
    this.deleteBoard=function(width, height)
    {
            for(var i = 0; i < height; i++){
                for(var j = 0; j < width; j++){
                    var currentBrick = self.game.getBoard().getBrick(i, j);
                        //set position, width, and height based on model
                        $("#" + (i).toString() + "_" + j.toString()).remove();
                }
            }
    }
    var x = 0;
    this.moveBall = function(){
        if (self.game.getBoard().getPlayAgain()){
            if(!self.game.getBoard().gameOver()){
                self.refreshView();
                setTimeout(function(){self.moveBall();}, 7);
            }
            else{
                self.game.getBoard().resetGame();
                if (self.game.getBoard().getPlayAgain()){
                    self.deleteBoard(10, 7);
                    self.createBoard(10,7);
                }
                setTimeout(function(){self.moveBall();}, 7);
            }
        }
    }

    
    this.initialize();
}
