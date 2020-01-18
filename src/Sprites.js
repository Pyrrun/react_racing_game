import React from 'react';
import Player from './Assets/player.png'
import {SPRITES_SCALE,SPRITES} from './common.js';
import PlayerLeft from './Assets/player_left.png'
import PlayerRight from './Assets/player_right.png'
import PlayerUpLeft from './Assets/player_uphill_left.png'
import PlayerUpRight from './Assets/player_uphill_right.png'
import PlayerUp from './Assets/player_uphill_straight.png'
import car01 from './Assets/car01.png';
import car02 from './Assets/car02.png';
import car03 from './Assets/car03.png';
import car04 from './Assets/car04.png';
import truck from './Assets/truck.png';
import semi from './Assets/semi.png';

class Sprites extends React.Component {

        SCALE = 2
        bgStyle = {        
            width: 0, 
            height: 0, 
            top: 0,
            left: 0,
            position: 'absolute'        
        };
        canvasStyle = {     
            top: '0px',
            left:'0px',              
            position: 'absolute'     
        };
    
        componentDidUpdate(){       
            var ctx = this.refs.canvas.getContext('2d')
            var img = this.refs.img
            var img2 = this.refs.img2
            var img3 = this.refs.img3
            var img4 = this.refs.img4
            var img5 = this.refs.img5
            var img6 = this.refs.img6
            ctx.clearRect(0, 0, this.props.width, this.props.height);
            var n,car,destW,destH,image,destX,destY;
            for(n=0; n< this.props.list.length;n++){
                car = this.props.list[n];
                destW  = ( car.sprite.w * car.spriteScale * this.props.width/2) * (SPRITES_SCALE * this.props.roadWidth);
                destH  = ( car.sprite.h * car.spriteScale * this.props.width/2) * (SPRITES_SCALE * this.props.roadWidth);
                image = null;
                destX = car.x + (destW * (-0.5 || 0));
                destY = car.y + (destH * (-1   || 0));
                switch(car.sprite){
                    case SPRITES.CAR01: 
                            image = img
                        break;
                    case SPRITES.CAR02: 
                            image = img2
                        break;
                    case SPRITES.CAR03: 
                            image = img3
                        break;
                    case SPRITES.CAR04: 
                            image = img4
                        break;
                    case SPRITES.TRUCK: 
                            image = img5
                        break;
                    case SPRITES.SEMI: 
                            image = img6
                    default:
                        break;
                }
                var clipH = car.clip ? Math.max(0, destY+destH-car.clip) : 0;
                //if (clipH < destH)
                ctx.drawImage(image, 0,0, car.sprite.w, car.sprite.h - (car.sprite.h*clipH/destH),destX,destY,destW,destH - clipH);
            }
        }
    
        render (){
            return <div>
                <img src={car01} style={this.bgStyle} ref="img"/>
                <img src={car02} style={this.bgStyle} ref="img2"/>
                <img src={car03} style={this.bgStyle} ref="img3"/>
                <img src={car04} style={this.bgStyle} ref="img4"/>
                <img src={truck} style={this.bgStyle} ref="img5"/>
                <img src={semi} style={this.bgStyle} ref="img6"/>
                <canvas ref="canvas" width={this.props.width} height={this.props.height} style={this.canvasStyle} />
                </div>
        };
    }

export default Sprites;