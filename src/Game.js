import React from 'react';
import {COLORS,BACKGROUND,ROAD,SPRITES_CARS,SPRITES, SPRITES_SCALE} from './common.js';
import BackgroundImg from './Assets/background.jpg';
import Sky from './Assets/sky.png';
import Stats from './Stats.js';
import Hills from './Assets/hills.png';
import Trees from './Assets/trees.png';
import PlayerImg from './Assets/player.png'
import Background from './Background.js';
import Car from './Car.js';
import Road from './Road.js';
import Sprites from './Sprites.js'
import car01 from './Assets/car01.png';
import car02 from './Assets/car02.png';
import car03 from './Assets/car03.png';
import car04 from './Assets/car04.png';
import truck from './Assets/truck.png';


class Game extends React.Component {
  fps = 60;
  interval = 1000/this.fps;
  step = 1/this.fps;
  centrifugal   = 0.3;
  skySpeed      = 0.001;
  hillSpeed     = 0.002;
  treeSpeed     = 0.003;
  skyOffset     = 0;
  hillOffset    = 0;
  treeOffset    = 0;
  segmentLength = 200;
  roadWidth     = 2000;                    // actually half the roads width, easier math if the road spans from -roadWidth to +roadWidth
  rumbleLength  = 3;                       // number of segments per red/white rumble strip
  lanes         = 3;                       // number of lanes
  maxSpeed = this.segmentLength/this.step;
  width         = 1024;                 // logical canvas width
  height        = 600;                  // logical canvas height
  accel         =  this.maxSpeed/5;            // acceleration rate - tuned until it 'felt' right
  breaking      = -this.maxSpeed;              // deceleration rate when braking
  decel         = -this.maxSpeed/5;            // 'natural' deceleration rate when neither accelerating, nor braking
  offRoadDecel  = -this.maxSpeed/2;            // off road deceleration is somewhere in between
  offRoadLimit  =  this.maxSpeed/4;
  fieldOfView   = 100;                     // angle (degrees) for field of view
  cameraHeight  = 1000;                    // z height of camera
  cameraDepth   = 1 / Math.tan((this.fieldOfView/2) * Math.PI/180);
  playerZ       = (this.cameraHeight * this.cameraDepth);    // player relative z distance from camera (computed)
  drawDistance  = 100;                     // number of segments to draw
  segments      = [];
  gameLoopActive= false;
  // array of roadd segments
  trackLength   = null;                    // z length of entire track (computed)
  playerX       = 0;                       // player x offset from center of road (-1 to 1 to stay independent of roadWidth)
  fogDensity    = 5;                       // exponential fog density
  position      = 0;                       // current camera Z position (add playerZ to get player's absolute Z position)
  speed         = 0;                       // current speed=
  cars          = [];
  totalCars     = 200;
  renderCars    = [];
  currentLapTime= 0;
  lastLapTime   = 0;
  fastest_lap_time=0;
  keyLeft       = false;
  keyRight      = false;
  keyFaster     = false;
  keySlower     = false;


  constructor(props) {
    super(props);

    document.body.style.overflow = "hidden";

    this.state = {
        road :       []
    }
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  };

