import Dude from 'objects/Dude';

/*
 * Enemy
 * ====
 *
 * A sample prefab (extended game object class), for displaying the Phaser
 * logo.
 */

export default class Enemy extends Dude
{

    constructor(game, x, y, key, frame)
    {
        super(game, x, y, key, frame);

        this.createPhysics();

        this.cursors = this.game.input.keyboard.createCursorKeys();

        // Creates 30 bullets, using the 'star' graphic
        this.weapon = this.game.add.weapon(1, 'star');

        // The bullet will be automatically killed when it leaves the world bounds
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        // The speed at which the bullet is fired
        this.weapon.bulletSpeed = 300;

        // Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        this.weapon.fireRate = 200;

        this.weapon.fireAngle = Phaser.ANGLE_DOWN;

        this.fireButton = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        // Tell the Weapon to track the 'player' Sprite
        // With no offsets from the position
        // But the 'true' argument tells the weapon to track sprite rotation
        this.weapon.trackSprite(this, 32, 32, false);

        game.add.existing(this);
    }

    update()
    {
        if (this.alive) this.weapon.fire();
    }

}
