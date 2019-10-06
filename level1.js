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

        //These are variables dealing with UI That Display the Recipe
        var RecipeUI;
        var itemIngredient;
	}

	preload(){
		this.load.image('player', 'Resources/white.png');
		this.load.image('platform', 'Resources/blue.png');
		this.load.image('item', 'Resources/yellow.png');
	}

	create(){

        this.createUIVariables();
        this.createRecipeUI();        

        //this.image = this.add.image(400, 300, 'player');

		this.platforms = this.physics.add.staticGroup();
		this.items = this.physics.add.group();
		//this.physics.world.enable(this.platforms);
		//this.platforms.enableBody();
		//this.plat	forms.body.immovable = true;

		this.makePlatform(50, 536, 2);

		this.makePlatform(400,450, 2);

		this.makePlatform(25, 350);

		for(let i = 0; i < 12; i++){
			this.makeItem(i * 70, 0);
		}
		
		this.player = this.add.sprite(32, 450, 'player');
		this.physics.world.enableBody(this.player);
		this.player.body.bounce.y = 0.2;
		this.player.body.gravity.y = 800;
		//this.player.body.collideWorldBounds = true;

        this.cursors = this.input.keyboard.createCursorKeys();
	}

	update(time, delta){
		this.physics.world.collide(this.player, this.platforms);
		this.physics.world.collide(this.platforms, this.items);
		this.physics.world.collide(this.player, this.items, this.collectItem, null, this);
		//this.physics.world.collide()

		this.player.body.velocity.x = 0;
		if(this.cursors.left.isDown){
			this.player.body.velocity.x = -150;
			//player.animations.play('left');
		}
		else if(this.cursors.right.isDown){
			this.player.body.velocity.x = 150;
			//player.animations.play('right');
		}
		if(this.cursors.up.isDown && this.player.body.touching.down){
			this.player.body.velocity.y = -600;
		}
		//else if(this.cursors.up.isDown == false && this.player.body.touching.down == false){
		//	this.player.body.velocity.y = 300;
		//}
    }
    
    createUIVariables() {
        this.itemsLefttoCollect = 12;
        this.itemsCollected = 0;
        this.collectItemVisible = false;
        
        this.collectItemUI = this.add.text(0,0,"You Collected An Item!");
        this.collectItemUIAmount = this.add.text(0,15,this.itemsCollected + "/" + this.itemsLefttoCollect);
        this.collectItemUI.setVisible(false);
        this.collectItemUIAmount.setVisible(false);
    }

    createRecipeUI() {
        this.RecipeUI = this.add.text(585,0, "Recipe: Name of Desert");
        this.itemIngredient = this.add.text(585,20,"x12 Rectangles");
    }

	makePlatform(x, y, width = 1){
		let ground = this.platforms.create(x, y, 'platform');
		//ground.enableBody(false, 0, 0, true, true);
		//this.physics.world.enable(ground);
		ground.scaleX = width;
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
}