import React from 'react';

class Background extends React.Component {
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
        var rotation = 0;
        var offset   = this.props.offset   || 0;
        var layer = this.props.layer
        var ctx = this.refs.canvas.getContext('2d')
        var img = this.refs.img
        var imageW = layer.w/2;
        var imageH = layer.h;
    
        var sourceX = layer.x + Math.floor(layer.w * offset);
        var sourceY = 0
        var sourceW = Math.min(imageW, layer.x+layer.w-sourceX);
        var sourceH = imageH;
        
        var destX = 0;
        var destY = rotation;
        var destW = Math.floor(this.props.width * (sourceW/imageW));
        var destH = this.props.height;
        ctx.clearRect(0, 0, this.props.width, this.props.height);
        ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH);
        if (sourceW < imageW)
          ctx.drawImage(img, layer.x, sourceY, imageW-sourceW, sourceH, destW-10, destY, (this.props.width)-destW+10, destH);
    }

    render (){
        return <div>
            <img src={this.props.backgroundImage} style={this.bgStyle} ref="img"/>
            <canvas ref="canvas" width={this.props.width} height={this.props.height} style={this.canvasStyle} />
            </div>
    };
}

export default Background;