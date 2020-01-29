import React from 'react';
import Player from './Assets/player.png'
import {SPRITES_SCALE} from './common.js';
import PlayerLeft from './Assets/player_left.png'
import PlayerRight from './Assets/player_right.png'

function Car(props) {
    const spriteWidth = 80;
    const spriteHeight = 41;
    var orientation = props.orientation;
    var destW  = (spriteWidth * props.scale * props.width/2) * (SPRITES_SCALE * props.roadWidth);
    var destH  = (spriteHeight * props.scale * props.width/2) * (SPRITES_SCALE * props.roadWidth);
    const left = Math.round((props.width/2-destW/2));
    const top = Math.round((props.height-destH));
    var sprite = null;
    if (orientation =='left')
        sprite = PlayerLeft
    else if (orientation =='right')
        sprite = PlayerRight
    else 
        sprite = Player

    const carStyle = {     
        width: `calc(${destW}px)`,
        height: `calc(${destH}px)`,
        top: `calc(${top}px)`,
        left: `calc(${left}px)`,                 
        position: 'absolute',
        zIndex: 1        
    };


    return (
        <img alt='' src={sprite}
         style={carStyle} />
    );
}

export default Car;