import React from 'react';
import {COLORS} from './common.js';

class Road extends React.Component {




    rumbleWidth(projectedRoadWidth, lanes) { return projectedRoadWidth/Math.max(6,  2*lanes); }
    laneMarkerWidth(projectedRoadWidth, lanes) { return projectedRoadWidth/Math.max(32, 8*lanes); }

    polygon(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) {
        //console.log(x1+'   '+y1+'   '+x2+'   '+ y2+'   '+ x3+'   '+ y3+'   '+x4+'   '+ y4+'   '+ color)
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.closePath();
        ctx.fill();
        //if(x1<0||y1<0||x2<0||y2<0||x3<0||y3<0)
        //console.log(1)
    }

    fog(ctx, x, y, width, height, fog) {
        if (fog < 1) {
          ctx.globalAlpha = (1-fog)
          ctx.fillStyle = COLORS.FOG;
          ctx.fillRect(x, y, width, height);
          ctx.globalAlpha = 1;
        }
      }

    componentDidMount(){
        var canvas = this.refs.canvas
        var ctx = canvas.getContext("2d")
        for(var n=0; n<this.props.road.length; n++){

            var x1 = this.props.road[n].x1;
            var y1 = this.props.road[n].y1;
            var w1 = this.props.road[n].w1;
            var x2 = this.props.road[n].x2;
            var y2 = this.props.road[n].y2;
            var w2 = this.props.road[n].w2;
            var color = this.props.road[n].color;
            var lanew1, lanew2, lanex1, lanex2, lane;
            console.log(x1)


            var r1 = this.rumbleWidth(w1, this.props.lanes);
            var r2 = this.rumbleWidth(w2, this.props.lanes);
            var l1 = this.laneMarkerWidth(w1, this.props.lanes);
            var l2 = this.laneMarkerWidth(w2, this.props.lanes);

            ctx.fillStyle = color.grass;
            ctx.fillRect(0, y2, this.props.width, y1 - y2);


           this.polygon(ctx, x1-w1-r1, y1, x1-w1, y1, x2-w2, y2, x2-w2-r2, y2, color.rumble);
           this.polygon(ctx, x1+w1+r1, y1, x1+w1, y1, x2+w2, y2, x2+w2+r2, y2, color.rumble);
           this.polygon(ctx, x1-w1,    y1, x1+w1, y1, x2+w2, y2, x2-w2,    y2, color.road);

        if (color.lane) {
           lanew1 = w1*2/this.props.lanes;
           lanew2 = w2*2/this.props.lanes;
           lanex1 = x1 - w1 + lanew1;
           lanex2 = x2 - w2 + lanew2;
           for(lane = 1 ; lane < this.props.lanes ; lanex1 += lanew1, lanex2 += lanew2, lane++)
             this.polygon(ctx, lanex1 - l1/2, y1, lanex1 + l1/2, y1, lanex2 + l2/2, y2, lanex2 - l2/2, y2, color.lane);
         }
        }

    }

    componentDidUpdate(){
        var canvas = this.refs.canvas
        var ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, this.props.width, this.props.height);
        for(var n=0; n<this.props.road.length; n++){

            var x1 = this.props.road[n].x1;
            var y1 = this.props.road[n].y1;
            var w1 = this.props.road[n].w1;
            var x2 = this.props.road[n].x2;
            var y2 = this.props.road[n].y2;
            var w2 = this.props.road[n].w2;
            var fog = this.props.road[n].fog;
            var color = this.props.road[n].color;
            var lanew1, lanew2, lanex1, lanex2, lane;
            var r1 = this.rumbleWidth(w1, this.props.lanes);
            var r2 = this.rumbleWidth(w2, this.props.lanes);
            var l1 = this.laneMarkerWidth(w1, this.props.lanes);
            var l2 = this.laneMarkerWidth(w2, this.props.lanes);


            ctx.fillStyle = color.grass;
            ctx.fillRect(0, y2, this.props.width, y1 - y2);
            this.polygon(ctx, x1-w1-r1, y1, x1-w1, y1, x2-w2, y2, x2-w2-r2, y2, color.rumble);
            this.polygon(ctx, x1+w1+r1, y1, x1+w1, y1, x2+w2, y2, x2+w2+r2, y2, color.rumble);
            this.polygon(ctx, x1-w1,    y1, x1+w1, y1, x2+w2, y2, x2-w2,    y2, color.road);
            //if(x1-w1-r1<0||y1<0||x1-w1<0||y2<0||x2-w2<0||x2-w2-r2<0)
            //console.log(1)
        if (color.lane) {
            lanew1 = w1*2/this.props.lanes;
            lanew2 = w2*2/this.props.lanes;
            lanex1 = x1 - w1 + lanew1;
            lanex2 = x2 - w2 + lanew2;

            for(lane = 1 ; lane < this.props.lanes ; lanex1 += lanew1, lanex2 += lanew2, lane++)
              this.polygon(ctx, lanex1 - l1/2, y1, lanex1 + l1/2, y1, lanex2 + l2/2, y2, lanex2 - l2/2, y2, color.lane);
          }
          this.fog(ctx, 0, y1, this.props.width, y2-y1, fog);
        }
        
    }

    canvasStyle = {     
        top: '0px',
        left:'0px',              
        position: 'absolute'     
    };
    render() {
        return <div>
        <canvas ref="canvas" width={this.props.width} height={this.props.height} style={this.canvasStyle} />
        </div>
    };
}

export default Road;