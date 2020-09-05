const ACCELERATION = 10;
const MAX_DOTS = 1000;

function onMouseMove(state, event) {
	state.mouse = {
		x: event.offsetX,
		y: event.offsetY,
		dx: event.offsetX - state.mouse.x,
		dy: event.offsetY - state.mouse.y
	};

	// If mouse primary is pressed at time of move event
	if (event.buttons === 1) {
		state.dots.unshift({
			x: event.offsetX,
			y: event.offsetY,
			dx: state.mouse.dx,
			dy: state.mouse.dy
		});
	
		if (state.dots.length >= MAX_DOTS) {
			state.dots.pop();
		}
	}
}


function rgb(r, g, b) {
	return rgba(r, g, b, 1);
}

function rgba(r, g, b, a) {
	return `rgba(${r},${g},${b},${a})`;
}

function hsl(hue, saturation, value) {
	return `hsl(${hue},${saturation}%,${value}%)`;
}

function toDegrees(radian) {
	return (radian * 180) / Math.PI;
}

function drawDot(ctx, timestamp, center, dot) {
	// Distances from center
	const x = dot.x - center.x;
	const y = dot.y - center.y;

	// Remember to convert radians to degrees!
	const rad = Math.atan(x / y);
	let angle = toDegrees(rad);
	if (y > 0) {
		angle += 180
	}

	const color = hsl((angle + timestamp * 0.1) % 360, 100, 50);

	ctx.fillStyle = color;
	ctx.fillRect(dot.x, dot.y, 20, 20);
}

function resize(ctx) {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
}

function animate(state) {
	const now = Date.now();
	const secondsInterval = (now - state.timestamp) / 1000;

	state.dots.forEach(dot => {
		dot.dy += ACCELERATION * secondsInterval;
		dot.y += dot.dy;

		dot.x += dot.dx;
	});

	state.timestamp = now;
	// Reset mouse velocity
	state.mouse.dx = 0;
	state.mouse.dy = 0;
}

function render(ctx, state) {
	animate(state);

	resize(ctx);
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	const center = {
		x: ctx.canvas.width / 2,
		y: ctx.canvas.height / 2
	};

	state.dots.forEach(dot => drawDot(ctx, state.timestamp, center, dot));

	requestAnimationFrame(() => render(ctx, state));
}

window.onload = () => {
	const canvas = document.getElementById('myCanvas');
	const ctx = canvas.getContext('2d');

	const state = {
		mouse: {
			x: 0,
			y: 0,
			dx: 0,
			dy: 0
		},
		dots: [],
		timestamp: Date.now()
	};

	canvas.addEventListener('mousemove', (e) => onMouseMove(state, e));

	// Begin render loop
	render(ctx, state);
}