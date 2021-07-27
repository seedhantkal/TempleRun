//Declaring of Variables
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;
var life =3;
var boy, boy_running, boy_collided;
var  bgImage;
var monster, monsterGroup; 
var gem, coinGroup;
var score=0;
var life, lifeGroup
var gameOver, restart;
var gameOverSound, winSound, coinSound, lifeSound, monsterSound;


// Loading images and sounds 
function preload(){
  boy_running =   loadAnimation("boy_1.png","boy_2.png", "boy_4.png","boy_5.png","boy_6.png","boy_7.png","boy_8.png" );
  boy_collided = loadAnimation("boy_1.png");
  monsterImg = loadImage ("monster.png")
  gemImg = loadImage ("gem.png")
  lifeImg = loadImage("heart.png")
  gameOverImg = loadImage("gameOver.png");
  winImg = loadImage("win.png")
  restartImg = loadImage("restart.png");
  pathImage = loadImage("background.png")

  gameOverSound = loadSound('gameover.ogg');
  winSound = loadSound('win.wav');
  coinSound = loadSound('coin.wav');
  lifeSound = loadSound('life.wav');
  monsterSound = loadSound('monster.wav');
}

function setup() {
  createCanvas(windowWidth,windowHeight);
// Creating the background
path = createSprite(width/2,50,width+500,height);
path.scale=5
path.addImage(pathImage);

//Creating the player
runner = createSprite(width/4,height/2,30,30);
runner.addAnimation("boy_running",boy_running);
runner.addAnimation("collided",boy_collided);
runner.scale = 0.45;
runner.setCollider("rectangle",-250,-50,150,200)

// Creating groups
monsterGroup=new Group();
coinGroup = new Group();
lifeGroup = new Group();

// Creating gameover image 
gameover = createSprite(width/2,200);
gameover.addImage(gameOverImg);
gameover.scale = 1.5;
gameover.visible = false;

// Creating win image 
win = createSprite(width/2,200);
win.addImage(winImg);
win.scale = 1.5;
win.visible = false;

// Creating restart image 
restart = createSprite(width/2,400);
restart.addImage(restartImg);
restart.scale = 0.8;
restart.visible = false;
}

function draw() {
  background("white");
  edges = createEdgeSprites()
  runner.collide(edges[2]) 
  runner.collide(edges[3])
  if(gameState===PLAY){
    path.velocityX = -8;
  if(path.x < 0 ){
    path.x = width/2;
  }
  
// Moving runner using arrow keys
  if(touches.length > 0  || keyDown("up_arrow")){
    runner.y=runner.y-11; 
    }
  if(touches.length > 0 || keyDown("down_arrow")){
     runner.y=runner.y+11; 
      touches = []; 
    }
  if(touches.length > 0  || keyDown("left_arrow")){
      runner.x=runner.x-11; 
    }
  if(touches.length > 0 || keyDown("right_arrow")){
       runner.x=runner.x+11; 
        touches = []; 
    }
  
   spawncoin();
  
   spawnMonster();
  
   spawnlife();

   for(var i  = 0;i<lifeGroup.length;i++){
     if(lifeGroup.get(i).isTouching(runner)){ 
      lifeGroup.get(i).destroy()
      life = life +1
      lifeSound.play();
    } 
  }

  
  for(var i  = 0;i<coinGroup.length;i++){
    if(coinGroup.get(i).isTouching(runner)){ 
        coinGroup.get(i).destroy()
        score = score +1
        coinSound.play();
      } 
    }
  
 for(var i  = 0;i<monsterGroup.length;i++){
   if(monsterGroup.get(i).isTouching(runner)){ 
        monsterGroup.get(i).destroy()
        life = life -1
        console.log(life)
        monsterSound.play();
   if(life==0){
      gameState = END;
    }
   else if(score===25){
      gameState = WIN;
      winSound.play();
     }
    } 
}
    } 
    else if(gameState===END) { 
      path.velocityX = 0;
      runner.velocityX = 0;
      runner.changeAnimation("collided",boy_collided)
      gameover.visible = true;
      restart.visible = true;
      gameOverSound.play();
      runner.destroy();
      monsterGroup.destroyEach();  
      coinGroup.destroyEach(); 
      lifeGroup.destroyEach();
    } else if(gameState===WIN){
      win.visible = true;
      restart.visible = true;
      runner.destroy();
      monsterGroup.destroyEach();  
      coinGroup.destroyEach(); 
      lifeGroup.destroyEach();
      path.velocityY = 0;
      path.velocityX = 0;
       
      }  
    
      

  if(mousePressedOver(restart)) {
  reset();
  }
drawSprites();

stroke("orange");
strokeWeight(5);
textSize(30);
fill("blue");
text("COINS : "+score,windowWidth-400,70);
stroke("gold");
strokeWeight(5);
textSize(30);
fill("red");
text("LIFE : "+life,windowWidth-400,120);

textSize(18);
stroke("yellow");
strokeWeight(5);
fill("black");
text("CLICK THE UP, DOWN, LEFT, OR RIGHT ARROW KEYS TO MOVE THE RUNNER ",50,30);
text(" YOU CAN WIN THE GAME BY COLLECTING 25 COINS ",50,60);
text("COLLECT THE HEARTS TO GAIN MORE LIVES", 50,90)
textSize(50); 
}

// Making the coins appear at random heights 
function spawncoin(){
  if(frameCount%100===0){
    coin=createSprite(width-100,height/4,20,20); 
    coin.velocityX=-4;  
    coin.scale=0.1;
    coin.addImage(gemImg);
    coin.y=Math.round(random(100,height-100));
    coinGroup.add(coin);
    coin.debug=true;
 }  
}

// Making the hearts appear at random heights
function spawnlife(){
  if(frameCount%80===0){
    lifeadd=createSprite(width-100,height/4,20,20); 
    lifeadd.velocityX=-4;  
    lifeadd.scale=0.1;
    lifeadd.addImage(lifeImg);
    lifeadd.y=Math.round(random(100,height-100));
    lifeGroup.add(lifeadd);
 }  
}

// Making the monsters appear at random heights 
function spawnMonster(){
  if (World.frameCount%45===0){
    monster=createSprite(width-100,height/4,20,20);
    monster.addImage(monsterImg);
    monster.scale = 0.2;
    monster.y = Math.round(random(100,height-100));
    monster.velocityX = -(8 + 10* score/10);
    monster.lifetime=500;
    monsterGroup.add(monster);
  }
}

// Resetting the game 
function reset(){ 
  runner.visible = true;
  monsterGroup.visible = true;
  coinGroup.visible = true;
  score = 0;
  location.reload();
  }

