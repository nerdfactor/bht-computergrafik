// APP INIT

// sets up a canvas with a pixel size feature
let setupCanvas = function (canvas, width, height, pixelSize) {
	// setup internal size, this effectively zooms the canvas to its style size
	canvas.width = width / pixelSize
	canvas.height = height / pixelSize

	// set how big the canvas is on the website
	canvas.style.width = width + 'px'
	canvas.style.height = height + 'px'
}

// creates a framebuffer with the matching size of the canvas
let createFramebuffer = function (context, width, height) {
	let framebuffer = context.createImageData(width, height)
	console.log(framebuffer)
	return framebuffer
}

// APP RUNTIME

let pixelIndex = function (x, y, framebuffer) {

	// EXERCISE 1
	let colorChannels = 4
	return (y * framebuffer.width + x) * colorChannels
	// EXERCISE 1 END
}

// most basic function to draw to a framebuffer
function setPixel(x, y, color, framebuffer) {
	// check required parameters
	if(x == null || y == null) {
		console.log("x or y is null or undefined")
		return
	}
	if (framebuffer == null || framebuffer.width == null) {
		console.log("framebuffer is null or undefined")
		return
	}
	if (color == null || color.length < 4) {
		console.log("color is null or undefined")
		return
	}

	// EXERCISE 1

	// Round coordinates to handle float values. Uses default rounding mode.
	[x, y] = roundCoordinates(x, y);

	if (COORDINATE_CLAMPING) {
		// Clamp coordinates to the bounds of the canvas.
		[x, y] = clampCoordinates(x, y, framebuffer.width, framebuffer.height);
	}

	// Discard coordinates outside the canvas bounds.
	if (shouldDiscardCoordinates(x, y, framebuffer.width, framebuffer.height)) {
		return
	}

	// EXERCISE 1 END

	let data = framebuffer.data
	let offset = pixelIndex(x, y, framebuffer)
	data[offset + 0] = color[0]
	data[offset + 1] = color[1]
	data[offset + 2] = color[2]
	data[offset + 3] = color[3]
}

/**
 * Draws a line from the coordinates (x0, y0) to (x1, y1) with the specified color.
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 * @param color
 * @param framebuffer
 * @param algorythm
 */
function drawLine(x0, y0, x1, y1, color, framebuffer, algorythm = LINE_ALGORITHM) {
	if (algorythm === 'bresenham') {
		drawLineBresenham(x0, y0, x1, y1, color, framebuffer)
	} else if (algorythm === 'dda') {
		drawLineDDA(x0, y0, x1, y1, color, framebuffer)
	}
}

/**
 * Draws a line using the Bresenham algorithm.
 * @param startX
 * @param startY
 * @param endX
 * @param endY
 * @param color
 * @param framebuffer
 */
function drawLineBresenham(startX, startY, endX, endY, color, framebuffer) {
	const deltaX = Math.abs(endX - startX)
	const deltaY = Math.abs(endY - startY)

	let signX = startX < endX ? 1 : -1
	let signY = startY < endY ? 1 : -1

	let decisionParam

	if (deltaX >= deltaY) {
		decisionParam = 2 * deltaY - deltaX

		while (startX !== endX) {
			setPixel(startX, startY, color, framebuffer)

			if (decisionParam > 0) {
				startY += signY
				decisionParam -= 2 * deltaX
			}

			startX += signX
			decisionParam += 2 * deltaY
		}
	} else {
		decisionParam = 2 * deltaX - deltaY

		while (startY !== endY) {
			setPixel(startX, startY, color, framebuffer)

			if (decisionParam > 0) {
				startX += signX
				decisionParam -= 2 * deltaY
			}

			startY += signY
			decisionParam += 2 * deltaX
		}
	}

	setPixel(endX, endY, color, framebuffer)
}

/**
 * Draws a line using the DDA algorithm.
 * @param startX
 * @param startY
 * @param endX
 * @param endY
 * @param color
 * @param framebuffer
 */
