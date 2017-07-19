/*
 * Dude
 * ====
 *
 * A sample prefab (extended game object class), for displaying the Phaser
 * logo.
 */

var facing = 'right';
var weapon = undefined;
var cursors = undefined;
var fireButton = undefined;

export default class Dude extends Phaser.Sprite
{

    constructor(game, x, y, key, frame)
    {
        super(game, x, y, key, frame);

        this.setHealth(10);
        this.setControls();
        this.setPhysics();
        this.body.setSize(20, 32, 5, 16);
        this.animations.add('left', [0, 1, 2, 3], 9, true);
        this.animations.add('turn', [4], 20, true);
        this.animations.add('right', [5, 6, 7, 8], 9, true);
        this.animations.add('idle', [4], 20);

        this.cursors = this.game.input.keyboard.createCursorKeys();

        //  Creates 30 bullets, using the 'star' graphic
        this.weapon = this.game.add.weapon(30, 'star');

        //  The bullet will be automatically killed when it leaves the world bounds
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        //  The speed at which the bullet is fired
        this.weapon.bulletSpeed = 600;

        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        this.weapon.fireRate = 100;

        this.fireButton = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        //  Tell the Weapon to track the 'player' Sprite
        //  With no offsets from the position
        //  But the 'true' argument tells the weapon to track sprite rotation
        this.weapon.trackSprite(this, 32, 32, false);
    }

    update()
    {
        if (this.alive)
        {

            if (this.upKey.isDown && (this.body.blocked.down || this.body.touching.down))
            {
                if (this.game.time.now)
                {
                    this.body.velocity.y = -500;
                }
            }

            if (this.leftKey.isDown)
            {
                if (this.facing != 'left') this.setAnimation('left');

                this.body.velocity.x = -125;
                this.x--;
            }
            else if (this.rightKey.isDown)
            {
                if (this.facing != 'right') this.setAnimation('right');

                this.body.velocity.x = 125;
                this.x++;
            }
            else
            {
                if (this.facing != 'idle') this.setAnimation('idle');

                this.body.velocity.x = 0;
            }

            if (this.cursors.up.isDown) {
                if (this.cursors.left.isDown) {
                    this.weapon.fireAngle = Phaser.ANGLE_NORTH_WEST;
                }
                else if (this.cursors.right.isDown) {
                    this.weapon.fireAngle = Phaser.ANGLE_NORTH_EAST;
                }
                else {
                    this.weapon.fireAngle = Phaser.ANGLE_UP;
                }
            }
            else if (this.cursors.down.isDown) {
                if (this.cursors.left.isDown) {
                    this.weapon.fireAngle = Phaser.ANGLE_SOUTH_WEST;
                }
                else if (this.cursors.right.isDown) {
                    this.weapon.fireAngle = Phaser.ANGLE_SOUTH_EAST;
                }
                else {
                    this.weapon.fireAngle = Phaser.ANGLE_DOWN;
                }
            }
            else {
                if (this.cursors.left.isDown)
                {
                    this.weapon.fireAngle = Phaser.ANGLE_LEFT;
                }
                else if (this.cursors.right.isDown)
                {
                    this.weapon.fireAngle = Phaser.ANGLE_RIGHT;
                }
            }

            if (this.fireButton.isDown)
            {
                this.weapon.fire();
            }
        }
    }

    setHealth(health)
    {
        this.health = health;
        this.maxHealth = this.health;
    }

    setControls()
    {
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    }

    setPhysics()
    {
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.gravity.y = 500;
        this.body.maxVelocity.y = 500;
        this.body.bounce.y = 0.1;
        this.body.collideWorldBounds = true;
    }

    setAnimation(animation='idle')
    {
        this.animations.play(animation);
        this.facing = animation;
    }

    damage(amount)
    {
        super.damage(amount);
    }

}
