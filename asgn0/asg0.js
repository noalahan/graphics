function main(){
    // retrieve canvas element
    var canvas = document.getElementById('canvas');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // get the rendering context for 2DCG
    var ctx = canvas.getContext('2d');

    // draw the rectangle
    ctx.fillStyle = 'rgba(255, 0, 0, 1.0)'; // sets color to blue
    ctx.fillRect(20, 0, 40, 80);        // fill rect with color
    ctx.fillRect(80, 0, 40, 80);        // fill rect with color
    ctx.fillRect(0, 20, 140, 40);        // fill rect with color
    ctx.fillRect(40, 60, 60, 40);        // fill rect with color
    ctx.fillRect(60, 100, 20, 20);        // fill rect with color
}