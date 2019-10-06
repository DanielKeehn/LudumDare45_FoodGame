class level0 extends Phaser.Scene{

	constructor(){
		super({key:"level0"});
		this.platforms;
		this.items;
		this.firetraps;
		this.player;
		this.cursors;

		//These variables are text that show up when item is collected
        var collectItemUI;
        var collectItemUIAmount;
        var collectItemVisible;

        //These are ints saying how many items a player need and how many they have collected
        var itemsLefttoCollect;
        var itemsCollected;

        //These are variables dealing with UI That Display the Recipe
        var RecipeUI;
        var itemIngredient;
	}

	preload(){
		this.load.spritesheet({
		key: 'player', 
		url: 'Resources/mouse_run.png', 
		frameConfig:{
			frameWidth: 650, 
			frameHeight: 200,
			startFrame: 0,
			endFrame: 38
			}
		});
		this.load.spritesheet({
			key: 'fire',
			url: 'Resources/firetrap.png',
			frameConfig:{
				frameWidth: 527,
				frameHeight: 583,
				startFrame: 0,
				endFrame: 53
			}
		});
		this.load.image('background', 'Resources/Background.png');
		this.load.image('shelf', 'Resources/BasicPlatform.png');
		this.load.image('platform', 'Resources/Floor.png');
		this.load.image('item', 'Resources/yellow.png');
	}

	create(){
		this.add.tileSprite(0, 600, 800, 600, 'background');
		this.anims.create({
			key: 'flame', 
			frames: this.anims.generateFrameNames('fire', {start: 0, end: 53})
		});
		this.createUIVariables();
        this.createRecipeUI(); 

		//this.image = this.add.image(400, 300, 'player');

		this.createLevelLayout();
		
		this.createPlayer();

		this.cursors = this.input.keyboard.createCursorKeys();

		this.cameras.main.setLerp(0.9, 0.5);
		this.cameras.main.setDeadzone(0.1, this.cameras.main.height / 2);
		this.cameras.main.startFollow(this.player);
	}

	update(time, delta){
		this.updateCollisions();
		this.updateFlameTrap();
		//this.physics.world.collide()
		this.UpdateCameraAndUI();

		this.updateInput();
	}

	updateCollisions(){
		this.physics.world.collide(this.player, this.platforms);
		this.physics.world.collide(this.platforms, this.items);
		this.physics.world.collide(this.player, this.items, this.collectItem, null, this);
	}

	updateInput(){
		this.player.body.velocity.x = 0;
		if(this.cursors.left.isDown){
			this.player.body.velocity.x = -150;
			if(this.player.flipX == false){
				this.player.play('run');
				this.player.flipX = true;
			}
		}
		else if(this.cursors.right.isDown){
			this.player.body.velocity.x = 150;
			if(this.player.flipX == true){
				this.player.play('run');
				this.player.flipX = false;
			}
		}
		if(this.cursors.up.isDown && this.player.body.touching.down){
			this.player.body.velocity.y = -600;
		}
		//else if(this.cursors.up.isDown == false && this.player.body.touching.down == false){
		//	this.player.body.velocity.y = 300;
		//}
	}

	UpdateCameraAndUI(){
		//Update X
		let xAnchor = this.cameras.main.scrollX;// - (this.cameras.main.width / 2);
		//this.cameras.main.centerOnX(this.player.x);
		this.collectItemUI.x = xAnchor;
		this.collectItemUIAmount.x = xAnchor;
		this.RecipeUI.x = xAnchor + this.cameras.main.width - 300;
		this.itemIngredient.x = xAnchor + this.cameras.main.width - 300;

		//Update Y
		let yAnchor = this.cameras.main.scrollY;// - (this.cameras.main.height / 2);
		//this.cameras.main.centerOnX(this.player.x);
		this.collectItemUI.y = yAnchor;
		this.collectItemUIAmount.y = yAnchor + 15;
		this.RecipeUI.y = yAnchor;
		this.itemIngredient.y = yAnchor + 20;
	}

	updateFlameTrap(){
		let set = this.firetraps.children.getArray();
		for(let i = 0; i < set.length; i++){
			let fire = set[i];
			if(fire.anims.isPlaying){
				this.physics.world.collide(this.player, fire, this.killPlayer, null, this);
			}
		}
	}

	createLevelLayout(){
		this.platforms = this.physics.add.staticGroup();
		this.firetraps = this.physics.add.staticGroup();
		this.items = this.physics.add.group();
		//this.physics.world.enable(this.platforms);
		//this.platforms.enableBody();
		//this.plat	forms.body.immovable = true;

		this.makePlatform(50, 536, 2);

		this.makePlatform(400,450, 2);

		this.makePlatform(25, 350);

		this.makePlatform(100, 650, 4);

		this.makeFlameTrap(400, 400, 5000);

		for(let i = 0; i < 12; i++){
			this.makeItem(i * 70, 0);
		}
	}

	createPlayer(){
		this.player = this.add.sprite(32, 400, 'player');
		this.physics.world.enableBody(this.player);
		this.player.body.bounce.y = 0.2;
		this.player.body.gravity.y = 800;
		//this.player.body.collideWorldBounds = true;
		this.player.body.syncBounds = true;
		this.player.scale = 0.2;
		//this.player.refreshBody();
		this.anims.create({
			key: 'run', 
			repeat: -1,
			frames: this.anims.generateFrameNames('player', {start: 0, end: 38})
		});
		this.player.play('run');//Player's starting animation
	}

	createUIVariables() {
        this.itemsLefttoCollect = 12;
        this.itemsCollected = 0;
        this.collectItemVisible = false;
        
		//let xAnchor = this.cameras.main.scrollX - (this.cameras.main.width / 2);
        this.collectItemUI = this.add.text(0,0,"You Collected An Item!");
        this.collectItemUIAmount = this.add.text(0,15,this.itemsCollected + "/" + this.itemsLefttoCollect);
        this.collectItemUI.setVisible(false);
        this.collectItemUIAmount.setVisible(false);
    }

    createRecipeUI() {
        this.RecipeUI = this.add.text(585,0,"Recipe: Name of Desert");
        this.itemIngredient = this.add.text(585,20,"x12 Rectangles");
    }

	makePlatform(x, y, width = 1){
		let ground = this.platforms.create(x, y, 'platform');
		//ground.enableBody(false, 0, 0, true, true);
		//this.physics.world.enable(ground);
		ground.scale = 0.3;
		ground.scaleX *= width;
		ground.body.immovable = true;
		ground.refreshBody();
	}

	makeItem(x, y){
		let item = this.items.create(x, y, 'item');
		this.physics.world.enable(item);
		item.body.gravity.y = 1000;
		item.body.bounce.y = 0.3 + Math.random() * 0.2;
		//item.body.collideWorldBounds = true;
	}

	makeFlameTrap(x, y, delay){
		let trap = this.firetraps.create(x, y, 'fire');
		trap.scale = 0.2;
		trap.body.immovable = true;
		trap.refreshBody();
		this.sleep(delay);
		this.playFlameTrap(trap);
		this.time.addEvent({
			delay: delay,
			callback: this.playFlameTrap,
			args: [trap],
			callbackScope: this,
			repeat: Infinity
		});
	}

	playFlameTrap(trap){
		trap.play('flame');
	}

	//This method is called when the player collides with an Item
	collectItem(player, item){
		item.destroy();
		this.itemsCollected++;
        this.collectItemVisible = true;
        this.amountofItemCollectedUI(player, item);
	}

	//This function runs everytime an item is collected. It shows up momentarily of the center top of a screen
    async amountofItemCollectedUI(player, item) {
        if (this.collectItemVisible == true) {
            this.collectItemUI.setVisible(false);
            this.collectItemUIAmount.setVisible(false);   
        }
		let xAnchor = this.cameras.main.centerX - (this.cameras.main.width / 2);
        this.collectItemUI = this.add.text(xAnchor,0,"You Collected An Item!");
        this.collectItemUI.setVisible(true);
        this.collectItemUIAmount = this.add.text(xAnchor,15,this.itemsCollected + "/" + this.itemsLefttoCollect);
        await this.sleep(2000);
        this.collectItemVisible = false;
        this.collectItemUI.setVisible(false);
        this.collectItemUIAmount.setVisible(false);
    }

    //This allows for the UI to stay on the screen for a small amount of time but eventually disaapear
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

	killPlayer(){
		//this.player.destroy();
		//this.sleep(2000);
		this.scene.restart();
	}

}