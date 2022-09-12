/*  Game canvas initialization */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.font = '40px Impact';

/*  Collision canvas initialization */
const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCanvasCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let score = 0;
let gameOver = false;
let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let ravens = []
let explosions = [];

class Raven {
  constructor() {
    this.image = new Image();
    this.image.src = './images/raven.png';
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.5 + 0.3;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height)
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeletion = false;
    this.frame = 0;
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 50 + 50;
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255)
    ];
    this.color = `rgba(${this.randomColors[0]}, ${this.randomColors[1]}, ${this.randomColors[2]})`;
  }
  update(deltaTime) {
    /** Bounce back to canvas on reaching edges */
    if (this.y < 0 || this.y > canvas.height - this.height) { 
      this.directionY *= -1
    }

    /** Up and down directions for the ravens */
    this.x -= this.directionX;
    this.y -= this.directionY;
    
    /** Clear raven array when off canvas */
    if (this.x < 0 - this.width) this.markedForDeletion = true;
    
    /** Flap speed control : unifying flap speed */
    this.timeSinceFlap += deltaTime;
    if (this.timeSinceFlap > this.flapInterval) { 
      /** Resetting Frame */
      if(this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceFlap = 0;
    }
    /** Check if a raven crosses the canvas */
    if (this.x < 0 - this.width) gameOver = true;
  }
  draw() {
    // ctx.drawImage(image, sx,sy,sw,sh, dx,dy,dw,dh);
    collisionCanvasCtx.fillStyle = this.color;
    collisionCanvasCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height,

    );
  }
}

class Explosions {
  constructor(x, y, size) { 
    this.image = new Image();
    this.image.src = './images/boom.png';
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.size = size;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.sound = new Audio();;
    this.sound.src = './sounds/boom.wav';
    this.timeSinceLastFrame = 0;
    this.frameInterval = 100;
    this.markedForDeletion = false;
  }
  update(deltaTime) {
    /** Play sound only at start of frame */
    if (this.frame === 0) {
      this.sound.play();
    }
    this.timeSinceLastFrame += deltaTime;
    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++
      this.timeSinceLastFrame = 0;
      if(this.frame > 5 ) this.markedForDeletion = true
    }
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y - this.size/4,
      this.size,
      this.size,
    );
  }
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.fillText(`Score: ${score}`, 50, 75);
  ctx.fillStyle = 'white';
  ctx.fillText(`Score: ${score}`, 55, 80);
}

function drawGameOver() {
  ctx.textAlign = 'center';
  ctx.fillStyle = score > 0 ? 'green' :'red';
  ctx.fillText(
    `Game Over, your score is : ${score}`,
    canvas.width / 2,
    canvas.height / 2
  );
  ctx.fillStyle = 'white';
  ctx.fillText(
    `Game Over, your score is : ${score}`,
    canvas.width / 2 + 5,
    canvas.height / 2 + 5
  );
}

function animate(timeStamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCanvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  /** Logic Block */
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  timeToNextRaven += deltaTime;
  if (timeToNextRaven > ravenInterval) { 
    ravens.push(new Raven());
    timeToNextRaven = 0;
    /** Layering sprite based on size */
    ravens.sort((a, b) => a.width - b.width);
  }
  drawScore();
  [...ravens, ...explosions].forEach(object => object.update(deltaTime));
  [...ravens, ...explosions].forEach(object => object.draw());
  ravens = ravens.filter(obj => !obj.markedForDeletion);
  explosions = explosions.filter(obj => !obj.markedForDeletion);
  /** Logic Block : End */
  if (!gameOver) {
    requestAnimationFrame(animate);
  } else {
    drawGameOver();
  }
};

animate(0)

window.addEventListener('click', (e) => { 
  const pc = collisionCanvasCtx.getImageData(e.x, e.y, 1, 1).data;
  ravens.forEach(object => {
    if (
      pc[0] === object.randomColors[0]
      && pc[1] === object.randomColors[1]
      && pc[2] === object.randomColors[2]) {
      object.markedForDeletion = true;
      score++;
      explosions.push(new Explosions(object.x, object.y, object.width));
    }
  })
});