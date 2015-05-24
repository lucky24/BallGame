enchant();
window.onload = function(){
    var game = new Game(400, 420);
    game.fps = 60;
    game.preload(
    	 "res/facesmile.png",
		 "res/pad.png",
		 "res/ufo.png",
		 "res/block.jpg",
		 "res/block2.jpg", 
		 "res/item.jpg",
		 "res/item2.jpg",
		 "res/item3.jpg"
		 //"res/bgm.mp3"
		 //"rse/Hit.mp3"
		);
		//this is sample
	/*************
	* Initialize *
	**************/
    game.rootScene.backgroundColor = "lightblue";
    game.score = 0;
    
    var count = 0;                    // block count
    var block = new Array();          // blocks
    var ball = new Array();           // balls
    var total = 0;                    // total point
    var level = 0;                    // game level
    var k = 1;                        // ball number
    var life = 3;					  // life
    var num_ball = 1;				  // num of balls
    var flag = false;
    
    // make Labels
    var scoreLabel = new Label("SCORE : 0");
    scoreLabel.font = "16px Tahoma";
    scoreLabel.color = "black";
    scoreLabel.x = game.width / 2;
    scoreLabel.y = 5;
    game.rootScene.addChild(scoreLabel);
    
    var itemLabel = new Label("Pad length : 0");
    itemLabel.font = "8px Tahoma";
    itemLabel.color = "black";
    itemLabel.x = 10;
    itemLabel.y = 5;
    game.rootScene.addChild(itemLabel);
    
    var lifeLabel = new Label("Life : "+ life);
    lifeLabel.font = "8px Tahoma";
    lifeLabel.color = "black";
    lifeLabel.x = 10;
    lifeLabel.y = game.height - 20 ;
    game.rootScene.addChild(lifeLabel);
    
    var levelLabel = new Label("Level : "+ level);
    levelLabel.font = "8px Tahoma";
    levelLabel.color = "black";
    levelLabel.x = 50;
    levelLabel.y = game.height - 20;
    game.rootScene.addChild(levelLabel);
    
    // game.onload
    game.onload = function(){
	ball[k] = new Ball();
	ball[k].x = 0;
	ball[k].y = 230;
	ball[k].dx = 1.5;
	ball[k].dy = 2.5;
	k++;
	
	// make instance
	var pad = new Pad();
	var ufo = new UFO();
	
	// call function to make blocks
	drawBlock();		
     	
    /***************
    * Main Program *
    ****************/
	game.rootScene.addEventListener(Event.ENTER_FRAME, function(){
	    moveBlock();   // move blocks
	    time();        // remaining usable time for items
	    for (var i=1; i<ball.length; i++) {
		hitCheck_paddle_ball(i);  // conflict with a paddle or an ufo 
		hitCheck_block_ball(i);   // conflict with blocks
	    }
		getPoint();
		
	    function moveBlock() {
		for (var i=block.length-1; i >= 0 && block[i].y < 230; i--){
		    block[i].y = block[i].y + 0.02;
		}
	    }
	    
	    function hitCheck_paddle_ball(j) {		
		if (ball[j].intersect(pad)){
          	    ball[j].dy = -ball[j].dy;
         	    ball[j].y = pad.y - ball[j].height - 1;
         	    var d = ball[j].x - (pad.x + pad.width/2);
         	    ball[j].dx = 2 * d / (pad.width / 2);
          	    game.score = game.score + 5;
          	    scoreLabel.text = "SCORE : "+game.score;
		    ball[j].speed = ball[j].speed + 0.025;
          	    if (ball[j].speed >= 3 + level*0.5){ ball[j].speed = 3 + level*0.5; } 
		}
		
		if ( ball[j].intersect(ufo) ) {
		    if (ball[j].dy > 0) {
			ball[j].dy = -ball[j].dy;	
			ball[j].y = ufo.y - ball[j].height - 1;
		    }
		    else if (ball[j].dy < 0) {
			ball[j].dy = -ball[j].dy;
			ball[j].y = ufo.y + ball[j].height + ufo.height;
		    }
		    
		    if (ufo.vx >= 3 + level) {ufo.vx = 3 + level; }
		    
          	    game.score = game.score + 5;
          	    scoreLabel.text = "SCORE : "+game.score;
		    ball[j].speed = ball[j].speed + 0.025;
          	    if (ball[j].speed >= 3 + level*0.5){ ball[j].speed = 3 + level*0.5; } 
          	}
	    }
	    
      	    function hitCheck_block_ball(j){
        	for(var i=0; i<count; i++){
          	    if (ball[j].intersect(block[i])){
            		ball[j].dy = -ball[j].dy;
            		block[i].life--;
            		if( block[i].item === 1 && flag === false ) {
            		    pad.width = 128;
            		    pad.time = 1200;
            		    flag = true;
            		}
            		
            		if( block[i].item === 2) {
			    ball[k] = new Ball();
			    ball[k].x = ball[j].x;
			    ball[k].y = ball[j].y;
			    ball[k].dx = -ball[j].dx;
			    ball[k].dy = -ball[j].dy;
			    k++;
			    num_ball++;		
            		}
            		
            		if (block[i].item === 3 && flag === false) {
            		    pad.width = 32;
            		    pad.time = 300;
            		    flag = true;
			}
            		if (block[i].life === 0) {
	            	    block[i].y = -9999;
    	        	    game.score = game.score + 5;
        	    	    total = total - 1;

        	    	}
            		if (total < 1){
            		    if(ball.speed >= 2.5) {
	        		ball.speed = 2.5;
	        	    }
        		    level++;
        		    levelLabel.text = "Level : "+level;
          		    drawBlock();
            		}
          	    }
        	}
        	scoreLabel.text = "SCORE : "+game.score;
      	    }
      	    
      	    function time() {
      		if(pad.time > 0) {
      		    pad.time -= 1;
      		    itemLabel.text = "Pad lenght : "+pad.time;
      		}
      		if(pad.time === 0) {
      		    pad.width = 64;
      		    flag = false;
      		    itemLabel.text = "Pad length : "+pad.time;
      		}
      	    }
      	    
      	    function getPoint() {
      		if (game.score % 3000 === 0 ) {
      		    life++;
      		    game.score += 5;
      		    lifeLabel.text = "Life : "+life;
      		}
      	    }
	});
    }
    
    window.addEventListener("deviceorientation", function(evt){
	game.input.analogX = evt.gamma;
    }, false);
    game.start();

	/*************************
	* function for drawBlock *
	**************************/
    function drawBlock(){
	count = 0;
	for(var y=0; y<6; y++){
  	    for(var x=1; x<11; x++){
    	  	block[count] = new Sprite(24, 12);
    	  	var random = Math.random();
    	  	block[count].x = x * 32 + 12;
    	  	block[count].y = y * 18 + 30;
    	  	block[count].life = 1;
    	  	if(random >= 0.95) {
    	  	    block[count].image = game.assets["res/item3.jpg"];
    	  	    block[count].item = 3;
    	  	    game.rootScene.addChild(block[count]);
    		    count = count + 1; 
    	  	} 
    	  	else if(random >= 0.90 && random < 0.95) {
    	  	    block[count].image = game.assets["res/item2.jpg"];
    	  	    block[count].item = 2;
    	  	    game.rootScene.addChild(block[count]);
    		    count = count + 1; 
    	  	}
    	  	else if(random >= 0.87 && random < 0.90) {
    	  	    block[count].image = game.assets["res/item.jpg"];
    	  	    block[count].item = 1;
    	  	    game.rootScene.addChild(block[count]);
    		    count = count + 1; 
    	  	}
    	  	else if(random >= 0.80 && random < 0.87) {
    	  	    block[count].image = game.assets["res/block2.jpg"];
    	  	    block[count].life = 2;
    	  	    game.rootScene.addChild(block[count]);
    		    count = count + 1; 
    	  	}
    	  	else if(random >= 0.70 && random < 0.80) {
    	  	}
    	  	else {
	    	    block[count].image = game.assets["res/block.jpg"];
	    	    game.rootScene.addChild(block[count]);
    		    count = count + 1; 
   		}
 	    }
	}
	total += count;
    }
    
    /*************
    * Main Class *
    **************/
    
    // How to move a Ball
    var Ball = Class.create(Sprite, {
	initialize: function() {
	    Sprite.call(this,16,16);
	    this.image = game.assets["res/facesmile.png"];
	    this.speed = 1.2 + level * 0.05;
	    game.rootScene.addChild(this);
	},
	onenterframe:function() {
 	    this.x = this.x + this.dx * this.speed;
	    this.y = this.y + this.dy * this.speed;
	    if ((this.x < 0) || (this.x > (game.width-this.width))){
		this.dx = -this.dx; 
	    }
    	    if (this.y < 0){ 
    		this.dy = -this.dy; 
    	    }
    	    
    	    if(this.y > game.height){
    	    	if(num_ball > 1) {
    	    		num_ball--;
		    		this.dx = 0;
		    		this.dy = 0;
		    		this.moveTo(-999, -999);
    	    	} 
    	    	else if(num_ball === 1) {
		    		life -= 1;

    				lifeLabel.text = "Life : "+life;
    				if (life === 0) {
		    			game.stop();
    	    		    alert("Last Score: "+game.score);
					}
					else {
		    			this.moveTo(0, 0);
		    			this.speed = 1.2+ level * 0.05;
					}
				}
    	    }
    	}
    });
    
    // How to move Pad
    var Pad = Class.create(Sprite, {
	initialize: function() {
	    Sprite.call(this,32,16);
	    this.image = game.assets["res/pad.png"];
		this.x = game.width / 2;
		this.y = game.height - 40;
	    this.width = 64;
	    this.height = 16;
	    this.speed = 1;
	    game.rootScene.addChild(this);
	},
	onenterframe: function() {
	    var m = 0;
	    if (game.input.left)  { m = -6 * this.speed; }
 	    if (game.input.right) { m = 6 * this.speed; }
	    this.x += m;
	    if (this.x < 0) { this.x = 0; }
	    if (this.x > (game.width - this.width)) {
		this.x = game.width - this.width;
	    }
	    if (game.input.up) { this.y = this.y - 1; }
	    if (game.input.down) { this.y = this.y + 1; }
	    if (this.y > game.height - 40) {
		this.y = game.height - 40;
	    }
	    if (this.y < game.height - 70) {
		this.y = game.height - 70;
	    }
	}
    });				

    // How to move UFO
    var UFO = Class.create(Sprite, {
	initialize: function() {
	    Sprite.call(this,34,68);
	    this.image = game.assets["res/ufo.png"];
	    this.width = 68;
	    this.height = 34;
	    this.speed = 1;
		this.x = game.width / 2;
		this.y = 250;
		this.vx = 0.5 + level*0.25;
		this.vy = 0.5 + level*0.25;	    
	    game.rootScene.addChild(this);
	},
	onenterframe: function() {
	    this.x = this.x + this.vx;
	    if ((this.x < 0) || 
		(this.x > (game.width-this.width)) ){
		this.vx = -this.vx;
	    }
	   	this.y = this.y - this.vy;
	    if ((this.y > 250) || (this.y < 200)) {
	    	this.vy = -this.vy;
	    }
	}
    });
}