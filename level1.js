class level1 extends Phaser.Scene{

	constructor(){
		super({key:"level1"});
		this.platforms;
		this.items;
		this.player;
		this.cursors;
		this.firetraps;
		
		//Checks if UI When You Collect an Item is Showing or not
		this.collectItemUIVisible = false;
		this.collectItemUI;
		this.collectItemUIAmount; 

        //This are the variables that must be changed every level, it is the recipe ingredients and name
        this.recipe = eggsRecipe;
		this.recipeName = eggsRecipeName;
		this.ingredientsCollected = eggsRecipePlayer;
		this.recipeUI;
		this.ingredient1;
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

	//Runs when scene first is made only once
	create(){
		this.collectItemUI = this.add.text(0,0,"");
		this.collectItemUIAmount = this.add.text(0,0,"");
		this.recipeUI = this.add.text(0,0,"");
		this.ingredient1 = this.add.text(0,0,"");
		this.createRecipeUI();
		
		this.add.tileSprite(0, 600, 800, 600, 'background');
		this.anims.create({
			key: 'flame', 
			frames: this.anims.generateFrameNames('fire', {start: 0, end: 53})
		});
		


		this.platforms = this.physics.add.staticGroup();
		this.firetraps = this.physics.add.staticGroup();
		this.ingredients = this.physics.add.group();
		
		//Spawns all the ingredients and platforms
		this.spawnPlatformns();
		this.spawnIngredients();
		
		//This creates the player
		this.createPlayer();
		
		this.cursors = this.input.keyboard.createCursorKeys();

		this.makeFlameTrap(400, 400, 5000);

		this.cameras.main.setLerp(0.9, 0.5);
		this.cameras.main.setDeadzone(0.1, this.cameras.main.height / 2);
		this.cameras.main.startFollow(this.player);
	}

	//Runs every frame
	update(time, delta){
		this.updatePhysics();
		this.updatePlayerPos();
		this.UpdateCameraAndUI();
		this.updatePhysics();
		this.updateFlameTrap();
	}

	//This creates the UI on the top right of the screen, so the player knows how much of an item they need to collect
    createRecipeUI() {
        let yPos = 20;
        this.recipeUI = this.add.text(700,yPos,"Recipe: " + this.recipeName);
        for (let i = 0; i < this.recipe.length; i++) {
            yPos += 20
            for (let [key, value] of Object.entries(this.recipe[i])) {
                this.ingredient1 = this.add.text(700,yPos,key + ": x" + value);
              }
        } 
	}

	//This creates the player sprite, animation, and gives the player physics
	createPlayer() {
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
		this.makePlatform(100, 650, 4);
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
		this.physics.world.collide(this.platforms, this.ingredients);
		this.physics.world.collide(this.player, this.ingredients, this.collectIngredient, null, this);
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

	UpdateCameraAndUI(){
		//Update X
		let xAnchor = this.cameras.main.scrollX;// - (this.cameras.main.width / 2);
		this.cameras.main.centerOnX(this.player.x);
		this.collectItemUI.x = xAnchor;
		this.collectItemUIAmount.x = xAnchor;
		this.recipeUI.x = xAnchor + this.cameras.main.width - 300;
		this.ingredient1.x = xAnchor + this.cameras.main.width - 300;
		//this.itemIngredient.x = xAnchor + this.cameras.main.width - 300;

		//Update Y
		let yAnchor = this.cameras.main.scrollY;// - (this.cameras.main.height / 2);
		this.cameras.main.centerOnX(this.player.x);
		this.collectItemUI.y = yAnchor;
		this.collectItemUIAmount.y = yAnchor + 15;
		this.recipeUI.y = yAnchor;
		this.ingredient1.y = yAnchor + 15;
		//this.itemIngredient.y = yAnchor + 20;
	}


	//This is how to spawn a platform into a scene
	makePlatform(x, y, width = 1){
		let ground = this.platforms.create(x, y, 'platform');
		ground.scale = 0.3;
		ground.scaleX *= width;
		ground.body.immovable = true;
		ground.refreshBody();
	}

	//This is how to make spawn an ingredient into a scene
	makeIngredient(x, y, ingredientVariable){
		let ingredient = this.ingredients.create(x, y, ingredientVariable["image"]);
		this.physics.world.enable(ingredient);
		ingredient.body.gravity.y = 1000;
		ingredient.body.bounce.y = 0.3 + Math.random() * 0.2;
		ingredient.name = ingredientVariable["name"];
	}

	//This method is called when the player collides with an Ingredient
	collectIngredient(player, item){
		item.destroy();
		let ingredientName = item.name;
		let ingredientsAmount;
		let ingredientsAmountPlayer;
		this.collectItemVisible = true;
		for (let i = 0; i < this.recipe.length; i++) {
            for (let [key, value] of Object.entries(this.recipe[i])) {
                if (key == ingredientName) {
					ingredientsAmount = value;
				}	
              }
		}
		for (let i = 0; i < this.ingredientsCollected.length; i++) {
            for (let [key, value] of Object.entries(this.ingredientsCollected[i])) {
                if (key == ingredientName) {
					value++;
					ingredientsAmountPlayer = value;
					this.ingredientsCollected[i][key] = value;
				}
              }
		}
		this.amountofIngredientCollectedUI(ingredientName, ingredientsAmount, ingredientsAmountPlayer);
	}

	//This function runs everytime an item is collected. It shows up momentarily of the center top of a screen
    async amountofIngredientCollectedUI(name, amountForRecipe, amountPlayerHas) {
        if (this.collectItemVisible == true) {
            this.collectItemUI.setVisible(false);
            this.collectItemUIAmount.setVisible(false);   
        }
        this.collectItemUI = this.add.text(0,0,"You Collected An " + name + "!");
		this.collectItemUIAmount = this.add.text(0,15,amountPlayerHas + "/" + amountForRecipe);
		this.collectItemUI.setVisible(true);
		this.collectItemUIAmount.setVisible(true);
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

	killPlayer(){
		//this.player.destroy();
		//this.sleep(2000);
		this.scene.restart();
	}
}