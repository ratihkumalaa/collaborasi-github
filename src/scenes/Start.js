var ambience = null;
var layoutsize = {'w':1024, 'h': 768};
var X_POSITION;
var Y_POSITION;

export class Start extends Phaser.Scene {
    constructor() {
        super({ key: 'Start' });
    }

    preload() {
        this.load.image('bg_start', 'assets/bg_start.png');
        this.load.image('btn_play', 'assets/btn_play.png');
        this.load.image('title_game', 'assets/title_game.png');

        // panel skor 
        this.load.image('panel_skor', 'assets/panel_skor.png');

        // Sound
        this.load.audio('ambience', 'assets/audio/ambience.mp3');
        this.load.audio('touch', 'assets/audio/touch.mp3'); 
        this.load.audio('transisi_menu', 'assets/audio/transisi_menu.mp3'); 
    }

    create() {

        // =========================
        // CENTER FIX (PAKAI CAMERA)
        // =========================
        X_POSITION ={
            'LEFT': 0,
            'CENTER': this.cameras.main.centerX,
            'RIGHT': this.cameras.main.width
        };

        Y_POSITION = {
            'TOP': 0,
            'CENTER': this.cameras.main.centerY,
            'BOTTOM': this.cameras.main.height
        };

        // =========================
        // SOUND
        // =========================
        if (ambience == null){
            ambience = this.sound.add ('ambience', {
                loop: true,
                volume: 0.35
            });
            ambience.play()
        }

        this.touch = this.sound.add('touch');
        var transisi = this.sound.add('transisi_menu');

        // =========================
        // BACKGROUND
        // =========================
        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'bg_start')
        .setOrigin(0.5);

        // =========================
        // TITLE
        // =========================
        this.titleGame = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'title_game')
        .setOrigin(0.5)
        .setDepth(10);

        this.titleGame.y -= 384;

        var diz = this;

        // animasi turun
        this.tweens.add({
            targets: diz.titleGame,
            ease: 'Bounce.easeOut',
            duration: 750,
            delay: 250,
            y: 200,
            onComplete: function(){
                transisi.play();
            }
        });

        // animasi scale
        this.titleGame.setScale(0);
        this.tweens.add({
            targets: diz.titleGame,
            ease: 'Elastic',
            duration: 750,
            delay:1000,
            scaleX:1,
            scaleY:1
        });

        // =========================
        // BUTTON PLAY
        // =========================
        var btnPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER + 75, 'btn_play')
        .setOrigin(0.5)
        .setDepth(10);

        btnPlay.setScale(0);

        this.tweens.add({
            targets: btnPlay,
            ease: 'Back',
            duration: 500,
            delay: 750,
            scaleX : 1,
            scaleY : 1
        });

        btnPlay.setInteractive();

        var btnCliked = false;

        // hover
        this.input.on('gameobjectover', function (pointer, gameObject) {
            if (gameObject == btnPlay) {
                btnPlay.setTint(0x616161);
            }
        }, this);

        this.input.on('gameobjectout', function (pointer, gameObject) {
            if (gameObject == btnPlay) {
                btnPlay.setTint(0xffffff);
            }
        }, this);

        // klik
        this.input.on('gameobjectdown', function (pointer, gameObject) {
            if (gameObject == btnPlay) {
                btnPlay.setTint(0x616161);
                btnCliked = true;
            }
        }, this);

        this.input.on('gameobjectup', function (pointer, gameObject) {
            if (gameObject == btnPlay) {
                btnPlay.setTint(0xffffff);
                this.scene.start('Play'); 
                this.touch.play();
            }
        }, this);

        this.input.on('pointerup', function() {
            btnCliked = false;
        }, this);

        // =========================
        // PANEL SKOR (CENTER FIX)
        // =========================
        var skor_tertinggi = localStorage['Skor'] || 0 ;

        var panel_Skor = this.add.image(
            X_POSITION.CENTER, 
            Y_POSITION.CENTER + 250, 
            'panel_skor'
        )
        .setOrigin(0.5)
        .setDepth(10)
        .setAlpha(0.8);

        var label_Skor = this.add.text(
            panel_Skor.x, 
            panel_Skor.y, 
            'High Score: ' + skor_tertinggi,
            {
                fontSize: '30px',
                color: '#ff732e',
                align: 'center'
            }
        )
        .setOrigin(0.5)
        .setDepth(10);
    }
}