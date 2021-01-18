var PLAY = 1;
var END = 0;
var gameState = PLAY;

var jerry, jerry_running, jerry_collided,init=1;

var invisibleGround,icemonsterGroup,bricksGroup,fireGroup;
var snowgroundGroup,diamondGroup;
var icemonster,fire,bricks,bg;

var  bricksImage,icemonsterImage,fireImage,bgI;

 var snowground01,snowground02,snowground03,snowground04,snowground05;

var gameOver,gameOverImage,restart,restartImage;

var jumpSound , checkPointSound,scoreSound, dieSound,fireSound,explodeSound;

var diamond,diamond1,diamond2;

var d1,d2,d3,d1G,d2G,d3G;

var score=0,z=0;
function preload(){
  bgI=loadImage("forest.jpg");
  jerry_running = loadAnimation("21.png","22.png","23.png","24.png","23.png","22.png");
  jerry_collided = loadAnimation("25.png");
 fireImage=loadAnimation("f1.png","f2.png","f3.png","f4.png","f5.png")
  
  bricksImage = loadImage("1.png");
  icemonsterImage=loadImage("monsterice.png");
  snowground1 = loadImage("0.png");
  snowground2 = loadImage("2.png");
 
  
   restartImage= loadImage("restart.png")
 gameOverImage = loadImage("gameOver1.png")

  d1=loadImage("diamond1.png");
  
  d2=loadImage("diamond2.png");
  
  d3=loadImage("diamond3.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("gameover.mp3");
 fireSound = loadSound("gunshot.mp3");
  scoreSound=loadSound("score.mp3");
  explodeSound=loadSound("explosion.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  bg=createSprite(width/2,height/2,10,10);
  bg.addImage(bgI);
  bg.scale=1.2;
 
  gameOver=createSprite(width/2,height/3);
  gameOver.addImage(gameOverImage);
  gameOver.scale=0.8;
  gameOver.visible=false;
  
  restart=createSprite(width/2,height/2);
  restart.addImage(restartImage);
  restart.scale=0.1;
  restart.visible=false;
  
  jerry = createSprite(300,height-20,20,50);
  jerry.addAnimation("running", jerry_running);
  jerry.addAnimation("collided" ,jerry_collided);
  var h=height/250;
  jerry.scale = h;
  jerry.setCollider("rectangle",0,0,30,jerry.height);

  
  invisibleGround = createSprite(width/2,height,width,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  snowgroundGroup = createGroup();
  icemonsterGroup = createGroup();
  bricksGroup = createGroup();
  diamondGroup=createGroup();
  fireGroup=createGroup();
  d1G=createGroup();
  d2G=createGroup();
  d3G=createGroup();
  
}


function draw() {
  jerry.velocityX=0;
  jerry.collide(snowgroundGroup);
  jerry.collide(bricksGroup);

  if(gameState === PLAY){
  if(init===1){
    initialize();
  }
  jerry.collide(snowground01);
  jerry.collide(snowground02);
  jerry.collide(snowground03);
  jerry.collide(snowground04);
  jerry.collide(snowground05);
  jerry.collide(snowground06);
    
  if(keyDown("space"))
    {
      fireSound.play();
      fire=createSprite(jerry.x+(width/15),jerry.y);
      fire.addAnimation("firing",fireImage);
      fire.scale=height/1800;
      fire.velocityX=5;
      fireGroup.add(fire);
    }

    //scoring
        for(var i=0;i<d1G.length;i++)
      {
        if(jerry.isTouching(d1G.get(i)))
           {
             scoreSound.play();
           d1G.get(i).destroy();
             score+=5;
           }
      }
      for(var j=0;j<d2G.length;j++)
      {
        if(jerry.isTouching(d2G.get(j)))
           {
             scoreSound.play();
           d2G.get(j).destroy();
             score+=10;
           }
      }
     for(var k=0;k<d3G.length;k++)
      {
        if(jerry.isTouching(d3G.get(k)))
           {
             scoreSound.play();
           d3G.get(k).destroy();
             score+=15;
           }
      }
     if(icemonsterGroup.isTouching(jerry)){
            dieSound.play();
           gameState=END;
           }
     
   
        if(fireGroup.isTouching(icemonsterGroup))
           {explodeSound.play();
           icemonsterGroup.destroyEach();
             score+=50;
           }
      
    

    //jump when the space key is pressed
    if(keyIsDown(UP_ARROW)&&jerry.y>=100)
    {
      jerry.velocityY = -10;
     jumpSound.play();
    }
    if(keyIsDown(DOWN_ARROW))
    {
        jerry.velocityY =10;
    }
   if(keyIsDown(RIGHT_ARROW)) 
    {
       jerry.x= jerry.x+5;
    }
    
    if(keyIsDown(LEFT_ARROW) )
    {
       jerry.x= jerry.x-5;
    }
    
    //add gravity
    jerry.velocityY = jerry.velocityY + 0.8
  
    //spawn the clouds
    spawnBricks();
    spawnsnowground();
    spawnicemonster();
     if(jerry.isTouching(invisibleGround))
     {
        gameState = END;
          dieSound.play();
    }
  }
   else if (gameState === END) {

     gameOver.visible=true;
     restart.visible=true;
      jerry.setVelocity(0,0);
      d1G.setVelocityXEach(0);
      d2G.setVelocityXEach(0);
      d3G.setVelocityXEach(0);
       icemonsterGroup.setVelocityXEach(0);
        diamondGroup.setVelocityXEach(0);
      jerry.changeAnimation("collided", jerry_collided);
     
     snowgroundGroup.setLifetimeEach(-1);
     bricksGroup.setLifetimeEach(-1);
     icemonsterGroup.setLifetimeEach(-1);
     snowgroundGroup.setVelocityXEach(0);
     bricksGroup.setVelocityXEach(0);
     diamondGroup.setLifetimeEach(-1);
     if(mousePressedOver(restart))
       {
          dieSound.stop();
         gameOver.visible=false;
         restart.visible=false;
        score=0;
         initialize();
         jerry.x=50;
         jerry.y=height-100;;
         jerry.changeAnimation("running",jerry_running);
        icemonsterGroup.destroyEach();
     snowgroundGroup.destroyEach();
     bricksGroup.destroyEach();
     d1G.destroyEach();
      d2G.destroyEach();
      d3G.destroyEach();
         gameState=PLAY;
       }
     
   }
  
  drawSprites();
  strokeWeight(3);
  stroke("red");
  fill("black");
  textFont("timesnewroman",30);
    text("Score: "+ score, width/1.2,height/5);
}

function spawnsnowground(){
 
  var pos=Math.round(random(1,10));

  
   if (frameCount % 38 === 0&& pos===4){

  snowground = createSprite(width,height-height/3,10,40);
   snowground.velocityX = -6;
       var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: snowground.addImage(snowground1);
              break;
      case 2: snowground.addImage(snowground2);
               snowground.scale=0.9;
              break;
   
      default: break;
    }
   
    //assign scale and lifetime to the obstacle   

    snowground.lifetime = 300;
   
   //add each GROUND to the group
    snowgroundGroup.add(snowground);
   }
  
 if (frameCount % 38 === 0&& pos!=4){
   
  snowground = createSprite(width,height-20,10,40);
   snowground.velocityX = -6;
   
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: snowground.addImage(snowground1);
              break;
      case 2: snowground.addImage(snowground2);
               snowground.scale=0.9;
              break;
   
      default: break;
    }
   
    //assign scale and lifetime to the obstacle   

    snowground.lifetime = 300;
   
   //add each GROUND to the group
    snowgroundGroup.add(snowground);
 }
}

function spawnBricks() {
  //write code here to spawn the clouds
  var rand=Math.round(random(90,100));
  if (frameCount % 90 === 0) {
     bricks = createSprite(width,100,40,10);
     bricks1 = createSprite(width,100,40,10);
    bricks2 = createSprite(width,100,40,10);
    bricks.y = Math.round(random(height/3.5,height/1.25));
    bricks1.y=bricks.y;
    bricks2.y=bricks.y;
    bricks.addImage(bricksImage);
    bricks1.addImage(bricksImage); 
    bricks2.addImage(bricksImage);   
    bricks1.x=bricks.x+bricks.width/2;
    bricks2.x=bricks1.x+bricks1.width/2; 
    bricks.scale = 0.5;
    bricks.velocityX = -3;
    bricks1.scale = 0.5;
    bricks1.velocityX = -3;
    bricks2.scale = 0.5;
    bricks2.velocityX = -3;   
     //assign lifetime to the variable
    bricks.lifetime = width/3;
    bricks1.lifetime=width/3;
    bricks2.lifetime=width/3;
    
    //adjust the depth
    bricks.depth = jerry.depth;
     bricks1.depth = jerry.depth;   
    jerry.depth = jerry.depth + 1;
    
    //adding bricks to the group
   bricksGroup.add(bricks);
   bricksGroup.add(bricks1);
   bricksGroup.add(bricks2);
  
       var ran = Math.round(random(1,3));
    switch(ran) {
      case 1: diamond01();
              break;
      case 2: diamond02();
              break;
      case 3: diamond03();
              break;   
      default: break;
    }   
  }
}

function diamond01()
{
 diamond=createSprite(bricks.x,bricks.y-90) ;
 diamond1=createSprite(bricks1.x,bricks.y-90) ;
 diamond2=createSprite(bricks2.x,bricks.y-90) ;
 diamond.addImage(d1);
 diamond1.addImage(d1);
 diamond2.addImage(d1);
 diamond.velocityX = -3;   
 diamond.scale=0.5;
 diamond.lifetime = width/3;
 diamond1.velocityX = -3;   
  diamond1.scale=0.5;
   diamond1.lifetime = width/3;
   diamond2.velocityX = -3;   
    diamond2.scale=0.5;
   diamond2.lifetime = width/3; 
 d1G.add(diamond);
    d1G.add(diamond1);
    d1G.add(diamond2); 
}

function diamond02()
{
 diamond=createSprite(bricks.x,bricks.y-90) ;
 diamond1=createSprite(bricks1.x,bricks.y-90) ;
 diamond2=createSprite(bricks2.x,bricks.y-90) ;
 diamond.addImage(d2);
 diamond1.addImage(d2);
 diamond2.addImage(d2);
 diamond.velocityX = -3;   
 diamond.scale=0.5;
 diamond.lifetime = width/3;
 diamond1.velocityX = -3;   
  diamond1.scale=0.5;
   diamond1.lifetime = width/3;
   diamond2.velocityX = -3;   
    diamond2.scale=0.5;
   diamond2.lifetime = width/3; 
 d2G.add(diamond);
    d2G.add(diamond1);
    d2G.add(diamond2); 
}
function diamond03()
{
 diamond=createSprite(bricks.x,bricks.y-90) ;
 diamond1=createSprite(bricks1.x,bricks.y-90) ;
 diamond2=createSprite(bricks2.x,bricks.y-90) ;
 diamond.addImage(d3);
 diamond1.addImage(d3);
 diamond2.addImage(d3);
 diamond.velocityX = -3;   
 diamond.scale=0.5;
 diamond.lifetime = width/3;
 diamond1.velocityX = -3;   
  diamond1.scale=0.5;
   diamond1.lifetime = width/3;
   diamond2.velocityX = -3;   
    diamond2.scale=0.5;
   diamond2.lifetime = width/3; 
 d3G.add(diamond);
    d3G.add(diamond1);
    d3G.add(diamond2); 
}

function spawnicemonster()
{
      if(frameCount%300===0)
      {
        var m;
        m=height/300;
        icemonster=createSprite(width,jerry.y-90);
        icemonster.addImage(icemonsterImage);
        icemonster.scale=m;
        icemonster.velocityX=-2;
         icemonsterGroup.add(icemonster);
      }
 
}
function initialize()
{

   snowground06 = createSprite(width/1.6,height-height/3,10,40);
   snowground06.velocityX = -6;
   snowground05= createSprite(width/1.1,height-height/3,10,40);
   snowground05.velocityX = -6;
   snowground06.addImage(snowground1);
   snowground05.addImage(snowground1);
   snowground05.scale=0.9;
   snowground06.scale=0.9;
   snowground05.lifetime = 300;
   snowground06.lifetime = 300;
    

  snowground01 = createSprite(50,height-20,10,40);
  snowground01.addImage(snowground1);
  snowground01.velocityX=-6;
  snowground02 = createSprite(270,height-20,10,40);
  snowground02.addImage(snowground2);
  snowground02.scale=0.9;
  snowground02.velocityX=-6;
  snowground03 = createSprite(490,height-20,10,40);
  snowground03.addImage(snowground1);
  snowground03.velocityX=-6; 
  snowground04 = createSprite(710,height-20,10,40);
  snowground04.addImage(snowground2);
  snowground04.scale=0.9;
  snowground04.velocityX=-6;

//snowgroundGroup.add(snowground01);
//snowgroundGroup.add(snowground02);
//snowgroundGroup.add(snowground03);
//snowgroundGroup.add(snowground04);
//snowgroundGroup.add(snowground05);
//snowgroundGroup.add(snowground06);
 init=0;
}