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

        // menambahkan panel skor 
        this.load.image('panel_skor', 'assets/panel_skor.png');

        // Sound Effect
        this.load.audio('ambience', 'assets/audio/ambience.mp3');
        this.load.audio('touch', 'assets/audio/touch.mp3'); 
        this.load.audio('transisi_menu', 'assets/audio/transisi_menu.mp3'); 
    }

    create() {

        //Responsif view
        X_POSITION ={
            'LEFT': 0,
            'CENTER': this.scale.width / 2,
            'RIGHT': this.scale.width
        };

        Y_POSITION = {
            'TOP': 0,
            'CENTER': this.scale.height /2,
            'BOTTOM': this.scale.height
        };

        if (ambience == null){
            ambience = this.sound.add ('ambience', {
                loop: true,
                volume: 0.35
            });
            ambience.play()
        }

        this.touch = this.sound.add('touch');
        var transisi = this.sound.add('transisi_menu');

        // Penambahan background
        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'bg_start');
        
        // Penambahan Button Play
        var btnPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER + 75, 'btn_play');
        btnPlay.setDepth(10);
        
        // menambahkan judul game di dalam scene scnMenu
        this.titleGame = this.add.image(X_POSITION.CENTER,Y_POSITION.CENTER, 'title_game');
        this.titleGame.setDepth(10);
        
        // mengurangi posisi y judul game sebanyak 384 piksel
        this.titleGame.y -= 384;
        
        var diz = this;
        
        // menambahkan animasi judul game
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
        
        this.titleGame.setScale(0);
    
        // Animasi Title
        this.tweens.add({
            targets: diz.titleGame,
            ease: 'Elastic',
            duration: 750,
            delay:1000,
            scaleX:1,
            scaleY:1
        });
        
        
        // mengatur scale awal btnPlay menjadi 0
        btnPlay.setScale(0);
        
        // menambahakan animasi ke tombol play
        this.tweens.add({
            targets: btnPlay,
            ease: 'Back',
            duration: 500,
            delay: 750,
            scaleX : 1,
            scaleY : 1
        });
        
        btnPlay.setInteractive();
        
        
        // menambahkan input user
        this.input.on('gameobjectover', function (pointer, gameObject) {
            console.log("Scene Menu | Object Over");
        
            if (gameObject == btnPlay) {
                btnPlay.setTint(0x616161);
            }
        
        }, this);
        
        this.input.on('gameobjectout', function (pointer, gameObject) {
            console.log("Scene Menu | Object Out");
        
            if (gameObject == btnPlay) {
                btnPlay.setTint(0xffffff);
            }
        
        }, this);
        
        this.input.on('gameobjectdown', function (pointer, gameObject) {
            console.log("Scene Menu | Object Click");
        
            if (gameObject == btnPlay) {
                btnPlay.setTint(0x616161);
                btnCliked = true;
            }
        
        }, this);
        
        // menambahkan deteksi objek selesai diklik
        this.input.on('gameobjectup', function (pointer, gameObject) {
            if (gameObject == btnPlay) {
                btnPlay.setTint(0xffffff);

                this.scene.start('Play'); 
                this.touch.play();
            }
        }, this);
        
        this.input.on('pointerup', function(pointer, currentlyOver) {
            console.log("Scene Menu | Mouse Up");
        
            btnCliked = false;

        }, this);
            
        // menambahkan variabel penanda apakah tombol sedang diklik atau tidak
        var btnCliked = false; 

        // variable skor tertinggi
        var skor_tertinggi = localStorage['Skor'] || 0 ;

        // pemanggilan image
        var panel_Skor = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER + 250, 'panel_skor');
        panel_Skor.setOrigin(0.5);
        panel_Skor.setDepth(10);
        panel_Skor.setAlpha(0.8);

        // menampung nilai skor 
        var label_Skor = this.add.text(panel_Skor.x+25, panel_Skor.y, 'Haight Skor: ' + skor_tertinggi);
        label_Skor.setOrigin(0.5);
        label_Skor.setDepth(10);
        label_Skor.setFontSize(30);
        label_Skor.setTint(0xff732e);
    }
}