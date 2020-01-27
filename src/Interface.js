import React from 'react';

class Interface extends React.Component {


    BACKGROUND_COLOR = 'green';
    buttonStyle = {        
        display: 'table-cell',
        'text-align': 'center',
        'vertical-align': 'middle',
        'color':'red',
        'height':this.props.height/10,
        'width':this.props.width/3,
        'margin': '30px',
        'font-size':this.props.height/15
    };
    titleStyle = {        
        display: 'inline-block',
        'text-align': 'center',
        'color':'red',
        'height':this.props.height/5,
        'width':this.props.width-200,
        'margin': '50px',
        'font-size':this.props.height/5
    };
    hsStyle = {        
        display: 'inline-block',
        'text-align': 'center',
        'color':'black',
        'margin': '3px',
        'font-size':this.props.height/20
    };

    constructor(props) {
        super(props);

        this.state = {
            play : false,
            highscores : false
        }
        this.back = this.back.bind(this);
        this.play = this.play.bind(this);
        this.highscores = this.highscores.bind(this);
      };

    componentDidUpdate(){
        this.titleStyle = {        
            display: 'inline-block',
            'text-align': 'center',
            'color':'red',
            'height':this.props.height/5,
            'width':this.props.width-200,
            'margin': '50px',
            'font-size':this.props.height/5
        };
        this.buttonStyle = {        
            display: 'table-cell',
            'text-align': 'center',
            'vertical-align': 'middle',
            'color':'red',
            'height':this.props.height/10,
            'width':this.props.width/3,
            'margin': '30px',
            'font-size':this.props.height/15
        };
        this.hsStyle = {        
            display: 'inline-block',
            'text-align': 'center',
            'color':'black',
            'margin': '3px',
            'font-size':this.props.height/20
        };
    }

    back (){
        if (this.state.play){
            this.setState({
                play:false
            })
        }
        else {
            this.setState({
                highscores:false
            })
        }
    }

    play (){
        this.setState({
            play:true
        })

    }

    highscores (){
        this.setState({
            highscores:true
        })
    }


    render (){
        return <div style={{'width':this.props.width,'height':this.props.height, 'background':this.BACKGROUND_COLOR,'text-align': 'center'}}>
            <div><span style={this.titleStyle}>GameTitle</span></div>
            {this.state.play ? <div>
                <div><button onClick={() => this.props.sendData(1)} style={this.buttonStyle}>Level 1</button></div>
                <div><button onClick={() => this.props.sendData(2)} style={this.buttonStyle}>Level 2</button></div>
                <div><button onClick={this.back} style={this.buttonStyle}>Back</button></div>
                </div> : this.state.highscores ?
                    <div>
                    {this.props.highscores.map( highscore => (<div><label style={this.hsStyle}>{highscore.place}. </label><label style={this.hsStyle}>{highscore.who}</label><label style={this.hsStyle}>Score: {highscore.score}</label></div>))}
                    <div><button onClick={this.back} style={this.buttonStyle}>Back</button></div>
                    </div>
                    :
                    <div>
                    <div><button onClick={this.play} style={this.buttonStyle}>Play</button></div>
                    <div><button onClick={this.highscores} style={this.buttonStyle}>Highscores</button></div>
                    </div>
            }
            </div>
    };
}

export default Interface;