  accelerate(v, accel, dt)      { return v + (accel * dt);}
  limit(value, min, max)   { return Math.max(min, Math.min(value, max));}
  increase(start, increment, max) { // with looping
    var result = start + increment;
    while (result >= max)
      result -= max;
    while (result < 0)
      result += max;
    return result;
  }

  
  update() {
    if (!this.gameLoopActive) return;
    var dt = this.interval/1000;

    var playerSegment = this.findSegment(this.position+this.playerZ);
    var speedPercent  = this.speed/this.maxSpeed;
    var playerW       = 80 * SPRITES_SCALE;
    var dx = dt * 2 * speedPercent;
    var startPosition = this.position;
    this.updateCars(dt,playerSegment,playerW)


    this.position = this.increase(this.position,dt*this.speed, this.trackLength)

    this.playerX = this.keyLeft ? this.playerX - dx : this.keyRight ? this.playerX + dx : this.playerX; 
    this.playerX = this.playerX - (dx * speedPercent * playerSegment.curve * this.centrifugal)
    this.speed = this.keyFaster ? this.accelerate(this.speed,this.accel,dt) : this.keySlower ? this.accelerate(this.speed,this.breaking,dt) : this.accelerate(this.speed,this.decel,dt); 
    if (((this.playerX < -1) || (this.playerX > 1))){

      if(this.speed > this.offRoadLimit){
        this.speed = this.accelerate(this.speed, this.offRoadDecel, dt);
      }

      
    }
    var car, carW;
    for(var n = 0 ; n < playerSegment.cars.length ; n++) {
      car  = playerSegment.cars[n];
      carW = car.sprite.w * SPRITES_SCALE;
      if (this.speed > car.speed) {
        if (this.overlap(this.playerX, playerW, car.offset, carW, 0.8)) {
          this.speed    = car.speed * (car.speed/this.speed);
          this.position = this.increase(car.z, -this.playerZ, this.trackLength);
          break;
        }
      }
    }
    this.playerX = this.limit(this.playerX, -2, 2);     // dont ever let player go too far out of bounds
    this.speed   = this.limit(this.speed, 0, this.maxSpeed); // or exceed maxSpeed

    this.setState({
      road: this.buildRoad()
    })

    this.skyOffset  = this.increase(this.skyOffset,  this.skySpeed  * playerSegment.curve * (this.position-startPosition)/this.segmentLength, 1);
    this.hillOffset = this.increase(this.hillOffset, this.hillSpeed * playerSegment.curve * (this.position-startPosition)/this.segmentLength, 1);
    this.treeOffset = this.increase(this.treeOffset, this.treeSpeed * playerSegment.curve * (this.position-startPosition)/this.segmentLength, 1);

    if (this.position > this.playerZ) {
      if (this.currentLapTime && (startPosition < this.playerZ)) {
        this.lastLapTime    = this.currentLapTime;
        this.currentLapTime = 0;
        if (this.lastLapTime <= this.fastest_lap_time) {
          this.fastest_lap_time = this.lastLapTime;
        }
      }
      else {
        this.currentLapTime += dt;
      }
    }
  }

    updateCars(dt, playerSegment, playerW) {
      var n, car, oldSegment, newSegment;
      for(n = 0 ; n < this.cars.length ; n++) {
        car         = this.cars[n];
        oldSegment  = this.findSegment(car.z);
        car.offset  = car.offset + this.updateCarOffset(car, oldSegment, playerSegment, playerW);
        car.z       = this.increase(car.z, dt * car.speed, this.trackLength);
        car.percent = this.percentRemaining(car.z, this.segmentLength); // useful for interpolation during rendering phase
        newSegment  = this.findSegment(car.z);
        if (oldSegment != newSegment) {
          oldSegment.cars.splice(oldSegment.cars.indexOf(car), 1);
          newSegment.cars.push(car);
        }
      }
    }

    updateCarOffset(car, carSegment, playerSegment, playerW) {

      var i, j, dir, segment, otherCar, otherCarW, lookahead = 20, carW = car.sprite.w * SPRITES_SCALE;
    
      // optimization, dont bother steering around other cars when 'out of sight' of the player
      if ((carSegment.index - playerSegment.index) > this.drawDistance)
        return 0;
    
      for(i = 1 ; i < lookahead ; i++) {
        segment = this.segments[(carSegment.index+i)%this.segments.length];
    
        if ((segment === playerSegment) && (car.speed > this.speed) && (this.overlap(this.playerX, playerW, car.offset, carW, 1.2))) {
          if (this.playerX > 0.5)
            dir = -1;
          else if (this.playerX < -0.5)
            dir = 1;
          else
            dir = (car.offset > this.playerX) ? 1 : -1;
          return dir * 1/i * (car.speed-this.speed)/this.maxSpeed; // the closer the cars (smaller i) and the greater the speed ratio, the larger the offset
        }
    
        for(j = 0 ; j < segment.cars.length ; j++) {
          otherCar  = segment.cars[j];
          otherCarW = otherCar.sprite.w * SPRITES_SCALE;
          if ((car.speed > otherCar.speed) && this.overlap(car.offset, carW, otherCar.offset, otherCarW, 1.2)) {
            if (otherCar.offset > 0.5)
              dir = -1;
            else if (otherCar.offset < -0.5)
              dir = 1;
            else
              dir = (car.offset > otherCar.offset) ? 1 : -1;
            return dir * 1/i * (car.speed-otherCar.speed)/this.maxSpeed;
          }
        }
      }
      if (car.offset < -0.9)
      return 0.1;
    else if (car.offset > 0.9)
      return -0.1;
    else
      return 0;
    }


