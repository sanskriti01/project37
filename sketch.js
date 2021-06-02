var dog, happyDog, foodS, foodStock, dogImg, happyDogImg, database, fedTime, lastFeed, addFood, feed, foodObj, feedDog, addFood;
var lazyDog_img, hungryDog_img, running_img;
var bedroom_img, garden_img, washroom_img;
var gameState = "hungry";

function preload()
{
	dogImg = loadImage('images/dogImg.png');
  happyDogImg = loadImage('images/dogImg1.png');
  bedroom_img = loadImage("images/Bed Room.png");
  garden_img = loadImage("images/Garden.png");
  washroom_img = loadImage("images/Wash Room.png");
  lazyDog_img = loadImage("images/Lazy.png");
  hungryDog_img = loadImage("image/happy dog.png");
  running_img = loadImage("images/running.png")
}

function setup() {
	createCanvas(1000, 500);
  database = firebase.database();
  foodStock = database.ref('food');
  foodStock.on("value", readStock);
  foodStock.set(20);

  foodObj = new Food();

  dog = createSprite(width/2+250,height/2, 10,10);
  dog.addAnimation("hungry", hungryDog_img);
  dog.addAnimation("happy", happyDogImg);
  dog.addAnimation("sleeping", lazyDog_img);
  dog.addAnimation("running", running_img);
  dog.scale = 0.2;

  getgameState();

  feed = createButton("Feed The Dog");
  feed.position(900,70);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(1000,70);
  addFood.mousePressed(addFood);

  readstate = database.ref('gamestate');
  readState.on("value", function(data){
    gameState = data.val();
  });

  
}


function draw() { 
  background(46,139,87);
  currentTime = hour();
  if(currentTime==(lastFeed+1)){
    update("playing");
    foodObj.garden();
  }else if(currentTime==(lastFeed+2)){
    update("sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFeed+2)){
    update("bathing");
    foodObj.washroom();
  }else{
    update("hungry");
    foodObj.display();
  }

  if(gameState!="hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(lazyDog_img);

  }
  
  

  foodObj.display();

  fedTime = database.ref('Feed Dog');
  fedTime.on("value", function (Data){
    lastFeed = data.val();
  })
  fill (255,255,254);
  textSize(15);
  if(lastFeed>=12){
    text("Last Feed: "+lastFeed%12 + " PM",350,30);
  }else if(lastFeed==0){
    text("Last Feed : 12 AM",350,30);
  }else{
    text("Last Feed : "+ lastFeed + " AM",350,30 );
  }


  if(foodS!= undefined){
    textSize(20);
    fill("white");
    text("Note: Press UP ARROW to feed DRAGO milk", 50,50);
    text("Food Remaining: "+foodS,150,150);
  

    if(keyWentDown(UP_ARROW)){
      writeStock(foodS);
      dog.addImage(happyDogImg);
    }
  
    if(keyWentUp(UP_ARROW)){
      dog.addImage(dogImg);
    }

    if(foodS === 0){
      foodS = 20; 
    }



  drawSprites();
  //add styles here
  textSize(32);
  fill("red");

  textSize(20);
  text("Last Fed:"+lastFeed+":00",300,95);

  text("Time since last Fed:"+(currentTime - lastFeed), 300,125 );

}
}
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);

}
function fedDog(){
  dog.addImage(happyDogImg);
  

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
  food: foodObj.getFoodStock(),
  fedTime: hour()
  })
}
function addFood(){
  foodS++;
  database.ref('/').update({
    food: foodS
  })
}

function writeStock(x){
  if(x<=0){
    x = 0;
  }
  else{
    x = x-1;
  }

  database.ref("/").update({
    food:x
  });
}