function drawLineDDA(startX, startY, endX, endY, color, framebuffer) {
	const deltaX = endX - startX
	const deltaY = endY - startY

	const steps = Math.max(Math.abs(deltaX), Math.abs(deltaY))

	const xIncrement = deltaX / steps
	const yIncrement = deltaY / steps

	let x = startX
	let y = startY

	for (let i = 0; i <= steps; i++) {
		setPixel(Math.round(x), Math.round(y), color, framebuffer)

		x += xIncrement
		y += yIncrement
	}
}

// draw some pixels
function renderScene(framebuffer) {
	// let red = [255, 0, 0, 255]
	// let green = [0, 255, 0, 255]
	// let blue = [0, 0, 255, 255]
	// setPixel(1, 1, red, framebuffer)
	// setPixel(10, 10, green, framebuffer)
	// setPixel(10, 1, blue, framebuffer)

	// EXERCISE 1
	// testDrawSmallestCoordinates(framebuffer)
	// testDrawLargestCoordinates(framebuffer)
	// testDrawCoordinatesWithinCanvas(framebuffer)
	// testDrawCoordinatesOutsideCanvas(framebuffer)
	// testDrawWithFloatCoordinates(framebuffer)
	//
	// drawImageFromPixelArray(exampleImageRawData, 80, 50, 30, 20, framebuffer)

	// EXERCISE 1 END

	// EXERCISE 2

	testDrawLineHorizontal(framebuffer)
	testDrawLineVertical(framebuffer)
	testDrawLineDiagonal(framebuffer)
	testDrawLineLogo(framebuffer)

	// EXERCISE 2 END

}

/**
 * Rounds coordinates to the nearest integer. The rounding mode can be specified
 * or uses the default mode. Unknown modes will return the original coordinates.
 * @param x The x coordinate.
 * @param y The y coordinate.
 * @param mode The rounding mode. Default is COORDINATE_ROUNDING.
 * @returns {number[]} Tuple of rounded coordinates.
 */
function roundCoordinates(x, y, mode = undefined) {
	mode = mode || COORDINATE_ROUNDING
	switch (mode) {
		case 'round':
			return [Math.round(x), Math.round(y)]
		case 'floor':
			return [Math.floor(x), Math.floor(y)]
		case 'ceil':
			return [Math.ceil(x), Math.ceil(y)]
		case 'trunc':
			return [Math.trunc(x), Math.trunc(y)]
	}
	return [x, y]
}

/**
 * Clamps coordinates to the bounds of an area (i.e. the canvas).
 * @param x he x coordinate.
 * @param y The y coordinate.
 * @param width The width of the area.
 * @param height The height of the area.
 * @returns {number[]} Tuple of the clamped coordinates.
 */
function clampCoordinates(x, y, width, height) {
	x = Math.max(0, Math.min(x, width - 1))
	y = Math.max(0, Math.min(y, height - 1))
	return [x, y]
}

/**
 * Checks if the coordinates are outside the bounds of an area (i.e. the canvas)
 * and should be discarded.
 * @param x
 * @param y
 * @param width
 * @param height
 */
function shouldDiscardCoordinates(x, y, width, height) {
	return x < 0 || x >= width || y < 0 || y >= height
}

/**
 * Returns the size of the canvas in pixels adjusted by the zoom factor.
 * @returns {number[]}
 */
function getZoomedCanvasSize() {
	return [CANVAS_WIDTH / CANVAS_PIXELSIZE, CANVAS_HEIGHT / CANVAS_PIXELSIZE]
}

/**
 * Tests drawing pixels at the smallest coordinates.
 * Expect the pixel to be drawn in the top left corner of the canvas.
 * @param framebuffer The framebuffer to draw on.
 */
function testDrawSmallestCoordinates(framebuffer) {
	let magenta = [255, 0, 255, 255];
	setPixel(0, 0, magenta, framebuffer)
}

