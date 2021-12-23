
var PLAY = 1;
var END = 0;

var gameState = PLAY;

var title, titleImg;

var mario, mario_running, mario_fall;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOver,restart
var jumpSound , checkPointSound, dieSound
var restartImg, gameOverImg;

function preload(){
 mario_running = loadAnimation("l0_mario_1.png","l0_mario_2.png","l0_mario_3.png");
 mario_fall = loadAnimation("mario fail.png");
  titleImg = loadImage("Mario title.png");
 groundImage = loadImage("Mario the background.jpg");
  
  cloudImage = loadImage("mario clouds.png");
  
 obstacle1 = loadImage("l0_obstacle_1.png");
 
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("smb_jump-small.wav")
  dieSound = loadSound("gameover.wav")
  checkPointSound = loadSound("score.wav")
}

function setup() {
  createCanvas(800, 500);

  var message = "This is a message";
 console.log(message)
  
 

  
  ground = createSprite(1500,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/20;
  ground.scale = 0.5;
  
 gameOver = createSprite(300,200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,300);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.1; 
  
  invisibleGround = createSprite(200,455,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  title = createSprite(250,80,10,10);
  title.addImage("title", titleImg);
  title.scale = 0.5;
  
  
  
  score = 0;
  mario = createSprite(50,450,20,50);
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_fall);
  

  mario.scale = 0.1;
  mario.setCollider("rectangle",0,0,mario.width,mario.height);
  //mario.debug = true;
}

function draw() {
  
  background(180);
  textSize(40);
  fill("black");
  
  
  if(gameState === PLAY){
    mario.collide(invisibleGround);
    gameOver.visible = false;
    restart.visible = false; 
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 150){
      ground.x = ground.width/4;
    }
    
    //jump when the space key is pressed
    if(keyDown("space") && mario.y >= 300) {
        mario.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity

      mario.velocityY = mario.velocityY + 0.8
  
  
    //spawn obstacles on the ground
    spawnObstacles();
    //spawn clouds
    spawnClouds();
    
    if(obstaclesGroup.isTouching(mario)){
        //trex.velocityY = -12;
      //  jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true; 

     //change the mario animation
      mario.changeAnimation("collided", mario_fall);
      mario.velocityY = 5;
    
      
     
      ground.velocityX = 0;
     
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    

     
   }
  
 
  //stop trex from falling down
  
  
  if(mousePressedOver(restart) && gameState == END){
      reset();
    } 

    drawSprites();
  
   //displaying score
   
  
  text("Score: "+ score, 500,50);
}

function reset(){

  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false; 
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  mario.changeAnimation("running", mario_running);
  mario.y = 450
  score = 0;
}


function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(800,400,10,40);
   obstacle.velocityX = -(6 + score/100);
   obstacle.addImage(obstacle1)
   
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 400;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 150 === 0) {
    var cloud = createSprite(800,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.01;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 400;
    
    //adjust the depth
    cloud.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
