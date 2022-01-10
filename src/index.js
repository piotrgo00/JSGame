import Phaser from 'phaser';

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.WIDTH = 800;
        this.HEIGHT = 600;
    }

    preload ()
    {
        this.load.image('bg', 'src/assets/bg/hills(800x600).png');
        this.load.image('terrain', 'src/assets/terrain(16x16).png');

    }
      
    create ()
    {
        this.add.image(this.WIDTH/2, this.HEIGHT/2, 'bg');
    }

    update(time, delta) {
        super.update(time, delta);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: MyGame
};

const game = new Phaser.Game(config);