/**
 * Tests drawing pixels at the largest coordinates.
 * Expect the pixel to be drawn in the bottom right corner of the canvas.
 * @param framebuffer The framebuffer to draw on.
 */
function testDrawLargestCoordinates(framebuffer) {
	let [x, y] = getZoomedCanvasSize()
	let cyan = [0, 255, 255, 255];
	setPixel(x - 1, y - 1, cyan, framebuffer)
}

/**
 * Tests drawing pixels within the canvas bounds.
 * Expects the pixel to be drawn in the upper center of the canvas.
 * @param framebuffer The framebuffer to draw on.
 */
function testDrawCoordinatesWithinCanvas(framebuffer) {
	let [x, y] = getZoomedCanvasSize()
	let maroon = [128, 0, 0, 255];
	setPixel(x / 2, y / 8, maroon, framebuffer)
}

/**
 * Tests drawing pixels outside the canvas.
 * Expects the pixels to be clamped to the bounds of the canvas if
 * COORDINATE_CLAMPING is enabled. If not, the pixels will be discarded.
 * @param framebuffer The framebuffer to draw on.
 */
function testDrawCoordinatesOutsideCanvas(framebuffer) {
	let [x, y] = getZoomedCanvasSize()
	let deepPink = [255, 20, 147, 255];
	setPixel(x * -1, y / 2, deepPink, framebuffer)
	setPixel(x / 2, y * -1, deepPink, framebuffer)
	setPixel(x * 2, y / 2, deepPink, framebuffer)
	setPixel(x / 2, y * 2, deepPink, framebuffer)
}

/**
 * Tests drawing pixels with float coordinates. Draws helper pixels next to
 * the pixel with float values to validate the rounding behavior.
 * Expects the pixels to be rounded depending on the current rounding mode.
 * todo: change setPixel() method signature to pass rounding mode for better testing?
 */
function testDrawWithFloatCoordinates() {
	let orange = [255, 165, 0, 255];
	let teal = [0, 128, 128, 255];

	// expects pixels to be drawn (next, on top, next, on top) of each other.
	setPixel(22, 22, orange, framebuffer)
	setPixel(22.5, 22.5, teal, framebuffer)

	// expects pixels to be drawn (on top, on top, next, on top) of each other.
	setPixel(22, 32, orange, framebuffer)
	setPixel(22.2, 32.2, teal, framebuffer)

	// expects pixels to be drawn (next, on top, next, on top) of each other.
	setPixel(22, 42, orange, framebuffer)
	setPixel(22.7, 42.7, teal, framebuffer)

	// expects pixels to be drawn (on top, on top, next, on top) of each other.
	// javascript edge case for coordinate rounding in ceil mode
	// expects to be rounded to 23, 53 but is rounded down.
	setPixel(22, 52, orange, framebuffer)
	setPixel(22.000000000000000000000000001, 52.000000000000000000000000001, teal, framebuffer)
}

/**
 * Test drawing horizontal lines.
 * Expects two horizontal lines to be drawn next to each other.
 * @param framebuffer
 */
function testDrawLineHorizontal(framebuffer) {
	let red = [255, 0, 0, 255]
	drawLine(4, 4, 24, 4, red, framebuffer)
	let blue = [0, 0, 255, 255]
	drawLine(24, 6, 4, 6, blue, framebuffer)
}

/**
 * Test drawing vertical lines.
 * Expects two vertical lines to be drawn next to each other.
 * @param framebuffer
 */
function testDrawLineVertical(framebuffer) {
	let orange = [255, 165, 0, 255]
	drawLine(4, 8, 4, 28, orange, framebuffer)
	let green = [0, 255, 0, 255]
	drawLine(6, 28, 6, 8, green, framebuffer)
}

/**
 * Test drawing lines from a central point diagonally every 45 degrees.
 * Expect lines to be drawn in the form of a star.
 * @param framebuffer
 */
