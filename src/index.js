import Phaser from 'phaser';

var player, cursors, apples, melons, scoreText, appleScore = 0, melonScore = 0, hp = 3;

class MyGame extends Phaser.Scene {
    constructor() {
        super();
        this.WIDTH = 800;
        this.HEIGHT = 600;
    }

    preload() {
        this.load.image('bg', 'src/assets/bg/hills(800x600).png');
        this.load.image('tiles', 'src/assets/tilesets/Terrain (16x16).png');
        this.load.tilemapTiledJSON('map', 'src/assets/tilemaps/map2.json')
        this.load.spritesheet('playerIdle', 'src/assets/hero/Idle (32x32).png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('playerRun', 'src/assets/hero/Run (32x32).png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('playerJump', 'src/assets/hero/Jump (32x32).png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('apple', 'src/assets/fruits/Apple.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('melon', 'src/assets/fruits/Melon.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('spike', 'src/assets/traps/Idle.png')
    }

    create() {
        let back = this.add.image(this.WIDTH / 2, this.HEIGHT / 2, 'bg');

        const map = this.make.tilemap({key: 'map'});
        const tileset = map.addTilesetImage('map2-tileset', 'tiles');

        var platforms = map.createLayer(0, tileset, 0,0);
        platforms.setCollisionByExclusion([-1], true);

        //back.setOrigin(0)
        back.setScrollFactor(0);//fixedToCamera = true;
        this.cameras.main.setBounds(0, 0, 800, 600);
        this.physics.world.setBounds(0, 0, 800, 600);

        player = this.physics.add.sprite(50, 540, 'playerIdle');
        player.setCollideWorldBounds(true);
        player.setBounce(0.2);
        this.physics.add.collider(player, platforms);
        this.cameras.main.startFollow(player);

        apples = this.physics.add.staticGroup();
        melons = this.physics.add.staticGroup();
        this.createCollectable(map, apples, 'Apples', 'apple');
        this.createCollectable(map, melons, 'Melons', 'melon');




        scoreText = this.add.text(16, 16, 'Apples: 0 Melons: 0 HP: 3', { fontSize: '32px', fill: '#000' });
        this.add.text(600, 580, 'Press Shift to Heal', { fontSize: '15px', fill: '#000' });
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
            frames: [{ key: 'playerJump', frame: 0 }],
            frameRate: 20,
            repeat: -1
          });

          this.anims.create({
            key: 'appleIdle',
            frames: this.anims.generateFrameNumbers('apple', { start: 0, end: 14 }),
            frameRate: 35,
            repeat: -1
        });

        this.anims.create({
            key: 'melonIdle',
            frames: this.anims.generateFrameNumbers('melon', { start: 0, end: 14 }),
            frameRate: 35,
            repeat: -1
        });

        apples.getChildren().forEach(c => {
            c.anims.play('appleIdle', true)
        });
        this.physics.add.overlap(player, apples, this.collectApple, null, this);
        melons.getChildren().forEach(c => c.anims.play('melonIdle', true));
        this.physics.add.overlap(player, melons, this.collectMelon, null, this);

        cursors = this.input.keyboard.createCursorKeys();

        // <--- Spikes --->
        this.spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        })
        map.getObjectLayer('Spikes').objects.forEach((spike) => {
            // Add new spikes to our sprite group
            const spikeSprite = this.spikes.create(spike.x, spike.y - 16, 'spike').setOrigin(0);
        });
        this.physics.add.collider(player, this.spikes, this.playerHit, null, this);
    }

    createCollectable(map, fruits, fruitsTileMapId, fruitId) {
        map.getObjectLayer(fruitsTileMapId).objects.forEach(fruit => {
            fruits.create(fruit.x + 16, fruit.y - 16, fruitId);
        })
    }

    playerHit(player, spike) {
        hp--;
        scoreText.setText('Apples: ' + appleScore + ' Melons: ' + melonScore + ' HP: ' + hp);
        player.setVelocity(0, 0);
        player.setX(50);
        player.setY(540);
        player.play('idle', true);
        player.setAlpha(0);
        let tw = this.tweens.add({
            targets: player,
            alpha: 1,
            duration: 100,
            ease: 'Linear',
            repeat: 5,
        });
        if(hp <= 0) {
            this.scene.restart();
            appleScore = 0;
            melonScore = 0;
            hp = 3;
        }
    }

    collectApple(player, apple) {
        apple.disableBody(true, true);

        appleScore += 1;
        scoreText.setText('Apples: ' + appleScore + ' Melons: ' + melonScore + ' HP: ' + hp);
    }

    collectMelon(player, melon) {
        melon.disableBody(true, true);

        melonScore += 1;
        scoreText.setText('Apples: ' + appleScore + ' Melons: ' + melonScore + ' HP: ' + hp);
    }

    update(time, delta) {
        super.update(time, delta);
        if (cursors.left.isDown) {
            player.setVelocityX(-250);
            if(player.body.touching.down || player.body.onFloor()) {
                player.anims.play('left', true);
            }
            player.flipX = true;
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(250);
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
            player.setVelocityY(-350);
            player.anims.play('jump', true);
        }
        cursors.shift.on('down', function(event) {
            if(appleScore >= 2 && melonScore >= 2) {
                hp += 1;
                melonScore = melonScore - 2;
                appleScore = appleScore - 2;
                scoreText.setText('Apples: ' + appleScore + ' Melons: ' + melonScore + ' HP: ' + hp);
            }
        });
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
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: MyGame
};

const game = new Phaser.Game(config);
