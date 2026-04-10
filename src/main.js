import { Start } from './scenes/Start.js';
import { Play } from './scenes/Play.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 800 }, debug: false }
    },
    scene: [ Start, Play ]
};

new Phaser.Game(config);