function testDrawLineDiagonal(framebuffer) {
	let lime = [0, 255, 0, 255]
	let yellow = [255, 255, 0, 255]
	let cyan = [0, 255, 255, 255]
	let purple = [128, 0, 128, 255]
	let pink = [255, 192, 203, 255]
	let maroon = [128, 0, 0, 255]
	let teal = [0, 128, 128, 255]
	let green = [0, 128, 0, 255]

	drawLine(30, 30, 50, 50, lime, framebuffer)
	drawLine(30, 30, 50, 30, yellow, framebuffer)
	drawLine(30, 30, 50, 10, cyan, framebuffer)
	drawLine(30, 30, 30, 10, purple, framebuffer)
	drawLine(30, 30, 10, 10, pink, framebuffer)
	drawLine(30, 30, 10, 30, maroon, framebuffer)
	drawLine(30, 30, 10, 50, teal, framebuffer)
	drawLine(30, 30, 30, 50, green, framebuffer)
}

/**
 * Test drawing BHT logo using line primitives.
 * @param framebuffer
 */
function testDrawLineLogo(framebuffer) {
	let black = [0, 0, 0, 255]

	drawLine(55, 20, 55, 32, black, framebuffer);
	drawLine(55, 20, 60, 20, black, framebuffer);
	drawLine(60, 20, 62, 22, black, framebuffer);
	drawLine(62, 22, 62, 24, black, framebuffer);
	drawLine(62, 24, 60, 26, black, framebuffer);
	drawLine(60, 26, 55, 26, black, framebuffer);
	drawLine(60, 26, 62, 28, black, framebuffer);
	drawLine(55, 32, 60, 32, black, framebuffer);

	drawLine(70, 24, 70, 32, black, framebuffer);
	drawLine(80, 20, 80, 32, black, framebuffer);
	drawLine(70, 26, 80, 26, black, framebuffer);

	drawLine(87, 20, 87, 32, black, framebuffer);
	drawLine(82, 20, 92, 20, black, framebuffer);

	drawLine(58, 38, 74, 16, black, framebuffer);
}

/**
 * Draws an image provided as a flat array of the rgba color values for each pixel.
 * The image will be drawn at the specified starting coordinates within the canvas.
 * @param pixelArray The flat array of rgba color values for each pixel.
 * @param imageWidth The width of the image.
 * @param imageHeight The height of the image.
 * @param startX The x coordinate to start drawing the image.
 * @param startY The y coordinate to start drawing the image.
 * @param framebuffer The framebuffer to draw on.
 */
function drawImageFromPixelArray(pixelArray, imageWidth, imageHeight, startX, startY, framebuffer) {

	// iterate over the image pixel by pixel.
	for (let y = 0; y < imageHeight; y++) {
		for (let x = 0; x < imageWidth; x++) {
			// calculate the index of the pixel within the image like in pixelIndex()
			// but with the image size instead of the full canvas size.
			let colorChannels = 4;
			let index = (y * imageWidth + x) * colorChannels;
			// the color of each pixel is provided within the raw image data.
			let color = [
				pixelArray[index],
				pixelArray[index + 1],
				pixelArray[index + 2],
				pixelArray[index + 3]
			];
			// adjust the coordinates for the starting position.
			let drawX = startX + x;
			let drawY = startY + y;

			setPixel(drawX, drawY, color, framebuffer);
		}
	}
}


// APP DEMO

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 400
const CANVAS_PIXELSIZE = 5
const COORDINATE_ROUNDING = 'round' // 'round', 'floor', 'ceil', 'trunc'
const COORDINATE_CLAMPING = false
const LINE_ALGORITHM = 'bresenham' // 'bresenham', 'dda'

// get and customize our canvas 
let canvas = document.getElementById('canvas')
setupCanvas(canvas, CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_PIXELSIZE)

// get our appropiate framebuffer from the context
let context = canvas.getContext('2d')
let framebuffer = createFramebuffer(context, canvas.width, canvas.height)

// render our scene in the framebuffer and show it in the canvas
renderScene(framebuffer)
context.putImageData(framebuffer, 0, 0)
