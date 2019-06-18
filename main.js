var config = {
    type: Phaser.AUTO,
    width: 1366,
    height: 768,
    parent: 'game',
    backgroundColor: '#45b1d5',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player1;
var player2;
var tool1;
var tool2;
var tool3;

var bomb1;
var bomb2;
var jump1;
var jump2;

var platforms;
var cursors;
var score = 0;
var gameOver = true;
var timeText;
var player2KeyUp;
var player2KeyDown;
var player2KeyLeft;
var player2KeyRight;
var game;
var Game = '';
var flashCD = 6;
var player1InitialSpeed = 190;
var player2InitialSpeed = 190;
var velocitySpeed = 260;
var bombTime = 120;
var disableChangeTime = 0;
var canChangeBomb = true;
var dazhaoTime = 6;
var player1FlashCDText;
var player2FlashCDText;
var player1FlashCDTextBg;
var player2FlashCDTextBg;
var player1InitX;
var player1InitY;
var player2InitX;
var player2InitY;
var playerPosHistroy = {
    player1: {
    },
    player2: {
    }
};
var graphics1;
var graphics2;
var currentTime;
var roll1;
var roll2;
var disappearTime = 7;
var dazhaoCount = 2;
var curTimeStamp = 0;
var holeCount = 0;
var holeObj = 0;

startGame();

function startGame() {
    game = new Phaser.Game(config);
}

function getTime(time) {
    var min = Math.floor(time / 60);
    var sec = Math.floor(time - min * 60);
    var msec = parseInt((time - min * 60 - sec).toFixed(2) * 100);

    sec = sec < 10 ? '0' + sec : sec;
    msec = msec < 10 ? '0' + msec : msec;
    return min + ':' + sec + ':' + msec;
}

function preload() {
    this.load.image('ground', 'assets/bg.jpg');
    this.load.image('rush', 'assets/rush_skill.png');
    this.load.image('catch', 'assets/catch_skill.png');
    this.load.image('dazhao', 'assets/dazhao_skill.png');
    this.load.image('rush_box', 'assets/rush.png');
    this.load.image('catch_box', 'assets/catch.png');
    this.load.image('dazhao_box', 'assets/dazhao.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('round', 'assets/round.png');
    this.load.image('jump', 'assets/jump_skill.png');
    this.load.spritesheet('bomb_ani', 'assets/bomb_ani.png', {
        frameWidth: 230,
        frameHeight: 140
    });
    this.load.spritesheet('round_active', 'assets/round_active.png', {
        frameWidth: 141,
        frameHeight: 114
    });
    this.load.spritesheet('hole', 'assets/hole.png', {
        frameWidth: 95,
        frameHeight: 164
    });
    this.load.spritesheet('show_player', 'assets/show_player.png', {
        frameWidth: 100,
        frameHeight: 250
    });
    this.load.spritesheet('roll', 'assets/roll.png', {
        frameWidth: 105,
        frameHeight: 80
    });
    this.load.spritesheet('player1', 'assets/player1.png', {
        frameWidth: 60,
        frameHeight: 90
    });
    this.load.spritesheet('player1_bomb', 'assets/player1_bomb.png', {
        frameWidth: 100,
        frameHeight: 90
    });
    this.load.spritesheet('player2_h', 'assets/player2_h.png', {
        frameWidth: 65,
        frameHeight: 90
    });
    this.load.spritesheet('player2_v', 'assets/player2_v.png', {
        frameWidth: 79,
        frameHeight: 90
    });
    this.load.spritesheet('player2_b', 'assets/player2_b.png', {
        frameWidth: 65,
        frameHeight: 90
    });
    this.load.spritesheet('player2_bomb_h', 'assets/player2_bomb_h.png', {
        frameWidth: 125,
        frameHeight: 90
    });
    this.load.spritesheet('player2_bomb_v', 'assets/player2_bomb_v.png', {
        frameWidth: 105,
        frameHeight: 90
    });
    this.load.spritesheet('player2_bomb_b', 'assets/player2_bomb_b.png', {
        frameWidth: 105,
        frameHeight: 90
    });
    this.load.spritesheet('set', 'assets/set.png', {
        frameWidth: 200,
        frameHeight: 200
    });
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min; 
}

function getRandomData() {
    player1InitX = getRandomArbitrary(50, config.height - 150);
    player1InitY = getRandomArbitrary(240, config.height - 50);

    player2InitX = getRandomArbitrary(config.width / 2, config.width - 60);
    player2InitY = getRandomArbitrary(240, config.height - 50);
}

function create() {
    getRandomData();
    Game = this;
    this.physics.world.bounds.top = 250;
    //  A simple background for our game
    this.physics.add.sprite(683, 384, 'ground').depth = -3;

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)

    //  Now let's create some ledges
    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(750, 220, 'ground');

    // The player and its settings
    player1 = this.physics.add.sprite(player1InitX, player1InitY, 'player1');
    player2 = this.physics.add.sprite(player2InitX, player2InitY, 'player2_b');

    player1.tool1Effect1 = this.physics.add.sprite(player1InitX, player1InitY, 'player1');
    player1.tool1Effect2 = this.physics.add.sprite(player1InitX, player1InitY, 'player1');
    player1.tool1Effect3 = this.physics.add.sprite(player1InitX, player1InitY, 'player1');
    player1.tool1Effect1.setAlpha(0.8);
    player1.tool1Effect1.depth = -1;
    player1.tool1Effect2.setAlpha(0.5);
    player1.tool1Effect2.depth = -2;
    player1.tool1Effect3.setAlpha(0.3);
    player1.tool1Effect3.depth = -2;
    toolEffectVisible(player1, false);

    player1.pastPlayer = this.physics.add.sprite(player1InitX, player1InitY, 'player1');
    player1.pastPlayer.visible = false;
    player1.pastPlayer.depth = -1;
    player1.pastPlayer.setAlpha(0.7);

    player2.tool1Effect1 = this.physics.add.sprite(player2InitX, player2InitY, 'player2_b');
    player2.tool1Effect2 = this.physics.add.sprite(player2InitX, player2InitY, 'player2_b');
    player2.tool1Effect3 = this.physics.add.sprite(player2InitX, player2InitY, 'player2_b');
    player2.tool1Effect1.setAlpha(0.8);
    player2.tool1Effect1.depth = -1;
    player2.tool1Effect2.setAlpha(0.5);
    player2.tool1Effect2.depth = -2;
    player2.tool1Effect3.setAlpha(0.3);
    player2.tool1Effect3.depth = -2;
    toolEffectVisible(player2, false);

    player2.pastPlayer = this.physics.add.sprite(player2InitX, player2InitY, 'player2_b');
    player2.pastPlayer.visible = false;
    player2.pastPlayer.setAlpha(0.7);
    player2.pastPlayer.depth = -1;
    //  Player physics properties. Give the little guy a slight bounce.
    player1.initialSpeed = 160;
    player2.initialSpeed = 160;
    player1.canMove = true;
    player2.canMove = true;
    player1.name = 'player1';
    player2.name = 'player2';
    player1.flashCD = 0;
    player2.flashCD = 0;
    player1.setBounce(0.2);
    player1.setCollideWorldBounds(true);
    player2.setBounce(0.2);
    player2.setCollideWorldBounds(true);
    player1.package = {
        tool1: 0,
        tool2: 0,
        tool3: 0,
    };
    player1.tool1Pos = [80, 30];
    player1.tool2Pos = [130, 30];
    player1.tool3Pos = [180, 30];

    player1.normalAni = {
        left: 'left',
        right: 'right',
        up: 'up',
        down: 'down',
        breath: 'breath'
    };

    player1.bombAni = {
        left: 'left_b',
        right: 'right_b',
        up: 'up_b',
        down: 'down_b',
        breath: 'breath_b'
    };

    player2.normalAni = {
        left: 'left2',
        right: 'right2',
        up: 'up2',
        down: 'down2',
        breath: 'breath2'
    };

    player2.bombAni = {
        left: 'left2_b',
        right: 'right2_b',
        up: 'up2_b',
        down: 'down2_b',
        breath: 'breath2_b'
    };

    player1.curAni = player1.normalAni;
    player2.curAni = player2.normalAni;

    player2.package = {
        tool1: 0,
        tool2: 0,
        tool3: 0,
    };

    player2.tool1Pos = [1230, 30];
    player2.tool2Pos = [1280, 30];
    player2.tool3Pos = [1330, 32];

    player1.bombTexture = 'player1_bomb';
    player2.bombTexture = 'player2_bomb_b';

    player1.normalTexture = 'player1';
    player2.normalTexture = 'player2_b';

    player1.hasBomb = false;
    player2.hasBomb = false;

    setBomb(getRandomArbitrary(1, 10) > 5.5 ? player1 : player2);
    jump1 = this.physics.add.sprite(30, 30, 'jump');

    jump2 = this.physics.add.sprite(1180, 30, 'jump');

    bomb1 = this.physics.add.sprite(100, 430, 'bomb');
    bomb2 = this.physics.add.sprite(500, 430, 'bomb');
    bomb1.visible = false;
    bomb2.visible = false;

    player1.roll = this.physics.add.sprite(player1InitX, player1InitY, 'roll');
    player2.roll = this.physics.add.sprite(player2InitX, player2InitY, 'roll');

    player1.roll.visible = false;
    player2.roll.visible = false;
    player1.toolFKeyText = this.add.text(20, 60, 'J', {
        fontSize: '20px',
        fill: '#fff'
    });
    player2.toolFKeyText = this.add.text(1170, 60, '1', {
        fontSize: '20px',
        fill: '#fff'
    });
    player1.tool1Package = this.physics.add.sprite(player1.tool1Pos[0], player1.tool1Pos[1], 'rush');
    player1.tool2Package = this.physics.add.sprite(player1.tool2Pos[0], player1.tool2Pos[1], 'catch');
    player1.tool3Package = this.physics.add.sprite(player1.tool3Pos[0], player1.tool3Pos[1], 'dazhao');

    drawCircle(player1.tool1Pos[0] + 20, player1.tool1Pos[1] - 20, 10,'0x4d11af', 0.75);
    player1.tool1NumText = this.add.text(player1.tool1Pos[0] + 15, player1.tool1Pos[1] - 30, 0, {
        fontSize: '20px',
        fill: '#fff'
    });
    player1.tool1KeyText = this.add.text(player1.tool1Pos[0] - 5, player1.tool1Pos[1] + 30, 'K', {
        fontSize: '20px',
        fill: '#fff'
    });
    drawCircle(player1.tool2Pos[0] + 20, player1.tool2Pos[1] - 20, 10,'0x4d11af', 0.75);
    player1.tool2NumText = this.add.text(player1.tool2Pos[0] + 15, player1.tool2Pos[1] - 30, 0, {
        fontSize: '20px',
        fill: '#fff'
    });
    player1.tool2KeyText = this.add.text(player1.tool2Pos[0] - 5, player1.tool2Pos[1] + 30, 'L', {
        fontSize: '20px',
        fill: '#fff'
    });
    drawCircle(player1.tool3Pos[0] + 20, player1.tool3Pos[1] - 20, 10,'0x4d11af', 0.75);
    player1.tool3NumText = this.add.text(player1.tool3Pos[0] + 15, player1.tool3Pos[1] - 30, 0, {
        fontSize: '20px',
        fill: '#fff'
    });
    player1.tool3KeyText = this.add.text(player1.tool3Pos[0] - 5, player1.tool3Pos[1] + 30, 'N', {
        fontSize: '20px',
        fill: '#fff'
    });
    player2.tool1Package = this.physics.add.sprite(player2.tool1Pos[0], player2.tool1Pos[1], 'rush');
    player2.tool2Package = this.physics.add.sprite(player2.tool2Pos[0], player2.tool2Pos[1], 'catch');
    player2.tool3Package = this.physics.add.sprite(player2.tool3Pos[0], player2.tool3Pos[1], 'dazhao');

    drawCircle(player2.tool1Pos[0] + 20, player2.tool1Pos[1] - 20, 10,'0x4d11af', 0.75);
    player2.tool1NumText = this.add.text(player2.tool1Pos[0] + 15, player2.tool1Pos[1] - 30, 0, {
        fontSize: '20px',
        fill: '#fff'
    });
    player2.tool1KeyText = this.add.text(player2.tool1Pos[0] - 5, player2.tool1Pos[1] + 30, '2', {
        fontSize: '20px',
        fill: '#fff'
    });
    drawCircle(player2.tool2Pos[0] + 20, player2.tool2Pos[1] - 20, 10,'0x4d11af', 0.75);
    player2.tool2NumText = this.add.text(player2.tool2Pos[0] + 15, player2.tool2Pos[1] - 30, 0, {
        fontSize: '20px',
        fill: '#fff'
    });
    player2.tool2KeyText = this.add.text(player2.tool2Pos[0] - 5, player2.tool2Pos[1] + 30, '3', {
        fontSize: '20px',
        fill: '#fff'
    });
    drawCircle(player2.tool3Pos[0] + 20, player2.tool3Pos[1] - 20, 10,'0x4d11af', 0.75);
    player2.tool3NumText = this.add.text(player2.tool3Pos[0] + 15, player2.tool3Pos[1] - 30, 0, {
        fontSize: '20px',
        fill: '#fff'
    });
    player2.tool3KeyText = this.add.text(player2.tool3Pos[0] - 5, player2.tool3Pos[1] + 30, '0', {
        fontSize: '20px',
        fill: '#fff'
    });
    this.anims.create({
        key: 'bomb_ani',
        frames: this.anims.generateFrameNumbers('bomb_ani', {
            start: 0,
            end: 7
        }),
        frameRate: 10,
        repeat: 0
    });
    this.anims.create({
        key: 'round_active',
        frames: this.anims.generateFrameNumbers('round_active', {
            start: 0,
            end: 5
        }),
        frameRate: 10,
        repeat: 2
    });
    this.anims.create({
        key: 'show_player',
        frames: this.anims.generateFrameNumbers('show_player', {
            start: 0,
            end: 9
        }),
        frameRate: 10,
        repeat: 0
    });
    this.anims.create({
        key: 'hole',
        frames: this.anims.generateFrameNumbers('hole', {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'roll_up',
        frames: this.anims.generateFrameNumbers('roll', {
            start: 0,
            end: 4
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'roll_down',
        frames: this.anims.generateFrameNumbers('roll', {
            start: 5,
            end: 9
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'roll_left',
        frames: this.anims.generateFrameNumbers('roll', {
            start: 10,
            end: 14
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'roll_right',
        frames: this.anims.generateFrameNumbers('roll', {
            start: 15,
            end: 19
        }),
        frameRate: 10,
        repeat: -1
    });

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player1', {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('player1', {
            start: 4,
            end: 7
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player1', {
            start: 8,
            end: 11
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player1', {
            start: 12,
            end: 15
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'breath',
        frames: this.anims.generateFrameNumbers('player1', {
            start: 16,
            end: 22
        }),
        frameRate: 10,
        repeat: -1
    });

        //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'up_b',
        frames: this.anims.generateFrameNumbers('player1_bomb', {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'down_b',
        frames: this.anims.generateFrameNumbers('player1_bomb', {
            start: 4,
            end: 7
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'left_b',
        frames: this.anims.generateFrameNumbers('player1_bomb', {
            start: 8,
            end: 11
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right_b',
        frames: this.anims.generateFrameNumbers('player1_bomb', {
            start: 12,
            end: 15
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'breath_b',
        frames: this.anims.generateFrameNumbers('player1_bomb', {
            start: 16,
            end: 22
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up2',
        frames: this.anims.generateFrameNumbers('player2_h', {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'down2',
        frames: this.anims.generateFrameNumbers('player2_h', {
            start: 4,
            end: 7
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'left2',
        frames: this.anims.generateFrameNumbers('player2_v', {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right2',
        frames: this.anims.generateFrameNumbers('player2_v', {
            start: 4,
            end: 7
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'breath2',
        frames: this.anims.generateFrameNumbers('player2_b', {
            start: 0,
            end: 6
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up2_b',
        frames: this.anims.generateFrameNumbers('player2_bomb_v', {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'down2_b',
        frames: this.anims.generateFrameNumbers('player2_bomb_v', {
            start: 4,
            end: 7
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'left2_b',
        frames: this.anims.generateFrameNumbers('player2_bomb_h', {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right2_b',
        frames: this.anims.generateFrameNumbers('player2_bomb_h', {
            start: 4,
            end: 7
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'breath2_b',
        frames: this.anims.generateFrameNumbers('player2_bomb_b', {
            start: 0,
            end: 6
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'set_ani',
        frames: this.anims.generateFrameNumbers('set', {
            start: 0,
            end: 13
        }),
        frameRate: 10,
        repeat: 0
    });
    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    player1KeyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    player1KeyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    player1KeyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    player1KeyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    player1KeyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    player1Key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    player1Key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    player1Key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);

    player2Key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO);
    player2Key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE);
    player2Key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO);
    player2KeyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE);

    bombs = this.physics.add.group();

    this.add.text(560, 106, '定时炸弹', {
        fontSize: '16px',
        fill: '#fff',
    });

    //  The score
    timeText = this.add.text(630, 96, getTime(bombTime), {
        fontSize: '32px',
        fill: '#fff',
        fontWeight: 'bold'
    });

    graphics1 = this.add.graphics();
    graphics2 = this.add.graphics();

    graphics1.fillStyle(0x000000, 0.6);
    graphics2.fillStyle(0x000000, 0.6);

    //  32px radius on the corners
    player1FlashCDTextBg = graphics1.fillRoundedRect(10, 10, 40, 40, 4);

    player2FlashCDTextBg = graphics2.fillRoundedRect(1160, 10, 40, 40, 4);

    player1FlashCDTextBg.visible = false;
    player2FlashCDTextBg.visible = false;

    player1FlashCDText = this.add.text(23, 20, 10, {
        fontSize: '24px',
        fill: '#fff',
        fontWeight: 'bold'
    });
    player2FlashCDText = this.add.text(jump2.x - 8, jump2.y - 12, 10, {
        fontSize: '24px',
        fill: '#fff',
        fontWeight: 'bold'
    });
    player1FlashCDText.depth = 1;
    player2FlashCDText.depth = 1;
    player1FlashCDText.visible = false;
    player2FlashCDText.visible = false;
    //  Collide the player and the stars with the platforms
    // this.physics.add.collider(player, platforms);
    // this.physics.add.collider(stars, platforms);
    // this.physics.add.collider(bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    // this.physics.add.overlap(player1, tool2, collectTool2, null, this);
    // this.physics.add.overlap(player1, tool3, collectTool3, null, this);

    // this.physics.add.overlap(player2, tool2, collectTool2, null, this);
    // this.physics.add.overlap(player2, tool3, collectTool3, null, this);
    // this.physics.add.overlap(player1, star3, collectTool1, null, this);

    this.physics.add.collider(player1, player2, hit, null, this);

}

function drawCircle(x, y, r, color, alpha) {
    var graphics = Game.add.graphics();
    graphics.fillStyle(color, alpha);
    graphics.arc(x, y, r, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(360), false, 0.02);
    graphics.fillPath();
}
function randomSetTool() {
    var time = getRandomArbitrary(3, 6);
    var setDazhao = getRandomArbitrary(1, 100) > 95 ? true : false;
    var setHole = getRandomArbitrary(1, 100) > 50 ? true : false;

    var canSetDazhaoTime = false;
    var canSetHoleTime = true;

    if (currentTime < bombTime / 2) {
        canSetDazhaoTime = true;
        // canSetHoleTime = true;
    }
    if (currentTime < bombTime / 2 && dazhaoCount === 2) {
        dazhaoCount--;
        setDazhao = true;
        canSetDazhaoTime = true;
    }
    if (currentTime < bombTime / 6 && dazhaoCount === 1) {
        dazhaoCount--;
        setDazhao = true;
        canSetDazhaoTime = true;
    }

    Game.time.delayedCall(time * 1000, function() {
        if (setDazhao && canSetDazhaoTime) {
            setTool3(getRandomArbitrary(60, config.width - 60), getRandomArbitrary(300, config.height - 60));
        }
        if (setHole && canSetHoleTime && holeCount === 0) {
            setHoleTool(getRandomArbitrary(60, config.width - 60), getRandomArbitrary(300, config.height - 60));
            holeCount++;
        }
        setTool1(getRandomArbitrary(60, config.width - 60), getRandomArbitrary(300, config.height - 60));
        setTool2(getRandomArbitrary(60, config.width - 60), getRandomArbitrary(300, config.height - 60));

        if (!gameOver) {
            randomSetTool();
        }
    }, [], Game);
}

function setHoleTool(x, y) {
    holeObj = Game.add.sprite(x, y, 'hole');
    holeObj.depth = -2;
    holeObj.anims.play('hole');
}

function showAni(x, y) {
    var ani = Game.add.sprite(x, y - 50, 'set');
    ani.on('animationcomplete', function() {
        ani.destroy();
    }, this);
    ani.anims.play('set_ani');
}

function setTool1(x, y) {
    showAni(x, y);

    var tool1 = Game.physics.add.sprite(x, y, 'rush_box');

    tool1.name = 'too1';
    tool1.setAlpha(0);
    tool1.depth = -1;
    fadeInTool(tool1, function() {});
    Game.physics.add.overlap(player1, tool1, collectTool1, null, Game);
    Game.physics.add.overlap(player2, tool1, collectTool1, null, Game);
    Game.time.delayedCall(disappearTime * 1000, function() {
       disappearTool(tool1);
    }, [], Game);
}

function setTool2(x, y) {
    showAni(x, y);
    
    var tool2 = Game.physics.add.sprite(x, y, 'catch_box');

    tool2.name = 'too2';
    tool2.setAlpha(0);
    tool2.depth = -1;
    fadeInTool(tool2, function() {});
    Game.physics.add.overlap(player1, tool2, collectTool2, null, Game);
    Game.physics.add.overlap(player2, tool2, collectTool2, null, Game);
    Game.time.delayedCall(disappearTime * 1000, function() {
       disappearTool(tool2);
    }, [], Game);
}

function setTool3(x, y) {
    showAni(x, y);

    var tool3 = Game.physics.add.sprite(x, y, 'dazhao_box');

    tool3.name = 'tool3';
    tool3.setAlpha(0);
    tool3.depth = -1;
    fadeInTool(tool3, function() {});
    Game.physics.add.overlap(player1, tool3, collectTool3, null, Game);
    Game.physics.add.overlap(player2, tool3, collectTool3, null, Game);
    Game.time.delayedCall(disappearTime * 1000, function() {
       disappearTool(tool3);
    }, [], Game);
}

function fadeInTool(tool, callback) {
    Game.tweens.add({
        targets: tool,
        alpha: 1,
        ease: 'Power1',
        duration: 2000,
        yoyo: false,
        repeat: 0,
        onStart: function () {},
        onComplete: function () {
            callback();
        },
        onYoyo: function () {},
        onRepeat: function () {},
    });
}

function disappearTool(tool) {
    Game.tweens.add({
        targets: tool,
        alpha: 0,
        ease: 'Power1',
        duration: 500,
        yoyo: false,
        repeat: 0,
        onStart: function () {},
        onComplete: function () {
            tool.destroy();
        },
        onYoyo: function () {},
        onRepeat: function () {},
    });
}
function setBomb(player) {
    player.hasBomb = true;
    player.setTexture(player.bombTexture);
    player.curAni = player.bombAni;
}

function removeBomb(player) {
    player.hasBomb = false;
    player.setTexture(player.normalTexture);
    player.curAni = player.normalAni;
}
function updatePastPlayer(player, curTime) {
    if (player.pastPlayer.visible) {
        var time = parseFloat(curTime.toFixed(1)) + 6 > bombTime ? bombTime : parseFloat(curTime.toFixed(1)) + 6;
        
        if (!playerPosHistroy[player.name][time]) {
            time += 0.1;
        }
        try {
            player.pastPlayer.x = playerPosHistroy[player.name][time].x;
            player.pastPlayer.y = playerPosHistroy[player.name][time].y;
            player.pastPlayer.anims.play(playerPosHistroy[player.name][time].ani[playerPosHistroy[player.name][time].direction || 'breath'], true);
        }catch(e) {
        }
        
        // if (playerPosHistroy[player.name][time].direction === 'left') {
        //     player.pastPlayer.setVelocityY(0);
        //     player.pastPlayer.setVelocityX(-playerPosHistroy[player.name][time].speed);
        // }else if(playerPosHistroy[player.name][time].direction === 'right') {
        //     player.pastPlayer.setVelocityY(0);
        //     player.pastPlayer.setVelocityX(playerPosHistroy[player.name][time].speed);
        // }else if(playerPosHistroy[player.name][time].direction === 'up') {
        //     player.pastPlayer.setVelocityX(0);
        //     player.pastPlayer.setVelocityY(-playerPosHistroy[player.name][time].speed);
        // }else if(playerPosHistroy[player.name][time].direction === 'down') {
        //     player.pastPlayer.setVelocityX(0);
        //     player.pastPlayer.setVelocityY(playerPosHistroy[player.name][time].speed);
        // }else {
        //     player.pastPlayer.setVelocityX(0);
        //     player.pastPlayer.setVelocityY(0);
        // }
    }
}
function judgeResult() {
    if (currentTime < 0.1) {
        gameOver = true;
        timeText.text = '0:00:00';
        if (player1.hasBomb) {
            Game.add.sprite(player1.x, player1.y, 'bomb_ani').anims.play('bomb_ani');
            player1.visible = false;
            document.getElementsByClassName('result-page2')[0].style.display = 'block';
        }else {
            Game.add.sprite(player2.x, player2.y, 'bomb_ani').anims.play('bomb_ani');
            player2.visible = false;
            document.getElementsByClassName('result-page1')[0].style.display = 'block';
        }
    }
}
function isInHole(player) {
    var x = Math.abs(player.x - holeObj.x);
    var y = Math.abs(player.y - holeObj.y);

    if (Math.sqrt(x * x + y * y) <= 40) {
        disappearTool(holeObj);
        holeCount = 0;
        showHolePlayer(player);
    }
}

function getShowPos(name) {
    if (name === 'player1') {
        return getPlayerNearPos(player2)
    }else {
        return getPlayerNearPos(player1)
    }
}

function getPlayerNearPos(player) {
    var x = player.x + 150;
    var y = player.y + 150;

    x = x > 1366 ? 1300 : x;
    y = y > 750 ? 700 : y;

    return {
        x: x,
        y: y
    }
}

function showHolePlayer(player) {
    var showPos = getShowPos(player.name);
    player.visible = false;
    var ani = Game.add.sprite(showPos.x, showPos.y, 'show_player');
    ani.depth = -1;
    ani.on('animationcomplete', function() {
        ani.destroy();
        player.x = showPos.x;
        player.y = showPos.y + 50;
        player.visible = true;
    }, this);
    ani.anims.play('show_player');
}

function update() {
    if (gameOver) {
        return;
    }

    if (curTimeStamp) {
        var date = +new Date();
        var curTime = parseFloat(((bombTime * 1000 - (date - curTimeStamp)) / 1000).toFixed(2));
    }else {
        curTimeStamp = +new Date();
        var curTime = bombTime;
    }

    currentTime = curTime;

    // var curTime = bombTime - (this.sys.game.loop.time.toString() / 1000).toFixed(2);
    // currentTime = curTime;
    recordPlayerPos(curTime);
    timeText.setText(getTime(curTime));
    updatePastPlayer(player1, curTime);
    updatePastPlayer(player2, curTime);

    if (canChangeBomb) {
        isInBombRange(curTime);
    }

    isInHole(player1);
    isInHole(player2);

    judgeResult();
    // if (disableChangeTime - (bombTime - (this.sys.game.loop.time.toString() / 1000).toFixed(2)) > 2) {
    //     canChangeBomb = true;
    // }



    if (cursors.left.isDown) {
        resetTool1Effect(player2);
        player2.tool1Effect1.y = player2.y;
        player2.tool1Effect2.y = player2.y;
        player2.tool1Effect3.y = player2.y;
        player2.tool1Effect1.x = player2.x + 10;
        player2.tool1Effect2.x = player2.x + 23;
        player2.tool1Effect3.x = player2.x + 39;
        setVelocityY(player2, 0);
        setVelocityX(player2, -player2.initialSpeed);
        player2.keyDown = 'left';
        player2.anims.play(player2.curAni.left, true);
        player2.tool1Effect1.anims.play(player2.curAni.left, true);
        player2.tool1Effect2.anims.play(player2.curAni.left, true);
        player2.tool1Effect3.anims.play(player2.curAni.left, true);

    } else if(cursors.right.isDown) {
        player2.tool1Effect1.y = player2.y;
        player2.tool1Effect2.y = player2.y;
        player2.tool1Effect3.y = player2.y;
        player2.tool1Effect1.x = player2.x - 10;
        player2.tool1Effect2.x = player2.x - 23;
        player2.tool1Effect3.x = player2.x - 39;
        setVelocityY(player2, 0);
        setVelocityX(player2, player2.initialSpeed);
        // bomb2.setVelocityX(player2.initialSpeed);
        player2.keyDown = 'right';
        player2.anims.play(player2.curAni.right, true);
        player2.tool1Effect1.anims.play(player2.curAni.right, true);
        player2.tool1Effect2.anims.play(player2.curAni.right, true);
        player2.tool1Effect3.anims.play(player2.curAni.right, true);
    } else if (cursors.up.isDown) {
        resetTool1Effect(player2);
        player2.tool1Effect1.x = player2.x;
        player2.tool1Effect2.x = player2.x;
        player2.tool1Effect3.x = player2.x;
        player2.tool1Effect1.y = player2.y + 10;
        player2.tool1Effect2.y = player2.y + 23;
        player2.tool1Effect3.y = player2.y + 39;
        setVelocityX(player2, 0);
        setVelocityY(player2, -player2.initialSpeed);
        // bomb2.setVelocityY(-player2.initialSpeed);
        player2.keyDown = 'up';
        player2.anims.play(player2.curAni.up, true);
        player2.tool1Effect1.anims.play(player2.curAni.up, true);
        player2.tool1Effect2.anims.play(player2.curAni.up, true);
        player2.tool1Effect3.anims.play(player2.curAni.up, true);
    }  else if (cursors.down.isDown) {
        resetTool1Effect(player2);
        player2.tool1Effect1.x = player2.x;
        player2.tool1Effect2.x = player2.x;
        player2.tool1Effect3.x = player2.x;
        player2.tool1Effect1.y = player2.y - 10;
        player2.tool1Effect2.y = player2.y - 23;
        player2.tool1Effect3.y = player2.y - 39;
        setVelocityX(player2, 0);
        setVelocityY(player2, player2.initialSpeed);
        // bomb2.setVelocityY(player2.initialSpeed);
        player2.keyDown = 'down';
        player2.anims.play(player2.curAni.down, true);
        player2.tool1Effect1.anims.play(player2.curAni.down, true);
        player2.tool1Effect2.anims.play(player2.curAni.down, true);
        player2.tool1Effect3.anims.play(player2.curAni.down, true);
    } else {
        resetPlayerY(player2);
        resetPlayerX(player2);
        resetTool1Effect(player2);
        player2.anims.play(player2.curAni.breath, true);
        player2.tool1Effect1.anims.play(player2.curAni.breath, true);
        player2.tool1Effect2.anims.play(player2.curAni.breath, true);
        player2.tool1Effect3.anims.play(player2.curAni.breath, true);
    }

    if (player1KeyLeft.isDown) {
        resetTool1Effect(player1);
        player2.tool1Effect1.y = player2.y;
        player2.tool1Effect2.y = player2.y;
        player2.tool1Effect3.y = player2.y;
        player1.tool1Effect1.x = player1.x + 10;
        player1.tool1Effect2.x = player1.x + 23;
        player1.tool1Effect3.x = player1.x + 39;
        setVelocityY(player1, 0);
        setVelocityX(player1, -player1.initialSpeed);
        // bomb2.setVelocityX(-player2.initialSpeed);
        player1.keyDown = 'left';
        player1.anims.play(player1.curAni.left, true);
        player1.tool1Effect1.anims.play(player1.curAni.left, true);
        player1.tool1Effect2.anims.play(player1.curAni.left, true);
        player1.tool1Effect3.anims.play(player1.curAni.left, true);

    } else if(player1KeyRight.isDown) {
        resetTool1Effect(player1);
        player2.tool1Effect1.y = player2.y;
        player2.tool1Effect2.y = player2.y;
        player2.tool1Effect3.y = player2.y;
        player1.tool1Effect1.x = player1.x - 10;
        player1.tool1Effect2.x = player1.x - 23;
        player1.tool1Effect3.x = player1.x - 39;
        setVelocityY(player1, 0);
        setVelocityX(player1, player1.initialSpeed);

        // bomb1.setVelocityX(player2.initialSpeed);
        player1.keyDown = 'right';
        player1.anims.play(player1.curAni.right, true);
        player1.tool1Effect1.anims.play(player1.curAni.right, true);
        player1.tool1Effect2.anims.play(player1.curAni.right, true);
        player1.tool1Effect3.anims.play(player1.curAni.right, true);
    } else if (player1KeyUp.isDown) {
        resetTool1Effect(player1);
        player2.tool1Effect1.x = player2.x;
        player2.tool1Effect2.x = player2.x;
        player2.tool1Effect3.x = player2.x;
        player1.tool1Effect1.y = player1.y + 10;
        player1.tool1Effect2.y = player1.y + 25;
        player1.tool1Effect3.y = player1.y + 25;
        setVelocityX(player1, 0);
        setVelocityY(player1, -player1.initialSpeed);
        // bomb1.setVelocityY(-player1.initialSpeed);
        player1.keyDown = 'up';
        player1.anims.play(player1.curAni.up, true);
        player1.tool1Effect1.anims.play(player1.curAni.up, true);
        player1.tool1Effect2.anims.play(player1.curAni.up, true);
        player1.tool1Effect3.anims.play(player1.curAni.up, true);
    }  else if (player1KeyDown.isDown) {
        resetTool1Effect(player1);
        player2.tool1Effect1.x = player2.x;
        player2.tool1Effect2.x = player2.x;
        player2.tool1Effect3.x = player2.x;
        player1.tool1Effect1.y = player1.y - 10;
        player1.tool1Effect2.y = player1.y - 23;
        player1.tool1Effect3.y = player1.y - 39;
        setVelocityX(player1, 0);
        setVelocityY(player1, player1.initialSpeed);
        // bomb1.setVelocityY(player1.initialSpeed);a
        player1.keyDown = 'down';
        player1.anims.play(player1.curAni.down, true);
        player1.tool1Effect1.anims.play(player1.curAni.down, true);
        player1.tool1Effect2.anims.play(player1.curAni.down, true);
        player1.tool1Effect3.anims.play(player1.curAni.down, true);
    } else {
        resetPlayerY(player1);
        resetPlayerX(player1);
        resetTool1Effect(player1);
        player1.anims.play(player1.curAni.breath, true);
        player1.tool1Effect1.anims.play(player1.curAni.breath, true);
        player1.tool1Effect2.anims.play(player1.curAni.breath, true);
        player1.tool1Effect3.anims.play(player1.curAni.breath, true);
    }

    skillOneHandler(player1, player1Key1);
    skillOneHandler(player2, player2Key1);

    skillTwoHandler(player1, player2, player1Key2);
    skillTwoHandler(player2, player1, player2Key2);

    skillThreeHandler(player1, player1Key3, curTime);
    skillThreeHandler(player2, player2Key3, curTime);

    skillFlashHandler(player1, player1KeyF);
    skillFlashHandler(player2, player2KeyF);
}

function toolEffectVisible(player, visible) {
    player.tool1Effect1.visible = visible;
    player.tool1Effect2.visible = visible;
    player.tool1Effect3.visible = visible;
}

function resetTool1Effect(player) {
    player.tool1Effect1.x = player.x;
    player.tool1Effect1.y = player.y;
    player.tool1Effect2.x = player.x;
    player.tool1Effect2.y = player.y;
    player.tool1Effect3.x = player.x;
    player.tool1Effect3.y = player.y;
}

function flash(player, durationX, durationY) {
    Game.tweens.add({
        targets: player,
        x: durationX,
        y: durationY,
        ease: 'Power1',
        duration: 350,
        yoyo: false,
        repeat: 0,
        onStart: function () {},
        onComplete: function () {
            player.roll.visible = false;
        },
        onYoyo: function () {},
        onRepeat: function () {},
    });
}

function recordPlayerPos(time) {
    playerPosHistroy.player1[currentTime.toFixed(1)] = {
        x: player1.x,
        y: player1.y,
        direction: player1.keyDown,
        ani: player1.curAni,
        speed:player1.initialSpeed
    };
    playerPosHistroy.player2[currentTime.toFixed(1)] = {
        x: player2.x,
        y: player2.y,
        direction: player2.keyDown,
        ani: player2.curAni,
        speed:player2.initialSpeed
    };
}

function skillFlashHandler(player, key) {
    if (player.flashCD > 0) {
        return
    }

    if (key.isDown) {
        player.flashCD = flashCD;
        loopEvent(player);
        player.roll.visible = true;
        if (player.keyDown === 'left') {
            player.roll.x = player.x + 80;
            player.roll.y = player.y;
            player.roll.anims.play('roll_left', true);
            flash(player, player.x - 100, player.y);
        }else if (player.keyDown === 'right') {
            player.roll.x = player.x - 80;
            player.roll.y = player.y;
            player.roll.anims.play('roll_right', true);
            flash(player, player.x + 100, player.y);
        }else if (player.keyDown === 'up') {
            player.roll.y = player.y + 70;
            player.roll.x = player.x;
            player.roll.anims.play('roll_up', true);
            flash(player, player.x, player.y - 100);
        }else if (player.keyDown === 'down') {
            player.roll.y = player.y - 70;
            player.roll.x = player.x;
            player.roll.anims.play('roll_down', true);
            flash(player, player.x, player.y + 100);
        }else {
            player.roll.x = player.x - 80;
            player.roll.y = player.y;
            player.roll.anims.play('roll_left', true);
            flash(player, player.x - 100, player.y);
        }
    }
}

function loopEvent(player) {
    Game.time.delayedCall(1000, function() {
        player.flashCD--;
        if (player.flashCD > 0) {
            loopEvent(player)
        }
        updateSkillCD();
    }, [], this);
}

function updateSkillCD() {
    var player1FlashCD = player1.flashCD;
    var player2FlashCD = player2.flashCD;

    if (player1FlashCD > 0) {
        player1FlashCDTextBg.visible = true;
        player1FlashCDText.visible = true;
        player1FlashCDText.text = player1FlashCD;
    }else {
        player1FlashCDTextBg.visible = false;
        player1FlashCDText.visible = false;
    }
    if (player2FlashCD > 0) {
        player2FlashCDTextBg.visible = true;
        player2FlashCDText.visible = true;
        player2FlashCDText.text = player2FlashCD;
    }else {
        player2FlashCDTextBg.visible = false;
        player2FlashCDText.visible = false;
    }
}

function skillOneHandler(player, key) {
    if (key.isDown) {
        if (player.package.tool1 > 0 && !player.tool1Using) {
            player.initialSpeed += velocitySpeed;
            player.package.tool1--;
            updatePlayerPackage(player);
            toolEffectVisible(player, true);
            player.tool1Using = true;
            Game.time.delayedCall(3000, function() {
                player.initialSpeed -= velocitySpeed;
                player.tool1Effect && player.tool1Effect.destroy();
                toolEffectVisible(player, false);
                player.tool1Using = false;
            }, [], this);
        }
    }
}

function setPlayRushEffect(player) {
    toolEffectVisible(player, true)
}

function skillTwoHandler(player, target, key) {
    if (key.isDown) {
        if (player.package.tool2 > 0) {
            showAttackRange(player);
        }
    }else {
        if (player.tool2AttackObj) {
            var x = player.tool2AttackObj.x;
            var y = player.tool2AttackObj.y;

            player.tool2AttackReleaseObj = Game.physics.add.sprite(x, y, 'round_active');
            player.tool2AttackReleaseObj.anims.play('round_active');
            player.tool2AttackReleaseObj.depth = -2;
            Game.time.delayedCall(300, function() {
                activeCatchTool(target, x, y, player);
            }, [], this);

            player.tool2AttackObj.destroy();
            player.tool2AttackObj = null;

            player.package.tool2--;
            updatePlayerPackage(player);
        }
    }
}

function skillThreeHandler(player, key, time) {
    if (key.isDown) {
        if (player.package.tool3 > 0) {
            player.x = player.pastPlayer.x;
            player.y = player.pastPlayer.y;
            player.pastPlayer.visible = false;
            player.package.tool3--;
            updatePlayerPackage(player);
        }
    }
}

function setVelocityX(player, x) {
    if (!player.canMove) {
        resetPlayerX(player);
        resetPlayerY(player);
    }else {
        player.setVelocityX(x);
        player.tool1Effect1.setVelocityX(x);
        player.tool1Effect2.setVelocityX(x);
        player.tool1Effect3.setVelocityX(x);
    }
}

function setVelocityY(player, y) {
    if (!player.canMove) {
        resetPlayerX(player);
        resetPlayerY(player);
    }else {
        player.setVelocityY(y);
        player.tool1Effect1.setVelocityY(y);
        player.tool1Effect2.setVelocityY(y);
        player.tool1Effect3.setVelocityY(y);
    }
}

function activeCatchTool(target, attackX, attackY, player) {
    var x = Math.abs(target.x - attackX);
    var y = Math.abs(target.y - attackY);

    if (Math.sqrt(x * x + y * y) <= 80) {
        target.canMove = false;
        target.alpha = 0.7;
        Game.time.delayedCall(3000, function() {
            player.tool2AttackReleaseObj.destroy();
            target.canMove = true;
            target.alpha = 1;
        }, [], this);
    }else {
        Game.time.delayedCall(500, function() {
            player.tool2AttackReleaseObj.destroy();
        }, [], this);
    }
}

function resetPlayerX(player) {
    player.setVelocityX(0);
    player.tool1Effect1.setVelocityX(0);
    player.tool1Effect2.setVelocityX(0);
}

function resetPlayerY(player) {
    player.setVelocityY(0);
    player.tool1Effect1.setVelocityY(0);
    player.tool1Effect2.setVelocityY(0);
}

function showAttackRange(player) {
    var x = player.x;
    var y = player.y;

    if (player.keyDown === 'left') {
        x = player.x - 90;
    }else if (player.keyDown === 'right') {
        x = player.x + 90;
    }else if (player.keyDown === 'up') {
        y = player.y - 90;
    }else if (player.keyDown === 'down') {
        y = player.y + 90;
    }else {
         x = player.x - 90;
    }

    player.tool2AttackObj && player.tool2AttackObj.destroy();
    player.tool2AttackObj = Game.physics.add.sprite(x, y, 'round');
    player.tool2AttackObj.depth = -2;
}

function collectTool1(player, tool) {
    if (player.package.tool1 === 3) {
        if (!player.tool1Package.isPending) {
            rotateAni(player.tool1Package, player);
        }
        return
    }

    tool.destroy();

    player.package.tool1++;

    updatePlayerPackage(player);
}

function rotateAni(target, player) {
    target.isPending = true;
    Game.tweens.add({
        targets: target,
        angle: '30deg',
        ease: 'Power1',
        duration: 300,
        yoyo: true,
        repeat: 2,
        onStart: function () {},
        onComplete: function () {
            target.isPending = false;
        },
        onYoyo: function () {},
        onRepeat: function () {},
    });
    showTips(player, '该道具已满');
}
function showTips(player, text) {
    var tips = Game.add.text(player.x, player.y - 100, text, {
        fontSize: '28px',
        fill: '#000',
        fontWeight: 'bold'
    });
    Game.time.delayedCall(1000, function() {
        tips.destroy();
    }, [], this);
}

function collectTool2(player, tool) {
    if (player.package.tool2 === 5) {
        if (!player.tool2Package.isPending) {
            rotateAni(player.tool2Package, player);
        }
        return;
    }

    tool.destroy();
    player.package.tool2++;
    updatePlayerPackage(player);
}

function collectTool3(player, tool) {
    if (player.package.tool3 === 1) {
        return
    }

    tool.destroy();

    player.package.tool3++;
    showPastPlayer(player);
    updatePlayerPackage(player);
}

function showPastPlayer(player) {
    // var time = parseFloat(currentTime.toFixed(1)) + 6 > bombTime ? bombTime : parseFloat(currentTime.toFixed(1)) + 6;
    
    // if (!playerPosHistroy[player.name][time]) {
    //     time += 0.1
    // }

    // if (playerPosHistroy[player.name][time]) {
    //     player.pastPlayer.x = playerPosHistroy[player.name][time].x;
    //     player.pastPlayer.y = playerPosHistroy[player.name][time].y;
    // }
    
    player.pastPlayer.visible = true;
}

function hit(player, bomb) {
    // this.physics.pause();


    // this.physics.resume();

    // player.setTint(0xff0000);

    // player.anims.play('turn');

    // gameOver = true;
}

function changeBomb(time) {
    if (canChangeBomb) {
        canChangeBomb = false;
        if (player1.hasBomb) {
            removeBomb(player1);
            setBomb(player2);
        }else {
            removeBomb(player2);
            setBomb(player1);
        }
        Game.time.delayedCall(2000, function() {
            canChangeBomb = true;
        }, [], this);
    }
}

function updatePlayerPackage(player) {
    player.tool1NumText.text = player.package.tool1;
    player.tool2NumText.text = player.package.tool2;
    player.tool3NumText.text = player.package.tool3;

    // player.tool1Obj && player.tool1Obj.destroy();
    // player.tool2Obj && player.tool2Obj.destroy();
    // player.tool3Obj && player.tool3Obj.destroy();

    // if (player.package.tool1 > 0) {
    //     player.tool1Obj = Game.physics.add.sprite(player.tool1Pos[0], player.tool1Pos[1], 'rush');
    // }

    // if (player.package.tool2 > 0) {
    //     player.tool2Obj = Game.physics.add.sprite(player.tool2Pos[0], player.tool2Pos[1], 'catch');
    // }

    // if (player.package.tool3 > 0) {
    //     player.tool3Obj = Game.physics.add.sprite(player.tool3Pos[0], player.tool3Pos[1], 'dazhao');
    // }
}

function isInBombRange(time) {
    var xDistance = Math.abs(player1.x - player2.x);
    var yDistance = Math.abs(player1.y - player2.y);

    try {
        var distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);

        if (distance < 100) {
            changeBomb()
        }

    } catch (e) {

    }
}