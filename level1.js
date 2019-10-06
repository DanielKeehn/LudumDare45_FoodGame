class level1 extends Phaser.Scene{

	constructor(){
		super({key:"level1"});
		this.platforms;
		this.items;
		this.player;
		this.cursors;

		//These variables are text that show up when item is collected
        var collectItemUI;
        var collectItemUIAmount;
        var collectItemVisible;

        //These are ints saying how many items a player need and how many they have collected
        var itemsLefttoCollect;
        var itemsCollected;

        //This are the variables that must be changed every level, it is the recipe ingredients and name
        var recipe = eggsRecipe;
		var recipeName = eggsRecipeName;
		var playerIngredientsCollected = eggsRecipePlayer;
	}

	//Runs before create
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
		this.load.image('platform', 'Resources/blue.png');
		this.load.image('item', 'Resources/yellow.png');
	}

	//Runs when scene first is made only once
	create(){
        this.createUIVariables();
		this.createRecipeUI(eggsRecipe, eggsRecipeName); //Make sure the paramters change for every level
		this.platforms = this.physics.add.staticGroup();
		this.items = this.physics.add.group();
		this.spawnPlatformns();
		this.spawnIngredients();
		this.player = this.add.sprite(32, 400, 'player');
		this.physics.world.enableBody(this.player);
		this.player.body.bounce.y = 0.2;
		this.player.body.gravity.y = 800;
		this.player.body.syncBounds = true;
		this.player.scale = 0.2;
		this.anims.create({
			key: 'run', 
			repeat: -1,
			frames: this.anims.generateFrameNames('player', {start: 0, end: 38})
		});
		this.player.play('run');//Player's starting animation
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	//Runs every frame
	update(time, delta){
		this.updatePhysics();
		this.updatePlayerPos();
	}

	//These variables deal with when a player collects an ingredient
	createUIVariables() {
        this.itemsLefttoCollect = 12;
        this.itemsCollected = 0;
        this.collectItemVisible = false;
        
        this.collectItemUI = this.add.text(0,0,"You Collected An Item!");
        this.collectItemUIAmount = this.add.text(0,15,this.itemsCollected + "/" + this.itemsLefttoCollect);
        this.collectItemUI.setVisible(false);
        this.collectItemUIAmount.setVisible(false);
    }

	//This creates the UI on the top right of the screen, so the player knows how much of an item they need to collect
    createRecipeUI(recipe, name) {
        let yPos = 0;
        this.text = this.add.text(585,yPos,"Recipe: " + name);
        for (let i = 0; i < recipe.length; i++) {
            yPos += 20
            for (let [key, value] of Object.entries(recipe[i])) {
                console.log(`${key}: ${value}`);
                this.text = this.add.text(585,yPos,key + ": x" + value);
              }
        } 
	}

	//This method is diferent for every scene, but creates all the ingredients in a scene
	spawnIngredients() {
		this.makeIngredient(70, 0, eggPrefab);
        this.makeIngredient(300, 40, eggPrefab);
	}

	//This method is diffrent for every scene, but spawns in all the platforms
	spawnPlatformns() {
		this.makePlatform(50, 536, 2);
		this.makePlatform(400,450, 2);
		this.makePlatform(25, 350);
	}
	
	//This runs every frame to update the players position (takes in user input)
	updatePlayerPos() {
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
	}

	//This runs every frame to check physics values
	updatePhysics() {
		this.physics.world.collide(this.player, this.platforms);
		this.physics.world.collide(this.platforms, this.items);
		this.physics.world.collide(this.player, this.items, this.collectItem, null, this);
	}

	//This is how to spawn a platform into a scene
	makePlatform(x, y, width = 1){
		let ground = this.platforms.create(x, y, 'platform');
		ground.scaleX = width;
		ground.body.immovable = true;
		ground.refreshBody();
	}

	//This is how to make spawn an ingredient into a scene
	makeIngredient(x, y, ingredientVariable){
		let item = this.items.create(x, y, 'item');
		this.physics.world.enable(item);
		item.body.gravity.y = 1000;
		item.body.bounce.y = 0.3 + Math.random() * 0.2;
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
        this.collectItemUI = this.add.text(0,0,"You Collected An Item!");
        this.collectItemUI.setVisible(true);
        this.collectItemUIAmount = this.add.text(0,15,this.itemsCollected + "/" + this.itemsLefttoCollect);
        await this.sleep(2000);
        this.collectItemVisible = false;
        this.collectItemUI.setVisible(false);
        this.collectItemUIAmount.setVisible(false);
    }

    //This allows for the UI to stay on the screen for a small amount of time but eventually disaapear
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	//Call this when you do not get the right amount of items or die
	restart(){
		this.scene.restart();
	}
}