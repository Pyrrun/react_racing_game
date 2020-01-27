var Util = {

    timestamp:        function()                  { return new Date().getTime();                                    },
    toInt:            function(obj, def)          { if (obj !== null) { var x = parseInt(obj, 10); if (!isNaN(x)) return x; } return Util.toInt(def, 0); },
    toFloat:          function(obj, def)          { if (obj !== null) { var x = parseFloat(obj);   if (!isNaN(x)) return x; } return Util.toFloat(def, 0.0); },
    limit:            function(value, min, max)   { return Math.max(min, Math.min(value, max));                     },
    randomInt:        function(min, max)          { return Math.round(Util.interpolate(min, max, Math.random()));   },
    randomChoice:     function(options)           { return options[Util.randomInt(0, options.length-1)];            },
    percentRemaining: function(n, total)          { return (n%total)/total;                                         },
    accelerate:       function(v, accel, dt)      { return v + (accel * dt);                                        },
    interpolate:      function(a,b,percent)       { return a + (b-a)*percent                                        },
    easeIn:           function(a,b,percent)       { return a + (b-a)*Math.pow(percent,2);                           },
    easeOut:          function(a,b,percent)       { return a + (b-a)*(1-Math.pow(1-percent,2));                     },
    easeInOut:        function(a,b,percent)       { return a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5);        },
    exponentialFog:   function(distance, density) { return 1 / (Math.pow(Math.E, (distance * distance * density))); },
  
    increase:  function(start, increment, max) { // with looping
      var result = start + increment;
      while (result >= max)
        result -= max;
      while (result < 0)
        result += max;
      return result;
    },
  
    project: function(p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth) {
      p.camera.x     = (p.world.x || 0) - cameraX;
      p.camera.y     = (p.world.y || 0) - cameraY;
      p.camera.z     = (p.world.z || 0) - cameraZ;
      p.screen.scale = cameraDepth/p.camera.z;
      p.screen.x     = Math.round((width/2)  + (p.screen.scale * p.camera.x  * width/2));
      p.screen.y     = Math.round((height/2) - (p.screen.scale * p.camera.y  * height/2));
      p.screen.w     = Math.round(             (p.screen.scale * roadWidth   * width/2));
    },
  
    overlap: function(x1, w1, x2, w2, percent) {
      var half = (percent || 1)/2;
      var min1 = x1 - (w1*half);
      var max1 = x1 + (w1*half);
      var min2 = x2 - (w2*half);
      var max2 = x2 + (w2*half);
      return ! ((max1 < min2) || (min1 > max2));
    }
  
  }
var BACKGROUND = {
    HILLS: { x:   5, y:   5, w: 1280, h: 480 },
    SKY:   { x:   5, y: 495, w: 1280, h: 480 },
    TREES: { x:   5, y: 985, w: 1280, h: 480 }
  };
var COLORS = {
    SKY:  '#72D7EE',
    TREE: '#005108',
    FOG:  '#005108',
    LIGHT:  { road: '#6B6B6B', grass: '#10AA10', rumble: '#555555', lane: '#CCCCCC'  },
    DARK:   { road: '#696969', grass: '#009A00', rumble: '#BBBBBB'                   },
    START:  { road: 'white',   grass: 'white',   rumble: 'white'                     },
    FINISH: { road: 'black',   grass: 'black',   rumble: 'black'                     }
  };

  var KEY = {
    LEFT:  37,
    UP:    38,
    RIGHT: 39,
    DOWN:  40,
    A:     65,
    D:     68,
    S:     83,
    W:     87
  };

 var ROAD = {
    LENGTH: { NONE: 0, SHORT:  25, MEDIUM:  50, LONG:  100 }, // num segments
    HILL:   { NONE: 0, LOW:    20, MEDIUM:  40, HIGH:   60 },
    CURVE:  { NONE: 0, EASY:    2, MEDIUM:   4, HARD:    6 }
  };

  var SPRITES_SCALE = 0.3 * (1/80)

  var SPRITES = {
    SEMI:                   { x: 1365, y:  490, w:  122, h:  144 },
    TRUCK:                  { x: 1365, y:  644, w:  100, h:   78 },
    CAR03:                  { x: 1383, y:  760, w:   88, h:   55 },
    CAR02:                  { x: 1383, y:  825, w:   80, h:   59 },
    CAR04:                  { x: 1383, y:  894, w:   80, h:   57 },
    CAR01:                  { x: 1205, y: 1018, w:   80, h:   56 },
    PLAYER_LEFT:            { x:  995, y:  480, w:   80, h:   41 },
    PLAYER_STRAIGHT:        { x: 1085, y:  480, w:   80, h:   41 },
    PLAYER_RIGHT:           { x:  995, y:  531, w:   80, h:   41 }
  };

  var SPRITES_CARS       = [SPRITES.CAR01, SPRITES.CAR02, SPRITES.CAR03, SPRITES.CAR04, SPRITES.SEMI, SPRITES.TRUCK];

  export{COLORS,KEY,ROAD,BACKGROUND,SPRITES_SCALE,SPRITES,SPRITES_CARS};