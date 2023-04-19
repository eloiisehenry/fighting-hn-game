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
        document.querySelector('#displayText').innerHTML = 'EGALITE...';
    } else if (player.health > enemy.health){
        document.querySelector('#displayText').innerHTML = 'SHAWN WIN BY KO !';
    } else if(player.health < enemy.health){
        document.querySelector('#displayText').innerHTML = 'IRENE WIN BY KO !';
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