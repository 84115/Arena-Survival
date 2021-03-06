import Player from 'objects/Player';
import Proximity from 'objects/Proximity';
import Enemy from 'objects/Enemy';
import BouncingBall from 'objects/BouncingBall';
import TileBreakable from 'objects/TileBreakable';
import TileFallable from 'objects/TileFallable';
import CAVE from 'enums/cave';

export default class TilemapMergedState extends Phaser.State
{

    preload()
    {
        this.game.load.tilemap('map', 'tile/omega-compiled.csv', null, Phaser.Tilemap.CSV);
        this.game.load.image('tiles', 'tile/omega.png');

        this.game.stage.backgroundColor = '#000';
    }

    create()
    {
        // Because we're loading CSV map
        // data we have to specify the tile
        // size here or we can't render it
        this.map = this.game.add.tilemap(
            'map',
            this.game.screen.getTileSize(),
            this.game.screen.getTileSize()
        );

        // Now add in the tileset
        this.map.addTilesetImage('tiles');

        // Create our layer
        this.layer = this.map.createLayer(0);

        // Resize the worldd
        this.layer.resizeWorld();



        // Collisions
        this.map.setCollisionByExclusion([
            CAVE.BLANK,
            CAVE.LADDER,
            CAVE.WATER.DEFAULT,
            CAVE.WATER.CEILING,
            CAVE.STONE.BREAKABLE,
            CAVE.BRICK,
            CAVE.POWERUP.DEFAULT
        ], true);



        // Replace Breakable Tile With Sprite
        this.breakable = this.game.add.group();
        this.fallable = this.game.add.group();



        // Player
        this.player = new Player(this.game,
            this.game.screen.getCentre(),
            this.game.screen.getCentre(),
            'dude_sheet'
        );

        this.bat = new Enemy(
            this.game,
            this.game.screen.offsetByTiles(this.player.body.x, 4),
            this.game.screen.offsetByTiles(this.player.body.y, 4),
            'dude_sheet'
        );


        this.balls = this.game.add.group();
        for (var i = 0; i < 50; i++)
        {
            this.balls.add(new BouncingBall(
                this,
                this.game.world.randomX,
                this.game.world.randomY
            ));
        }



        // Camera
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);



        // Proximity
        this.proximity = new Proximity(this.game, this.player);
        this.proximity.debug = true;

        // Debug
        // this.layer.debug = true;
    }

    update()
    {
        let physics = this.game.physics.arcade;

        physics.collide(this.player, this.layer);
        physics.collide(this.player, this.breakable);
        physics.collide(this.fallable, this.layer);
        physics.collide(this.player.weapon.bullets, this.layer);

        physics.overlap(this.player, this.layer, this.overlapPlayerLayer);
        // physics.collide(this.player, this.layer, this.collidePlayerLayer);
        physics.overlap(this.player.weapon.bullets, this.breakable, this.player.destroyB, null, this);
        physics.overlap(this.proximity, this.layer, this.replaceTilesWithSprite, null, this);

        physics.collide(this.player, this.bat, this.player.destroyB, null, this);

        physics.collide(this.player, this.fallable, this.player.killA, null, this);

        physics.overlap(this.player.weapon.bullets, this.enemy, this.player.destroyAB, null, this);

        if (this.bat.alive)
        {
            physics.moveToXY(this.bat, this.player.body.x, this.player.body.y - 128, 100, 600);
        }

        physics.collide(this.balls, this.layer);
    }

    overlapPlayerLayer(player, layer)
    {
        let index = layer.index;

        switch (index) {
            default: 
                player.control_mode = 'default';
                break;
            case CAVE.LADDER:
                player.control_mode = 'climb';
                break;
            case CAVE.WATER.DEFAULT:
            case CAVE.WATER.CEILING:
                player.control_mode = 'swim';
                break;
            case CAVE.POWERUP.DEFAULT:
                if (layer.alpha != 0.1) {
                    layer.alpha = 0.1;
                    player.weapon.fireRate += 2000;
                    console.log("fire is now " + player.weapon.fireRate);
                }
                break;
            case CAVE.SPIKE.CEILING.DEFAULT:
            case CAVE.SPIKE.CEILING.LEFT:
            case CAVE.SPIKE.CEILING.RIGHT:
            case CAVE.SPIKE.CEILING.BOTH:
            case CAVE.SPIKE.FLOOR.DEFAULT:
            case CAVE.SPIKE.FLOOR.LEFT:
            case CAVE.SPIKE.FLOOR.RIGHT:
            case CAVE.SPIKE.FLOOR.BOTH:
                console.log(1);
                player.kill();
                break;
        }

    }

    collidePlayerLayer(player, layer)
    {
        let index = layer.index;

        switch (index) {
            default: 
                break;
            case CAVE.SPIKE.CEILING.DEFAULT:
            case CAVE.SPIKE.CEILING.LEFT:
            case CAVE.SPIKE.CEILING.RIGHT:
            case CAVE.SPIKE.CEILING.BOTH:
            case CAVE.SPIKE.FLOOR.DEFAULT:
            case CAVE.SPIKE.FLOOR.LEFT:
            case CAVE.SPIKE.FLOOR.RIGHT:
            case CAVE.SPIKE.FLOOR.BOTH:
                console.log(1);
                player.kill();
                break;
        }

    }

    replaceTilesWithSprite(proximity, layer)
    {
        if (layer.index == CAVE.STONE.BREAKABLE)
        {
            if (layer.alpha != 0.4)
            {
                layer.alpha = 0.4;

                this.breakable.add(new TileBreakable(this.game, this.game.screen.toTileCoordinate(layer.x), this.game.screen.toTileCoordinate(layer.y), 'stone-breakable'));
            }
        }
        else if (layer.index == CAVE.STONE.FALLABLE)
        {
            if (layer.alpha != 0.5)
            {
                layer.alpha = 0.5;

                this.fallable.add(new TileFallable(this.game, this.game.screen.toTileCoordinate(layer.x), this.game.screen.toTileCoordinate(layer.y), 'stone-breakable'));
            }
        }
    }

}
