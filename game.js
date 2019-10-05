var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 200}
		}
	},
	scene: [level0]
};

var game = new Phaser.Game(config);
