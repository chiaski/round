
let socket
let capture
let color = '#ff0000'
let strokeWidth = 4

var hue;

function setup() {
    hue = 80;
    
	// Creating canvas
	const cv = createCanvas(windowWidth, windowHeight)
	cv.background(0)
    cv.parent("paint")
    
    capture = createCapture(VIDEO);
    capture.size(500, 240);

	// Start the socket connection
	socket = io.connect(); 
    
	// Getting our buttons and the holder through the p5.js dom
	const color_picker = select('#pickcolor')
	const color_btn = select('#color-btn')
	const color_holder = select('#color-holder')

	const stroke_width_picker = select('#stroke-width-picker')
	const stroke_btn = select('#stroke-btn')
    
	// Callback function
	socket.on('mouse', data => {
		stroke(data.color)
		strokeWeight(data.strokeWidth)
		line(data.x, data.y, data.px, data.py)
	})

    
    
    
	// Adding a mousePressed listener to the button
	/* color_btn.mousePressed(() => {
		// Checking if the input is a valid hex color
		if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color_picker.value())) {
			color = color_picker.value()
			color_holder.style('background-color', color)
		}
		else {console.log('Enter a valid hex value')}
	}) */
    
	// Adding a mousePressed listener to the button
	/*
    stroke_btn.mousePressed(() => {
        hue > 360 ? hue = 0 : hue += 3;
        colorMode(HSL, 360);
        noStroke();
        fill(hue, 200, 200);
        
	})
    */
    
    
}

function draw(){   
  image(capture, 200, 100, 400, 240);
}

function mouseDragged() {
    
    hue > 360 ? hue = 30 : hue += 3;
    colorMode(HSL, 360);
    noStroke();
    fill(hue, 200, 200);
        
	// Draw
	stroke(hue)
	strokeWeight(strokeWidth)
	line(mouseX, mouseY, pmouseX, pmouseY)

	// Send the mouse coordinates
	sendmouse(mouseX, mouseY, pmouseX, pmouseY)
}

// Sending data to the socket
function sendmouse(x, y, pX, pY) {
	const data = {
		x: x,
		y: y,
		px: pX,
		py: pY,
		color: hue,
		strokeWidth: strokeWidth,
	}

	socket.emit('mouse', data)
}


function canvasToBase64 () {
    var c = $('#paint').find('canvas'); // using jQuery
    var imageData = c[0].toDataURL('image/png'); // produces a base64 image string
    // send imageData to server.....
    console.log(imageData);
}