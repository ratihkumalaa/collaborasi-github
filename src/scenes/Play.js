var layoutsize = {'w':1024, 'h': 768};
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

       // Sound Effect
        this.load.audio('snd_dead', 'assets/audio/snd_dead.mp3');
        this.load.audio('snd_klik1', 'assets/audio/snd_klik_1.mp3'); 
        this.load.audio('snd_klik2', 'assets/audio/snd_klik_2.mp3'); 
        this.load.audio('snd_klik3', 'assets/audio/snd_klik_3.mp3');  
    
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

        // Musik/Sound Effect
        // Ketika karakter terkena obstacle
        this.snd_dead = this.sound.add('snd_dead');

        //Ketika karakter di klik
        this.snd_klik = [];
        this.snd_klik.push(this.sound.add('snd_klik1'));
        this.snd_klik.push(this.sound.add('snd_klik2'));
        this.snd_klik.push(this.sound.add('snd_klik3'));

        // Obstacle
        this.timerHalangan = 0;
        this.halangan = [];

        this.backgrounds = [];
        let bg_x = 1366 / 2;

        // Buat background bergulir
        for (let i = 0; i < 2; i++) {
            let bg_awal = [];

            let BG = this.add.image(bg_x, 768 / 2, 'fg_loop_back');
            let FG = this.add.image(bg_x, 768 / 2, 'fg_loop');

            BG.setData('kecepatan', 2);
            FG.setData('kecepatan', 4);
            FG.setDepth(2);

            bg_awal.push(BG);
            bg_awal.push(FG);

            this.backgrounds.push(bg_awal);

            bg_x += 1366;
        }

        // Tambah karakter
        this.chara = this.add.image(130, Y_POSITION.CENTER, 'player');
        this.chara.setDepth(3);
        this.chara.setScale(0);

        this.isGameRunning = false;

        // Tween untuk karakter muncul, lalu mulai game
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

        // Inisialisasi variabel global this.score dengan nilai awal 0
        this.score = 0;
                
        // Membuat panel nilai
        this.panel_score = this.add.image(X_POSITION.CENTER, Y_POSITION.TOP + 60, 'panel_skor');
        this.panel_score.setOrigin(0.5);
        this.panel_score.setDepth(10);
        this.panel_score.setAlpha(0.8);

        // Membuat label nilai pada panel dengan nilai yang 
        // diambil dari variabel this.score
        this.label_score = this.add.text(this.panel_score.x + 25, this.panel_score.y, this.score);
        this.label_score.setOrigin(0.5);
        this.label_score.setDepth(10);
        this.label_score.setFontSize(30);
        this.label_score.setTint(0xff732e);

        //====================== CUSTOM FUNCTION ======================//
        this.gameOver = () => { 
            var haight_skor = localStorage['Skor'] || 0 ;
            if (this.score > haight_skor){
                localStorage['Skor'] = this.score;
            }
            this.scene.start('Start');
        };


        // Input pointer (contoh: buat karakter turun kalau klik dilepas)
        this.input.on('pointerup', () => {
            if (!this.isGameRunning) return;

            this.snd_klik[Math.floor((Math.random()*2))].play();

            this.tweens.add({
                targets: this.chara,
                ease: 'Power1',
                duration: 750,
                y: this.chara.y + 200
            });
        });
    }

    update() {
        if (this.isGameRunning) {
            // Karakter naik
            this.chara.y -= 5;

            // Batas bawah
            if (this.chara.y > 690) {
                this.chara.y = 690;
            }
        }

        // Update background
        for (let i = 0; i < this.backgrounds.length; i++) {
            for (let j = 0; j < this.backgrounds[i].length; j++) {
                this.backgrounds[i][j].x -= this.backgrounds[i][j].getData('kecepatan');

                if (this.backgrounds[i][j].x <= -(1366 / 2)) {
                    let diff = this.backgrounds[i][j].x + (1366 / 2);
                    this.backgrounds[i][j].x = 1366 + 1366 / 2 + diff;
                }
            }
        }

        // Jika this.timerHalangan adalah 0, maka buat peluru baru
        if (this.timerHalangan == 0)
        {
            // mendapatkan angka acak antara 60 hingga 680
            var acak_y = Math.floor((Math.random() * 680) + 60);

            // Membuat peluru baru dengan posisi x 1500 (kanan), dan posisi y acak antara 60-680
            var halanganBaru = this.add.image(1500, acak_y, 'obstc');
            // Mengubah titik posisi (anchor point) berada di kiri, bukan di tengah
            halanganBaru.setOrigin(0.0);
            halanganBaru.setData("status_aktif", true);
            halanganBaru.setData("kecepatan", Math.floor((Math.random() * 15) + 10))
            halanganBaru.setDepth(5);

            // Memasukkan peluru ke dalam array agar dapat di akses kembali
            this.halangan.push(halanganBaru);

            // Mengatur ulang waktu untuk memunculkan halangan selanjutnya. Acak antara 10 sampai 50 frame)
            this.timerHalangan = Math.floor((Math.random() * 50) + 10);
        }

        // Mengakses array halangan
        for (let i = this.halangan.length - 1; i >= 0; i--) 
        {
            // Menggerakkan halangan sebanyak kecepatan per frame
            this.halangan[i].x -= this.halangan[i].getData("kecepatan");

            // Jika halangan sudah di posisi kurang dari -200 (sudah tidak terlihat)
            if (this.halangan[i].x < -200)
            {
                // Hancurkan halangan untuk mengurangi beba n memori
                this.halangan[i].destroy();
                
                // Hapus dari array halangan yang sudah dihancurkan
                this.halangan.splice(i, 1);
                
                break;
            }
        }

        // Mengurangi timer halangan sebanyak 1 setiap framenya
        // Jika sudah 0, akan di atur ulang lagi nilainya pada kode di atas
        this.timerHalangan--;


        for (var i = this.halangan.length - 1; i >= 0; i--)
        {
            // Jika posisi halangan + 50 lebih kecil dari karakter dan status halangan masih aktif
            if (this.chara.x > this.halangan[i].x + 50 && this.halangan[i].getData("status_aktif") == true)
            {
                // Ubah status halangan menjadi tidak aktif
                this.halangan[i].setData("status_aktif", false);

                // Tambahkan nilai sebanyak 1 poin
                this.score++;

                // Ubah label menjadi nilai terbaru
                this.label_score.setText(this.score);
            }
        }

        for (let i = this.halangan.length - 1; i >= 0; i--) {
        	// Jika rect chara mengenai titik posisi halangan
        	if (this.chara.getBounds().contains(this.halangan[i].x, this.halangan[i].y)) {
        		// Ubah status halangan menjadi tidak aktif
        		this.halangan[i].setData("status_aktif", false);
        
        		// Ubah status game
        		this.isGameRunning = false;
                this.snd_dead.play();
         
        		// melakukan cek variabel penampung animasi karakter
        		// sebelum menghentikan animasi karakter
        		if (this.charaTweens != null) {
        		    this.charaTweens.stop();
        		}
        	
        		// Membuat Objek pengganti this, karena this tidak dapat di akses pada onComplete secara langsung
        		var myScene = this;
        
        		// Membuat animasi kalah
                this.charaTweens = this.tweens.add({
                    targets: this.chara,
                    ease: 'Elastic.easeOut',
                    duration: 1000,
                    alpha: 0,

                    onComplete: () => {
                        this.gameOver();
                    }
                });
        						
        		// menghentikan looping jika sudah terpenuhi pengecekannya
        		break;
        	}
        }
        
        if (this.chara.y < -50) {
        	// Ubah status game
        	this.isGameRunning = false;
        
        	// melakukan cek variabel penampung animasi karakter
        	// sebelum menghentikan animasi karakter
        	if (this.charaTweens != null) {
        		this.charaTweens.stop();
        	}
        	
        	// Membuat Objek pengganti this, karena this tidak dapat di akses pada onComplete secara langsung
        	// let myScene = this;
        
        	// Membuat animasi kalah
        	this.charaTweens = this.tweens.add({
        		targets: this.chara,
        		ease: 'Elastic.easeOut',
        		duration: 1000,
        		alpha: 0,
        		// Memanggil fungsi gameOver() setelah animasi selesai 
        		onComplete: this.gameOver
        	});			
        }
    }
}