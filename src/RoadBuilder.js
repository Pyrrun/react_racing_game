import {COLORS,ROAD} from './common.js';
import * as Utility from './Utility.js';

var segments = [];
var rumbleLength = 0;
var segmentLength = 0;

function lastY() { return (segments.length == 0) ? 0 : segments[segments.length-1].p2.world.y; }

function addSegment(curve,y) {
var n = segments.length;

segments.push({
    index: n,
        p1: { world: {y: lastY(), z:  n   *segmentLength }, camera: {}, screen: {} },
        p2: { world: {y: y,            z: (n+1)*segmentLength }, camera: {}, screen: {} },
    curve: curve,
    cars: [],
    color: Math.floor(n/rumbleLength)%2 ? COLORS.DARK : COLORS.LIGHT
});
}

function addRoad(enter, hold, leave, curve, y) {
var startY = lastY();
var endY   = startY + (Utility.toInt(y, 0) * segmentLength);
var n,total=enter+hold+leave;
for(n = 0 ; n < enter ; n++)
    addSegment(Utility.easeIn(0, curve, n/enter),Utility.easeInOut(startY, endY, n/total));
for(n = 0 ; n < hold  ; n++)
    addSegment(curve,Utility.easeInOut(startY, endY, (enter+n)/total));
for(n = 0 ; n < leave ; n++)
    addSegment(Utility.easeInOut(curve, 0, n/leave), Utility.easeInOut(startY, endY, (enter+hold+n)/total));
}

function addStraight(num) {
num = num || ROAD.LENGTH.MEDIUM;
addRoad(num, num, num, 0);
}

function addCurve(num, curve, height) {
num    = num    || ROAD.LENGTH.MEDIUM;
curve  = curve  || ROAD.CURVE.MEDIUM;
height = height || ROAD.HILL.NONE;
addRoad(num, num, num, curve, height);
}

function addHill(num, height) {
num    = num    || ROAD.LENGTH.MEDIUM;
height = height || ROAD.HILL.MEDIUM;
addRoad(num, num, num, 0, height);
}

function addLowRollingHills(num, height) {
num    = num    || ROAD.LENGTH.SHORT;
height = height || ROAD.HILL.LOW;
addRoad(num, num, num,  0,  height/2);
addRoad(num, num, num,  0, -height);
addRoad(num, num, num,  0,  height);
addRoad(num, num, num,  0,  0);
addRoad(num, num, num,  0,  height/2);
addRoad(num, num, num,  0,  0);
}

function addSCurves() {
addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.EASY,    ROAD.HILL.NONE);
addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,   ROAD.CURVE.MEDIUM,  ROAD.HILL.MEDIUM);
addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,   ROAD.CURVE.EASY,   -ROAD.HILL.LOW);
addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.EASY,    ROAD.HILL.MEDIUM);
addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.MEDIUM, -ROAD.HILL.MEDIUM);
}

function addDownhillToEnd(num) {
num = num || 200;
addRoad(num, num, num, -ROAD.CURVE.EASY, -lastY()/segmentLength);
}

function buildLevel1(rumbleL,segmentL) {
    segments = []
    rumbleLength = rumbleL;
    segmentLength = segmentL;

    addStraight(ROAD.LENGTH.SHORT/2);
    addHill(ROAD.LENGTH.SHORT, ROAD.HILL.LOW);
    addLowRollingHills();
    addCurve(ROAD.LENGTH.MEDIUM, ROAD.CURVE.MEDIUM, ROAD.HILL.LOW);
    addLowRollingHills();
    addCurve(ROAD.LENGTH.LONG, ROAD.CURVE.MEDIUM, ROAD.HILL.MEDIUM);
    addStraight();
    addCurve(ROAD.LENGTH.LONG, -ROAD.CURVE.MEDIUM, ROAD.HILL.MEDIUM);
    addHill(ROAD.LENGTH.LONG, ROAD.HILL.HIGH);
    addCurve(ROAD.LENGTH.LONG, ROAD.CURVE.MEDIUM, -ROAD.HILL.LOW);
    addHill(ROAD.LENGTH.LONG, -ROAD.HILL.MEDIUM);
    addStraight();
    addDownhillToEnd();
    addCurve(ROAD.LENGTH.LONG, -ROAD.CURVE.EASY);
    return segments;
}

function buildLevel2(rumbleL,segmentL) {
    segments = []
    rumbleLength = rumbleL;
    segmentLength = segmentL;

    addHill(ROAD.LENGTH.LONG, ROAD.HILL.HIGH);
    addLowRollingHills();
    addCurve(ROAD.LENGTH.LONG, ROAD.CURVE.MEDIUM, ROAD.HILL.MEDIUM);
    addStraight(ROAD.LENGTH.SHORT/2);
    addCurve(ROAD.LENGTH.LONG, ROAD.CURVE.MEDIUM, -ROAD.HILL.LOW);
    addCurve(ROAD.LENGTH.LONG, -ROAD.CURVE.MEDIUM, ROAD.HILL.MEDIUM);
    addHill(ROAD.LENGTH.SHORT, ROAD.HILL.LOW);
    addCurve(ROAD.LENGTH.MEDIUM, ROAD.CURVE.MEDIUM, ROAD.HILL.LOW);
    addLowRollingHills();
    addStraight();
    addStraight();
    addDownhillToEnd();

    return segments;
}

export default buildLevel1;