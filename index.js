// controle de la musique
const bgMusic = document.getElementById('bg-music');
bgMusic.volume = 0.5; // Définit le volume de la musique à 50%
bgMusic.play(); // Lance la musique

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1300
canvas.height = 800

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 1.5

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/bg2.png',
  scale:1
})

const shop = new Sprite({
  position: {
    x: 650,
    y: 420
  },
  imageSrc: './img/shop.png',
  scale: 1.6,
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 0,
    y: -50
  },
  velocity: {
    x: 0,
    y: 0
  },
  imageSrc: './img/Shawn/Idle.png',
  framesMax: 7,
  scale: 3,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './img/Shawn/Idle.png',
      framesMax: 7
    },
    run: {
      imageSrc: './img/Shawn/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/Shawn/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/Shawn/Fall.png',
      framesMax: 2
    },
    attack: {
      imageSrc: './img/Shawn/Attack.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/Shawn/TakeHit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/Shawn/Death.png',
      framesMax: 5
    }
  },
  attackBox: {
    offset: {
      x: 150,
      y: 50
    },
    width: 80,
    height: 40
  }
})

const enemy = new Fighter({
  position: {
    x: 1130,
    y: -50
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  imageSrc: './img/Irene/Idle.png',
  framesMax:  9,
  scale: 3,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: './img/Irene/Idle.png',
      framesMax: 9
    },
    run: {
      imageSrc: './img/Irene/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/Irene/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/Irene/Fall.png',
      framesMax: 2
    },
    attack: {
      imageSrc: './img/Irene/Attack.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/Irene/TakeHit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/Irene/Death.png',
      framesMax: 5
    }
  },
  attackBox: {
    offset: {
      x: -145,
      y: 50
    },
    width: 90,
    height: 50
  }
})


console.log(player)

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
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'violet'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()  

  player.velocity.x = 0
  enemy.velocity.x = 0

  // player movement

  if (keys.q.pressed && player.lastKey === 'q') {
    player.velocity.x = -16
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 16
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -16
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 16
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  // detect for collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 2
  ) {
    enemy.takeHit()
    player.isAttacking = false
    gsap.to('#enemyHealth', { width: enemy.health + '%' })
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 2) {
    player.isAttacking = false
  }

  // quand player prend un coup
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false
    gsap.to('#playerHealth', { width: player.health + '%' })
  }

  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'q':
        keys.q.pressed = true
        player.lastKey = 'q'
        break
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break  
      case 'z':
        player.velocity.y = -20
        break
      case ' ':
        player.attack()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        enemy.velocity.y = -20
        break
      case 'ArrowDown':
        enemy.attack()
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'q':
      keys.q.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
  }

  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})