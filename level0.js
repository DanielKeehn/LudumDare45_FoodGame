class level0 extends Phaser.Scene{
	constructor(){
		super({key:"level0"});
	}

	//let platforms;
	//let player;

	preload(){
		this.load.image('player', 'Resources/white.png');
		this.load.image('platform', 'Resources/blue.png');
	}

	create(){
		//this.image = this.add.image(400, 300, 'player');

		let platforms = this.add.group();
		this.physics.world.enable(platforms);
		platforms.enableBody = true;

		let ground = platforms.create(0, 536, 'platform');
		ground.scale = 2;
		//ground.body.immovable = true;

		let ledge = platforms.create(400,450, 'platform');
		//ledge.body.immovable = true;

		ledge = platforms.create(-75, 350, 'platform');
		//ledge.body.immovable = true;
		
		let player = this.add.sprite(32, 450, 'player');
		this.physics.world.enableBody(player);
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 800;
		player.body.collideWorldBounds = true;
	}

}