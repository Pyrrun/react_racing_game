import React from 'react';

function Stats(props) {
    const divStyle = {        
        width: props.width, 
        height: props.height/15, 
        top: 0,
        left: 0,
        position: 'absolute',
        display: 'table',
        'table-layout': 'fixed',
        'background': "rgba(0, 0, 0, 0.2)",       
    };
    const spanStyle = {        
        display: 'table-cell',
        'text-align': 'center',
        'vertical-align': 'middle',
        'color':'red'
    };
    return (
        <div style ={divStyle}>
            <span style={spanStyle}>Obecny czas: {Number(props.currentLapTime).toFixed(2)} s</span>
            <span style={spanStyle}>Ostatni czas: {Number(props.lastLapTime).toFixed(2)} s</span>
            <span style={spanStyle}>Najlepszy czas: {Number(props.fastest_lap_time).toFixed(2)} s</span>
            <span style={spanStyle}>highscore: {Number(props.best).toFixed(2)} s</span>
            <span style={spanStyle}>Prędkość: {props.speed} km/h</span>
        </div>
    );
}

export default Stats;