import Phaser from 'phaser';

var player, cursors;

class MyGame extends Phaser.Scene {
    constructor() {
        super();
        this.WIDTH = 800;
        this.HEIGHT = 600;
    }

    preload() {
        this.load.image('bg', 'src/assets/bg/hills(800x600).png');
        //this.load.image('terrain', 'src/assets/terrain(16x16).png');
        this.load.spritesheet('playerIdle', 'src/assets/hero/Idle (32x32).png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('playerRun', 'src/assets/hero/Run (32x32).png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('playerJump', 'src/assets/hero/Jump (32x32).png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        let back = this.add.image(this.WIDTH / 2, this.HEIGHT / 2, 'bg');


        //back.setOrigin(0)
        back.setScrollFactor(0);//fixedToCamera = true;
        this.cameras.main.setBounds(0, 0, 800, 600);
        this.physics.world.setBounds(0, 0, 800, 600);

        player = this.physics.add.sprite(400, 300, 'playerIdle');
        player.setCollideWorldBounds(true);
        this.cameras.main.startFollow(player);

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 10 }),
            frameRate: 20
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('playerRun', { start: 0, end: 11 }),
            frameRate: 20,
            repeat: -1
          });
        
          this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('playerRun', { start: 0, end: 11 }),
            frameRate: 20,
            repeat: -1
          });

          this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('playerJump', { start: 0, end: 0 }),
            frameRate: 20,
            repeat: -1
          });

        cursors = this.input.keyboard.createCursorKeys();
    }

    update(time, delta) {
        super.update(time, delta);
        if (cursors.left.isDown) {
            player.setVelocityX(-150);
            if(player.body.touching.down || player.body.onFloor()) {
                player.anims.play('left', true);
            }
            player.flipX = true;
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(150);
            if(player.body.touching.down || player.body.onFloor()) {
                player.anims.play('right', true);
            }
            player.flipX = false;
        }
        else {
            player.setVelocityX(0);
            if(player.body.touching.down || player.body.onFloor()) {
                player.anims.play('idle', true);
            }
        }

        if (cursors.up.isDown && (player.body.touching.down || player.body.onFloor())) {
            player.setVelocityY(-250);
            player.anims.play('jump', true);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: MyGame
};

const game = new Phaser.Game(config);
