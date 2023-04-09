const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height); // positions: x, y, width, height

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/bg.png',
});

const shop = new Sprite({
    position: {
        x: 600,
        y: 96
    },
    imageSrc: './img/shop.png',
    scale: 3,
    framesMax: 6
});

const player = new Fighter({
    position: {
    x: 0,
    y: 0
    },
    velocity: {
    x: 0,
    y: 10
    },
    color: 'pink',
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 158
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        }
    }
});


const enemy = new Fighter({
    position: {
    x: 400,
    y: 100
    },
    velocity: {
    x: 0,
    y: 0
    },
    color: 'lightblue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 169
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        }
    }
});


console.log(player);

const keys = {
    q: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
};

decreaseTimer();

let lastKey;

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'violet';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();

    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //player mouvement
    if (keys.q.pressed && player.lastKey === 'q') {
        player.velocity.x = -5;
        player.switchSprite('run');
    }else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    }else {
        player.switchSprite('idle');
    }

    //player jump
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }


    //enemy mouvement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    }else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    //enemy jump
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    //detect collision
    if(rectangularCollision ({
        rectangle1: player,
        rectangle2: enemy
    }) && player.isAttacking) {
            player.isAttacking = false;
            enemy.health -= 20;
            document.querySelector('#enemyHealth').style.width = enemy.health + '%';
        }

        if(rectangularCollision ({
            rectangle1: enemy,
            rectangle2: player
        }) && enemy.isAttacking) {
                enemy.isAttacking = false;
                player.health -= 20;
                document.querySelector('#playerHealth').style.width = player.health + '%';
            }
    //arretez le jeu si un des deux joueurs a 0 de vie
    if (player.health <= 0 || enemy.health <= 0){
        determineWinner({player, enemy, timerId})
    }

}

animate();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        
        case 'q':
            keys.q.pressed = true;
            player.lastKey = 'q';
            break;

        case 'z':
            player.velocity.y = -20;
            break;

        case ' ':
            player.attack();
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;

        case 'ArrowUp':
            enemy.velocity.y = -20;
            break;

        case 'ArrowDown':
            enemy.attack();
            break;
    } 
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        
        case 'q':
            keys.q.pressed = false;
            break;

        
            case 'ArrowRight':
                keys.ArrowRight.pressed = false;
                break;
            
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = false;
                break;
    }
})