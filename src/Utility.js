export function easeIn(a,b,percent)    { return a + (b-a)*Math.pow(percent,2);                           }
export function easeOut(a,b,percent)   { return a + (b-a)*(1-Math.pow(1-percent,2));                     }
export function easeInOut(a,b,percent) { return a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5);        }
export function toInt(obj, def)        { if (obj !== null) { var x = parseInt(obj, 10); if (!isNaN(x)) return x; } return toInt(def, 0); }
export function randomChoice(options)  { return options[randomInt(0, options.length-1)];            }
export function exponentialFog(distance, density) { return 1 / (Math.pow(Math.E, (distance * distance * density))); }
export function percentRemaining(n, total)        { return (n%total)/total; }
export function interpolate(a,b,percent)          { return a + (b-a)*percent }
export function randomInt(min, max)                { return Math.round(interpolate(min, max, Math.random()));   }
