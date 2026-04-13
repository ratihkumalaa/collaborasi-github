var layoutsize = {'w':1920, 'h': 1080};
var X_POSITION;
var Y_POSITION;

export class Play extends Phaser.Scene {
    constructor() {
        super({ key: 'Play' });
    }

    preload() { 
        this.load.image('fg_loop_back', 'assets/fg_loop_back.png');
        this.load.image('fg_loop', 'assets/fg_loop.png');
        this.load.image('obstc', 'assets/obstc.png');
        this.load.image('panel_skor', 'assets/panel_skor.png');
        this.load.spritesheet('player', 'assets/chara.png', { frameWidth: 64, frameHeight: 150 });

        this.load.audio('snd_dead', 'assets/audio/snd_dead.mp3');
        this.load.audio('snd_klik1', 'assets/audio/snd_klik_1.mp3'); 
        this.load.audio('snd_klik2', 'assets/audio/snd_klik_2.mp3'); 
        this.load.audio('snd_klik3', 'assets/audio/snd_klik_3.mp3');  
    }

    create() { 

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        // POSITION
        X_POSITION ={
            'LEFT': 0,
            'CENTER': this.cameras.main.centerX,
            'RIGHT': width
        };

        Y_POSITION = {
            'TOP': 0,
            'CENTER': this.cameras.main.centerY,
            'BOTTOM': height
        };

        // BACKGROUND COLOR
        this.cameras.main.setBackgroundColor('#000000');

        // SOUND
        this.snd_dead = this.sound.add('snd_dead');

        this.snd_klik = [];
        this.snd_klik.push(this.sound.add('snd_klik1'));
        this.snd_klik.push(this.sound.add('snd_klik2'));
        this.snd_klik.push(this.sound.add('snd_klik3'));

        // =========================
        // NYAWA
        // =========================
        this.lives = 3;

        this.label_lives = this.add.text(
            X_POSITION.LEFT + 150, 
            Y_POSITION.TOP + 60, 
            'Nyawa: ' + this.lives,
            {
                fontSize: '28px',
                color: '#ffffff'
            }
        ).setOrigin(0.5).setDepth(10);

        // =========================
        // BACKGROUND LOOP
        // =========================
        this.backgrounds = [];
        let bg_x = width / 2;

        for (let i = 0; i < 2; i++) {
            let bg_awal = [];

            let BG = this.add.image(bg_x, height / 2, 'fg_loop_back').setOrigin(0.5);
            let FG = this.add.image(bg_x, height / 2, 'fg_loop').setOrigin(0.5);

            BG.setData('kecepatan', 2);
            FG.setData('kecepatan', 4);
            FG.setDepth(2);

            bg_awal.push(BG);
            bg_awal.push(FG);

            this.backgrounds.push(bg_awal);

            bg_x += width;
        }

        // =========================
        // PLAYER
        // =========================
        this.chara = this.add.image(200, Y_POSITION.CENTER, 'player')
        .setDepth(3)
        .setScale(0);

        this.isGameRunning = false;

        this.tweens.add({
            delay: 250,
            targets: this.chara,
            ease: 'Back.Out',
            duration: 500,
            scaleX: 1,
            scaleY: 1, 
            onComplete: () => {
                this.isGameRunning = true;
            }
        });

        // =========================
        // SCORE
        // =========================
        this.score = 0;

        this.panel_score = this.add.image(
            X_POSITION.CENTER, 
            Y_POSITION.TOP + 60, 
            'panel_skor'
        ).setOrigin(0.5).setDepth(10).setAlpha(0.8);

        this.label_score = this.add.text(
            this.panel_score.x, 
            this.panel_score.y, 
            this.score,
            {
                fontSize: '30px',
                color: '#ff732e'
            }
        ).setOrigin(0.5).setDepth(10);

        // =========================
        // OBSTACLE
        // =========================
        this.timerHalangan = 0;
        this.halangan = [];

        // =========================
        // GAME OVER
        // =========================
        this.gameOver = () => { 
            var haight_skor = localStorage['Skor'] || 0 ;
            if (this.score > haight_skor){
                localStorage['Skor'] = this.score;
            }
            this.scene.start('Start');
        };

        // INPUT
        this.input.on('pointerup', () => {
            if (!this.isGameRunning) return;

            this.snd_klik[Math.floor((Math.random()*2))].play();

            this.tweens.add({
                targets: this.chara,
                duration: 750,
                y: this.chara.y + 200
            });
        });
    }

    update() {

        let width = this.cameras.main.width;

        if (this.isGameRunning) {
            this.chara.y -= 5;

            if (this.chara.y > 1000) {
                this.chara.y = 1000;
            }
        }

        // BACKGROUND LOOP
        for (let i = 0; i < this.backgrounds.length; i++) {
            for (let j = 0; j < this.backgrounds[i].length; j++) {
                this.backgrounds[i][j].x -= this.backgrounds[i][j].getData('kecepatan');

                if (this.backgrounds[i][j].x <= -(width / 2)) {
                    let diff = this.backgrounds[i][j].x + (width / 2);
                    this.backgrounds[i][j].x = width + width / 2 + diff;
                }
            }
        }

        // SPAWN OBSTACLE
        if (this.timerHalangan == 0)
        {
            var acak_y = Math.floor((Math.random() * 900) + 100);

            var halanganBaru = this.add.image(width + 100, acak_y, 'obstc');
            halanganBaru.setOrigin(0.0);
            halanganBaru.setData("status_aktif", true);
            halanganBaru.setData("kecepatan", Math.floor((Math.random() * 15) + 10))
            halanganBaru.setDepth(5);

            this.halangan.push(halanganBaru);

            this.timerHalangan = Math.floor((Math.random() * 50) + 10);
        }

        // GERAK OBSTACLE
        for (let i = this.halangan.length - 1; i >= 0; i--) 
        {
            this.halangan[i].x -= this.halangan[i].getData("kecepatan");

            if (this.halangan[i].x < -200)
            {
                this.halangan[i].destroy();
                this.halangan.splice(i, 1);
                break;
            }
        }

        this.timerHalangan--;

        // SCORE
        for (var i = this.halangan.length - 1; i >= 0; i--)
        {
            if (this.chara.x > this.halangan[i].x + 50 && this.halangan[i].getData("status_aktif") == true)
            {
                this.halangan[i].setData("status_aktif", false);
                this.score++;
                this.label_score.setText(this.score);
            }
        }

        // =========================
        // COLLISION + NYAWA
        // =========================
        for (let i = this.halangan.length - 1; i >= 0; i--) {
            if (this.chara.getBounds().contains(this.halangan[i].x, this.halangan[i].y)) {

                this.halangan[i].destroy();
                this.halangan.splice(i, 1);

                this.lives--;
                this.label_lives.setText('Nyawa: ' + this.lives);

                this.snd_dead.play();

                this.chara.setTint(0xff0000);
                this.time.delayedCall(200, () => {
                    this.chara.clearTint();
                });

                if (this.lives <= 0) {
                    this.isGameRunning = false;
                    this.gameOver();
                }

                break;
            }
        }

        // OUT OF SCREEN
        if (this.chara.y < -50) {
            this.isGameRunning = false;
            this.gameOver();
        }
    }
}