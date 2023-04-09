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

function rectangularCollision({rectangle1, rectangle2})
{
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        && rectangle1.isAttacking
    )
}

function determineWinner({player, enemy, timerId}){
    clearTimeout(timerId);
    document.querySelector('#displayText').style.display = 'flex';
    if (player.health === enemy.health){
        document.querySelector('#displayText').innerHTML = 'Egalité...';
    } else if (player.health > enemy.health){
        document.querySelector('#displayText').innerHTML = 'Player 1 you win';
    } else if(player.health < enemy.health){
        document.querySelector('#displayText').innerHTML = 'Player 2 you win';
    }
    isGameOver({player, enemy});
}

//redemarrer automatiquement une partie si le jeu est termminé
function isGameOver({player, enemy}){
    if (player.health <= 0 || enemy.health <= 0 || timer === 0){
        setTimeout(() => {
            document.location.reload();
        }, 1500);
    }
}


let timer = 60;
let timerId;
function decreaseTimer(){
     // 1000ms = 1s une loupe a ete cree
    if(timer > 0){
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }

    if (timer === 0){
        determineWinner({player, enemy, timerId})  
    }  
}
decreaseTimer();

let lastKey;

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'violet';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();

    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //player mouvement
    if (keys.q.pressed && player.lastKey === 'q') {
        player.velocity.x = -5;
    }else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
    }

    //enemy mouvement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
    }else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
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
            enemy.isAttacking = true;
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