  overlap(x1, w1, x2, w2, percent) {
    var half = (percent || 1)/2;
    var min1 = x1 - (w1*half);
    var max1 = x1 + (w1*half);
    var min2 = x2 - (w2*half);
    var max2 = x2 + (w2*half);
    return ! ((max1 < min2) || (min1 > max2));
  }

  lastY() { return (this.segments.length == 0) ? 0 : this.segments[this.segments.length-1].p2.world.y; }
  easeIn(a,b,percent)    { return a + (b-a)*Math.pow(percent,2);                           }
  easeOut(a,b,percent)   { return a + (b-a)*(1-Math.pow(1-percent,2));                     }
  easeInOut(a,b,percent) { return a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5);        }
  toInt(obj, def)        { if (obj !== null) { var x = parseInt(obj, 10); if (!isNaN(x)) return x; } return this.toInt(def, 0); }
  randomChoice(options)  { return options[this.randomInt(0, options.length-1)];            }

  addSegment(curve,y) {
    var n = this.segments.length;
    this.segments.push({
       index: n,
          p1: { world: {y: this.lastY(), z:  n   *this.segmentLength }, camera: {}, screen: {} },
          p2: { world: {y: y,            z: (n+1)*this.segmentLength }, camera: {}, screen: {} },
       curve: curve,
       cars: [],
       color: Math.floor(n/this.rumbleLength)%2 ? COLORS.DARK : COLORS.LIGHT
    });
  }

  resetCars() {
    this.cars = [];
    var n, car, segment, offset, z, sprite, speed;
    for (var n = 0 ; n < this.totalCars ; n++) {
      offset = Math.random() * this.randomChoice([-0.8, 0.8]);
      z      = Math.floor(Math.random() * this.segments.length) * this.segmentLength;
      //sprite = this.randomChoice([car01,car02,car03,car04,truck]);
      sprite = this.randomChoice(SPRITES_CARS);
      speed  = this.maxSpeed/4 + Math.random() * this.maxSpeed/(sprite == SPRITES.SEMI ? 4 : 2);
      car = { offset: offset, z: z, sprite: sprite, speed: speed };
      segment = this.findSegment(car.z);
      segment.cars.push(car);
      this.cars.push(car);
    }
  }

  addRoad(enter, hold, leave, curve, y) {
    var startY = this.lastY();
    var endY   = startY + (this.toInt(y, 0) * this.segmentLength);
    var n,total=enter+hold+leave;
    for(n = 0 ; n < enter ; n++)
      this.addSegment(this.easeIn(0, curve, n/enter),this.easeInOut(startY, endY, n/total));
    for(n = 0 ; n < hold  ; n++)
    this.addSegment(curve,this.easeInOut(startY, endY, (enter+n)/total));
    for(n = 0 ; n < leave ; n++)
    this.addSegment(this.easeInOut(curve, 0, n/leave), this.easeInOut(startY, endY, (enter+hold+n)/total));
  }

  addStraight(num) {
    num = num || ROAD.LENGTH.MEDIUM;
    this.addRoad(num, num, num, 0);
  }

  addCurve(num, curve, height) {
    num    = num    || ROAD.LENGTH.MEDIUM;
    curve  = curve  || ROAD.CURVE.MEDIUM;
    height = height || ROAD.HILL.NONE;
    this.addRoad(num, num, num, curve, height);
  }

  addHill(num, height) {
    num    = num    || ROAD.LENGTH.MEDIUM;
    height = height || ROAD.HILL.MEDIUM;
    this.addRoad(num, num, num, 0, height);
  }

  addLowRollingHills(num, height) {
    num    = num    || ROAD.LENGTH.SHORT;
    height = height || ROAD.HILL.LOW;
    this.addRoad(num, num, num,  0,  height/2);
    this.addRoad(num, num, num,  0, -height);
    this.addRoad(num, num, num,  0,  height);
    this.addRoad(num, num, num,  0,  0);
    this.addRoad(num, num, num,  0,  height/2);
    this.addRoad(num, num, num,  0,  0);
  }

  addSCurves() {
    this.addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.EASY,    ROAD.HILL.NONE);
    this.addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,   ROAD.CURVE.MEDIUM,  ROAD.HILL.MEDIUM);
    this.addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,   ROAD.CURVE.EASY,   -ROAD.HILL.LOW);
    this.addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.EASY,    ROAD.HILL.MEDIUM);
    this.addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.MEDIUM, -ROAD.HILL.MEDIUM);
  }

  addDownhillToEnd(num) {
    num = num || 200;
    this.addRoad(num, num, num, -ROAD.CURVE.EASY, -this.lastY()/this.segmentLength);
  }

  resetRoad() {
    this.segments=[]
    this.addStraight(ROAD.LENGTH.SHORT/2);
    this.addHill(ROAD.LENGTH.SHORT, ROAD.HILL.LOW);
    this.addLowRollingHills();
    this.addCurve(ROAD.LENGTH.MEDIUM, ROAD.CURVE.MEDIUM, ROAD.HILL.LOW);
    this.addLowRollingHills();
    this.addCurve(ROAD.LENGTH.LONG, ROAD.CURVE.MEDIUM, ROAD.HILL.MEDIUM);
    this.addStraight();
    this.addCurve(ROAD.LENGTH.LONG, -ROAD.CURVE.MEDIUM, ROAD.HILL.MEDIUM);
    this.addHill(ROAD.LENGTH.LONG, ROAD.HILL.HIGH);
    this.addCurve(ROAD.LENGTH.LONG, ROAD.CURVE.MEDIUM, -ROAD.HILL.LOW);
    this.addHill(ROAD.LENGTH.LONG, -ROAD.HILL.MEDIUM);
    this.addStraight();
    this.addDownhillToEnd();
    this.addCurve(ROAD.LENGTH.LONG, -ROAD.CURVE.EASY);

    this.resetCars();
    this.segments[this.findSegment(this.playerZ).index + 2].color = COLORS.START;
    this.segments[this.findSegment(this.playerZ).index + 3].color = COLORS.START;
    for(var n = 0 ; n < this.rumbleLength ; n++)
    this.segments[this.segments.length-1-n].color = COLORS.FINISH;
  
    this.trackLength = this.segments.length * this.segmentLength;

  }


  onKeyDown(e) {
    switch (e.which) {
        case 37: // Left
            this.keyLeft = true
            break;
        case 38: // Up
            this.keyFaster =true
            break;
        case 39: // Right
            this.keyRight = true
            break;
        case 40: // Down
            this.keySlower = true
            break;
        default:
            break;
    }
  }

  onKeyUp(e) {
    switch (e.which) {
        case 37: // Left
            this.keyLeft = false
            break;
        case 38: // Up
            this.keyFaster =false
            break;
        case 39: // Right
            this.keyRight = false
            break;
        case 40: // Down
            this.keySlower = false
            break;
        default:
            break;
    }
  }

  componentDidMount(){
    window.addEventListener("keydown", this.onKeyDown, false);
    window.addEventListener("keyup",this.onKeyUp,false);

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    
    this.intervalId = setInterval(this.update.bind(this), this.interval);

    this.gameLoopActive = true;


    this.initiateNewGame();
  }

  componentWillUnmount(){
      window.removeEventListener("keydown", this.onKeyDown, false);
      window.removeEventListener('resize', this.updateWindowDimensions);
      window.removeEventListener("keyup",this.onKeyUp,false);
      clearInterval(this.intervalId);
  }    

  updateWindowDimensions() {        
    this.setState({ width: window.innerWidth, height: window.innerHeight });

  }

  initiateNewGame(){
    this.resetRoad();
    this.setState({
      road:this.buildRoad()
    });
  }



  findSegment(z) {
    return this.segments[Math.floor(z/this.segmentLength) % this.segments.length];
  }

  project(p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth) {
    p.camera.x     = (p.world.x || 0) - cameraX;
    p.camera.y     = (p.world.y || 0) - cameraY;
    p.camera.z     = (p.world.z || 0) - cameraZ;
    p.screen.scale = cameraDepth/p.camera.z;
    p.screen.x     = Math.round((width/2)  + (p.screen.scale * p.camera.x  * width/2));
    p.screen.y     = Math.round((height/2) - (p.screen.scale * p.camera.y  * height/2));
    p.screen.w     = Math.round(             (p.screen.scale * roadWidth   * width/2));
  }

  exponentialFog(distance, density) { return 1 / (Math.pow(Math.E, (distance * distance * density))); }
  percentRemaining(n, total)        { return (n%total)/total; }
  interpolate(a,b,percent)          { return a + (b-a)*percent }
  randomInt(min, max)                { return Math.round(this.interpolate(min, max, Math.random()));   }

  buildRoad() {
    var baseSegment = this.findSegment(this.position);
    var basePercent = this.percentRemaining(this.position, this.segmentLength);
    var playerSegment = this.findSegment(this.position+this.playerZ);
    var playerPercent = this.percentRemaining(this.position+this.playerZ, this.segmentLength);
    var playerY       = this.interpolate(playerSegment.p1.world.y, playerSegment.p2.world.y, playerPercent);
    var max = this.height;
    var x = 0;
    var dx = -baseSegment.curve * basePercent;
    let road = [];
    let cars = [];
    var n, i, segment, car, sprite, spriteScale, spriteX, spriteY;
    for(n = 0 ; n < this.drawDistance ; n++) {
      segment = this.segments[(baseSegment.index + n) % this.segments.length];  
      segment.looped = segment.index < baseSegment.index; 
      segment.fog = this.exponentialFog(n/this.drawDistance, this.fogDensity) 
      segment.clip = max;      
      this.project(segment.p1, (this.playerX * this.roadWidth) - x,      playerY + this.cameraHeight, this.position - (segment.looped ? this.trackLength : 0), this.cameraDepth, this.width, this.height, this.roadWidth);
      this.project(segment.p2, (this.playerX * this.roadWidth) - x - dx, playerY + this.cameraHeight, this.position - (segment.looped ? this.trackLength : 0), this.cameraDepth, this.width, this.height, this.roadWidth);
      x = x + dx;
      dx = dx + segment.curve;

      

      if ((segment.p1.camera.z <= this.cameraDepth)  || // behind us
        (segment.p2.screen.y >= segment.p1.screen.y) || // back face cull
        (segment.p2.screen.y >= max))          // clip by (already rendered) segment
      continue;

      road.push({
        x1:segment.p1.screen.x,
        y1:segment.p1.screen.y,
        w1:segment.p1.screen.w,
        x2:segment.p2.screen.x,
        y2:segment.p2.screen.y,
        w2:segment.p2.screen.w,
        fog:segment.fog,
        color:segment.color});

      max = segment.p1.screen.y;
    }

    for(n = (this.drawDistance-1) ; n > 0 ; n--) {
      segment = this.segments[(baseSegment.index + n) % this.segments.length];
    for(i = 0 ; i < segment.cars.length ; i++) {
      car         = segment.cars[i];
      sprite      = car.sprite;
      spriteScale = this.interpolate(segment.p1.screen.scale, segment.p2.screen.scale, car.percent);
      spriteX     = this.interpolate(segment.p1.screen.x,     segment.p2.screen.x,     car.percent) + (spriteScale * car.offset * this.roadWidth * this.width/2);
      spriteY     = this.interpolate(segment.p1.screen.y,     segment.p2.screen.y,     car.percent);
      cars.push({x:spriteX,
        y:spriteY,
        sprite:sprite,
        spriteScale:spriteScale,
        clip:segment.clip});
    }
  }
    this.renderCars = cars;
    return road;
}

  buildCars(){

  }

  render() {
    return <div>
    <Background backgroundImage={Sky}
    width={this.width} 
    height={this.height}
    layer ={BACKGROUND.SKY}
    offset = {this.skyOffset} />
    <Background backgroundImage={Hills}
    width={this.width} 
    height={this.height}
    layer ={BACKGROUND.HILLS}
    offset = {this.hillOffset} />
    <Background backgroundImage={Trees}
    width={this.width} 
    height={this.height}
    layer ={BACKGROUND.TREES}
    offset = {this.treeOffset} />

    <Road road={this.state.road} width={this.width} height={this.height} lanes={this.lanes}/>
    <Sprites list={this.renderCars} width={this.width} height={this.height} roadWidth={this.roadWidth}/>
    <Car orientation={this.keyLeft ? "left" : this.keyRight ? "right" : "straight"}
    scale={this.cameraDepth/this.playerZ}
    width={this.width} 
    height={this.height}
    roadWidth={this.roadWidth}/>    
    <Stats width={this.width} height={this.height} speed={5*Math.round(this.speed/500)} currentLapTime={this.currentLapTime} lastLapTime={this.lastLapTime} fastest_lap_time={this.fastest_lap_time} /> 
    </div>
  }
}


export default Game;



