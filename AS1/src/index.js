
// APP INIT

// sets up a canvas with a pixel size feature
let setupCanvas = function(canvas, width, height, pixelSize) {
	// setup internal size, this effectively zooms the canvas to its style size
	canvas.width = width / pixelSize
	canvas.height = height / pixelSize

	// set how big the canvas is on the website
	canvas.style.width = width + 'px'
	canvas.style.height = height + 'px'
}

// creates a framebuffer with the matching size of the canvas
let createFramebuffer = function(context, width, height) {
	let framebuffer = context.createImageData(width, height)
	console.log(framebuffer)
	return framebuffer
}

// APP RUNTIME

let pixelIndex = function(x, y, framebuffer) {

	// EXERCISE 1

	// EXERCISE 1 END
}

// most basic function to draw to a framebuffer
function setPixel(x, y, color, framebuffer) {

	// EXERCISE 1

	// EXERCISE 1 END

	let data = framebuffer.data
	let offset = pixelIndex(x, y, framebuffer)
	data[offset + 0] = color[0]
	data[offset + 1] = color[1]
	data[offset + 2] = color[2]
	data[offset + 3] = color[3]
}

// draw some pixels
function renderScene(framebuffer) {
	let red   = [255, 0, 0, 255]
	let green = [0, 255, 0, 255]
	let blue  = [0, 0, 255, 255]
	setPixel(1, 1, red, framebuffer)
	setPixel(10, 10, green, framebuffer)
	setPixel(10, 1, blue, framebuffer)

	// EXERCISE 1

	// EXERCISE 1 END
}


// APP DEMO

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 400
const CANVAS_PIXELSIZE = 5

// get and customize our canvas 
let canvas = document.getElementById('canvas')
setupCanvas(canvas, CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_PIXELSIZE)

// get our appropiate framebuffer from the context
let context = canvas.getContext('2d')
let framebuffer = createFramebuffer(context, canvas.width, canvas.height)

// render our scene in the framebuffer and show it in the canvas
renderScene(framebuffer)
context.putImageData(framebuffer, 0, 0)
