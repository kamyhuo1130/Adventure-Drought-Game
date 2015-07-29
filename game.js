enchant();
var maxWaterLevel = 20;
var time = 120;
var timeSinceLastAlert = 0;
var timeToNewAlert = 20;
var alertArray = ["Africa's economy has fallen!", "100 million people have died!", "Tornadoes destroy remaining water lines!", "China declares martial law!", "1 billion people have died!", "North America declares martial law!", "5 billion people have died!"];
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
  var alert = function(){
	  if(timeSinceLastAlert >= timeToNewAlert){
		  confirm(alertArray[i]);
		  i += 1;
		  timeSinceLastAlert = 0;
	  }
  };
  var waterLoss = function(){
	  if(player.waterSupply < 20){
		  player.waterSupply = player.waterSupply + 1;
	  }
	  else if (player.waterSupply >= 20){
		  player.frame = 28;
		  confirm("Sorry, " + player.name + ". " + "You died!");
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
  var player = new Sprite(game.spriteWidth, game.spriteHeight);
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
  var checkPuddle = function(){
	  if (puddleMap.checkTile(this.x, this.y) === 6){
		for(var k = 0; k< puddle.length; k++){
      collisionData.push([]);
      for(var l = 0; l< puddle[0].length; l++){
        collision = puddle[k][l] === 6 ? 6 : 0;
        collisionData[k][l] = collision;
      }
    }
	map.collisionData = collisionData;
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
	checkPuddle();
    player.on('enterframe', function() {
      player.move();
	  waterLevel.move();
	  alert();
    });
    game.rootScene.on('enterframe', function(e) {
      game.focusViewport();
    });
  };
  game.start();
};