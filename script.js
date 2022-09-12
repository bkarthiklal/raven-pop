const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let ravens = []

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


  }
  draw() {
    // ctx.drawImage(image, sx,sy,sw,sh, dx,dy,dw,dh);
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

const raven = new Raven();



function animate(timeStamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  /** Logic Block */
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  timeToNextRaven += deltaTime;
  if (timeToNextRaven > ravenInterval) { 
    ravens.push(new Raven());
    timeToNextRaven = 0;
  }
  [...ravens].forEach(object => object.update(deltaTime));
  [...ravens].forEach(object => object.draw());
  ravens = ravens.filter(obj => !obj.markedForDeletion);
  /** Logic Block : End */
  requestAnimationFrame(animate);``
};

animate(0)