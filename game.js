enchant();
var maxWaterLevel = 20;
var time = 100;
var timeSinceLastAlert = 0;
var timeToNewAlert = 20;
var alertArray = ["Africa's economy collapses!", "100k people dead!", "Water lines destroyed!", "China declares martial law!", "1 billion people have died!", "North America declares martial law!", "5 billion people have died!"];
var i = 0;
updateTime = function(){
	time = time - 1;
	timeSinceLastAlert = timeSinceLastAlert + 1;
};
window.setInterval(updateTime, 1000);
window.onload = function(){
  var game = new Game(300, 300);
  game.spriteSheetWidth = 750;
  game.spriteSheetHeight = 24;
  game.fps = 15;
  game.spriteWidth = 24;
  game.spriteHeight = 24;
  game.preload('sprites.png');
  var player = new Sprite(game.spriteWidth, game.spriteHeight);
  var map = new Map(game.spriteWidth, game.spriteHeight);
  var foregroundMap = new Map(game.spriteWidth, game.spriteHeight);
  var puddleMap = new Map(game.spriteWidth, game.spriteHeight);
  var setMaps = function(){
    map.image = game.assets['sprites.png'];
    map.loadData(mapData);
    foregroundMap.image = game.assets['sprites.png'];
    foregroundMap.loadData(foregroundData);
	puddleMap.loadData(puddle);
	puddleMap.image = game.assets['sprites.png'];
    var collisionData = [];

    for(var i = 0; i< foregroundData.length; i++){
      collisionData.push([]);
      for(var j = 0; j< foregroundData[0].length; j++){
        var collision = foregroundData[i][j] === 1 ? 1 : 0;
        collisionData[i][j] = collision;
      }
    }
	map.collisionData = collisionData;
	
  };
  var alertLabel = new Label("");
  var setAlertLabel = function(){
	  alertLabel.x = game.availWidth;
	  alertLabel.y = game.availHeight;
	  alertLabel.font = "8px arial";
	  alertLabel.textAlign = "right";
	  alertLabel.color = '#FFFFFF';
  };
  var alerting = function(){
	  alertLabel.x = game.availWidth;
	  alertLabel.y = game.availHeight;
	  alertLabel.textAlign = "right";
	  if(timeSinceLastAlert >= timeToNewAlert){
		  alertLabel.text = alertArray[i];
		  i += 1;
		  timeSinceLastAlert = 0;
	  }
	   if(timeSinceLastAlert === 1){
			  alertLabel.text = "";
		  }
  };
  var waterLoss = function(){
	  if(player.waterSupply < 20){
		  player.waterSupply = player.waterSupply + 1;
	  }
	  else if (player.waterSupply >= 20){
		  player.frame = 28;
		  confirm("Sorry, " + player.name + ". " + "You died!");
		  player.frame = 28;
		  clearInterval(waterLevelLoss);
		  game.stop();
	  }
  };
  var waterLevelLoss = window.setInterval(waterLoss,2000);
  var setStage = function(){
    var stage = new Group();
    stage.addChild(map);
    stage.addChild(player);
	stage.addChild(waterLevel);
    stage.addChild(foregroundMap);
	stage.addChild(puddleMap);
	stage.addChild(label);
	stage.addChild(timerLabel);
	stage.addChild(alertLabel);
    game.rootScene.addChild(stage);
  };
  confirm("Directions: The world is in a drought! Find your way out of the maze without running out of water. \nCollect water at the puddles before the timer runs out. The world depends on you. Good luck!");
  var name = prompt("What is your name?");
  var waterLevel = new Sprite(game.spriteWidth, game.spriteHeight);
  var setWaterLevel = function(){
	  waterLevel.spriteOffset = 7;
	  waterLevel.x = player.x + 1;
	  waterLevel.y = player.y - 20;
	  waterLevel.frame = waterLevel.spriteOffset + player.waterSupply;
	  waterLevel.scale(1.5,1.5);
	  waterLevel.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
	  waterLevel.image.draw(game.assets['sprites.png']);
  };
  waterLevel.move = function(){
	  waterLevel.x = player.x + 1;
	  waterLevel.y = player.y - 20;
	  waterLevel.frame = waterLevel.spriteOffset + player.waterSupply;
  };
  var timerLabel = new Label("Time: " + time);
  var setTimerLabel = function(){
	  timerLabel.x = game.availWidth/2;
	  timerLabel.y = game.availHeight/2;
	  timerLabel.font = "16px arial";
	  timerLabel.textAlign = "left";
	  timerLabel.color = '#FFFFFF';
  };
  timerLabel.move = function(){
	  timerLabel.x = game.availWidth/2;
	  timerLabel.y = game.availHeight/2;
	  this.text = "Time: " + time;
	  timerLabel.textAlign = "left";
	  if (time <= 0){
		  player.frame = 28;
		  confirm("Sorry, " + player.name + ". " + "You died!");
		  player.frame = 28;
		  game.stop();
	  }
  };
  var label = new Label(name);
  var setLabel = function(){
	  label.x = game.availWidth/2;
	  label.y = game.availHeight/2;
	  label.color = '#FFFFFF';
	  label.textAlign = "center";
	  label.font = "16px arial";
  };
  label.move = function(){
	  label.x = game.availWidth/2;
	  label.y = game.availHeight/2;
	 label.textAlign = "center";
  };
 
  var setPlayer = function(){
	player.name = name;
    player.spriteOffset = 2;
    player.startingX = 0;
    player.startingY = 20;
    player.x = player.startingX * game.spriteWidth;
    player.y = player.startingY * game.spriteHeight;
    player.direction = 0;
    player.walk = 0;
    player.frame = player.spriteOffset + player.direction; 
    player.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
    player.image.draw(game.assets['sprites.png']);
    player.name = name;
	player.waterSupply = maxWaterLevel/2;
  };
  player.move = function(){
    this.frame = this.spriteOffset + this.direction * 2 + this.walk;
    if (this.isMoving) {
      this.moveBy(this.xMovement, this.yMovement);
      if ((this.xMovement && this.x % 24 === 0) || (this.yMovement && this.y % 24 === 0)) {
        this.isMoving = false;
      } 
    } else {
      this.xMovement = 0;
      this.yMovement = 0;
      if (game.input.up) {
        this.direction = 0;
        this.yMovement = -4;
		this.walk = 1;
      } else if (game.input.right) {
        this.direction = 1;
        this.xMovement = 4;
		this.walk = 0;
      } else if (game.input.left) {
        this.direction = 1;
        this.xMovement = -4;
		this.walk = 1;
      } else if (game.input.down) {
        this.direction = 0;
        this.yMovement = 4;
		this.walk = 0;
      }
      if (this.xMovement || this.yMovement) {
        var x = this.x + (this.xMovement ? this.xMovement / Math.abs(this.xMovement) * 24 : 0);
        var y = this.y + (this.yMovement ? this.yMovement / Math.abs(this.yMovement) * 24 : 0);
      if (0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y)) {
          this.isMoving = true;
          this.move();
        
      }
     }
	}
  };
  var disappear = function(a, b) {
	  puddle[a][b] = 0;
  };
  var checkPuddle = function(){
	 var position = puddleMap.checkTile(player.x, player.y);
	 if (position === 6 && player.waterSupply > 0){
		 player.waterSupply = player.waterSupply - 1;

		disappear((player.x / 24 | 0), (player.y / 24 | 0));
		 
	}
	
  };  

  game.focusViewport = function(){
    var x = Math.min((game.width  - 24) / 2 - player.x, 0);
    var y = Math.min((game.height - 24) / 2 - player.y, 0);
    x = Math.max(game.width,  x + map.width)  - map.width;
    y = Math.max(game.height, y + map.height) - map.height;
    game.rootScene.firstChild.x = x;
    game.rootScene.firstChild.y = y;
  };
  game.timer = function(){
	var timer = 3;
	timer.setInterval(game.timer, 1000);
  }
  game.onload = function(){
    setMaps();
    setPlayer();
    setStage();
	setWaterLevel();
	setLabel();
	setTimerLabel();
	setAlertLabel();
    player.on('enterframe', function() {
      player.move();
	  checkPuddle();
	  waterLevel.move();
	  alerting();
	  label.move();
	  timerLabel.move();
    });
    game.rootScene.on('enterframe', function(e) {
      game.focusViewport();
    });
  };
  game.start();
};