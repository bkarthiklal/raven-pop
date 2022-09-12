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
    this.width = 100;
    this.height = 50;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height)
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeletion = false;
  }
  update() {
    this.x -= this.directionX;
    if(this.x < 0 - this.width) this.markedForDeletion = true;
  }
  draw() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.x, this.y, this.width, this.height);
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
  [...ravens].forEach(object => object.update());
  [...ravens].forEach(object => object.draw());
  ravens = ravens.filter(obj => !obj.markedForDeletion);
  /** Logic Block : End */
  requestAnimationFrame(animate);``
};

animate(0)