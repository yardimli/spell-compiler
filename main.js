// main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Nebula, {
	Emitter,
	SpriteRenderer,
	Rate,
	Span,
	Position,
	Mass,
	Radius,
	Life,
	VectorVelocity,
	PointZone,
	Alpha,
	Scale,
	Color,
	Force,
	RandomDrift,
	SphereZone
} from 'three-nebula';

// Global variables
let scene, camera, renderer, controls, clock, nebula;
const balls = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Create particle texture
function createParticleTexture() {
	const canvas = document.createElement('canvas');
	canvas.width = 64;
	canvas.height = 64;
	const context = canvas.getContext('2d');
	
	const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
	gradient.addColorStop(0, 'rgba(255,255,255,1)');
	gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
	gradient.addColorStop(0.4, 'rgba(255,255,255,0.6)');
	gradient.addColorStop(1, 'rgba(255,255,255,0)');
	
	context.fillStyle = gradient;
	context.fillRect(0, 0, 64, 64);
	
	return new THREE.CanvasTexture(canvas);
}

// Initialize scene
function init() {
	// Scene setup
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x0a0a0a);
	
	// Camera setup
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(20, 15, 20);
	
	// Renderer setup
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	document.body.appendChild(renderer.domElement);
	
	// Controls setup
	controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;
	controls.minDistance = 5;
	controls.maxDistance = 100;
	controls.maxPolarAngle = Math.PI / 2 + 0.1;
	controls.enablePan = true;
	
	// Lighting
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
	scene.add(ambientLight);
	
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
	directionalLight.position.set(20, 30, 10);
	scene.add(directionalLight);
	
	// Ground
	const groundGeometry = new THREE.PlaneGeometry(100, 100);
	const groundMaterial = new THREE.MeshStandardMaterial({
		color: 0x1a1a1a,
		roughness: 0.9,
		metalness: 0.1
	});
	const ground = new THREE.Mesh(groundGeometry, groundMaterial);
	ground.rotation.x = -Math.PI / 2;
	ground.receiveShadow = true;
	scene.add(ground);
	
	// Grid helper
	const gridHelper = new THREE.GridHelper(100, 50, 0x333333, 0x222222);
	scene.add(gridHelper);
	
	// Clock
	clock = new THREE.Clock();
	
	// Nebula setup with proper texture
	nebula = new Nebula();
	const spriteRenderer = new SpriteRenderer(scene, THREE, {
		texture: createParticleTexture()
	});
	nebula.addRenderer(spriteRenderer);
	
	// Event listeners
	window.addEventListener('resize', onWindowResize);
	window.addEventListener('click', onMouseClick);
	
	// Compile button
	document.getElementById('compileButton').addEventListener('click', onCompile);
	
	// Create demo balls
	createBall('fire', 'small', -10, 5, -10);
	// createBall('water', 'large', 10, 5, -10);
	// createBall('earth', 'small', -10, 5, 10);
	// createBall('air', 'extra large', 10, 5, 10);
}

// Create elemental ball
function createBall(element, size, x, y, z) {
	const sizeMap = {
		'small': 1,
		'medium': 1.5,
		'large': 2,
		'extra large': 2.5
	};
	
	const scale = sizeMap[size] || 1.5;
	
	// Create particle emitter based on element type
	const emitter = createElementalEmitter(element, scale, new THREE.Vector3(x, y, z));
	
	// Add to nebula system
	nebula.addEmitter(emitter);
	
	// Store ball data for animation
	balls.push({
		emitter: emitter,
		initialPosition: new THREE.Vector3(x, y, z),
		currentPosition: new THREE.Vector3(x, y, z),
		time: Math.random() * Math.PI * 2,
		amplitude: {
			x: (Math.random() - 0.5) * 2,
			y: Math.random() * 1.5 + 0.5,
			z: (Math.random() - 0.5) * 2
		},
		frequency: {
			x: Math.random() * 0.5 + 0.5,
			y: Math.random() * 0.3 + 0.7,
			z: Math.random() * 0.5 + 0.5
		}
	});
	
	return emitter;
}

// Create elemental particle emitter
function createElementalEmitter(element, scale, position) {
	const emitter = new Emitter();
	const texture = createParticleTexture();
	
	// Common settings
	const particleCount = 100 * scale;
	
	switch(element) {
		case 'fire':
			emitter
				.setRate(new Rate(new Span(20, 30), new Span(0.01, 0.02)))
				.setInitializers([
					new Position(new SphereZone(0, 0, 0, scale * 0.5)),
					new Mass(0.5),
					new Life(new Span(0.5, 1.5)),
					new Radius(new Span(10, 20) ),
					new VectorVelocity(
						new THREE.Vector3(0, 1, 0),
						scale * 100,
						new Span(0, Math.PI / 8)
					)
				])
				.setBehaviours([
					new Alpha(1, 0),
					new Scale(new Span(1, 1.5), 0),
					new Color(new THREE.Color('#ff3300'), new THREE.Color('#ffaa00')),
					new RandomDrift(scale * 10, scale * 5, scale * 10, 0.2),
					new Force(0, scale * 50, 0)
				])
				.setPosition(position);
			break;
		
		case 'water':
			emitter
				.setRate(new Rate(new Span(30, 40), new Span(0.01, 0.02)))
				.setInitializers([
					new Position(new SphereZone(0, 0, 0, scale * 0.3)),
					new Mass(1),
					new Life(new Span(1, 2)),
					new Radius(new Span(8, 15)),
					new VectorVelocity(
						new THREE.Vector3(0, -0.5, 0),
						scale * 80,
						new Span(0, Math.PI / 6)
					)
				])
				.setBehaviours([
					new Alpha(0.8, 0),
					new Scale(new Span(0.8, 1), new Span(0.5, 0.8)),
					new Color(new THREE.Color('#0066ff'), new THREE.Color('#00ccff')),
					new Force(0, -scale * 100, 0)
				])
				.setPosition(position);
			break;
		
		case 'earth':
			emitter
				.setRate(new Rate(new Span(10, 15), new Span(0.02, 0.04)))
				.setInitializers([
					new Position(new SphereZone(0, 0, 0, scale)),
					new Mass(2),
					new Life(new Span(2, 3)),
					new Radius(new Span(15, 25)),
					new VectorVelocity(
						new THREE.Vector3(0, 0, 0),
						scale * 20,
						new Span(0, Math.PI * 2)
					)
				])
				.setBehaviours([
					new Alpha(1, 0.5),
					new Scale(new Span(1.2, 1.5), new Span(0.8, 1)),
					new Color(new THREE.Color('#8B4513'), new THREE.Color('#D2691E')),
					new Force(0, -scale * 30, 0)
				])
				.setPosition(position);
			break;
		
		case 'air':
			emitter
				.setRate(new Rate(new Span(15, 25), new Span(0.01, 0.03)))
				.setInitializers([
					new Position(new SphereZone(0, 0, 0, scale * 1.5)),
					new Mass(0.3),
					new Life(new Span(1.5, 2.5)),
					new Radius(new Span(12, 20)),
					new VectorVelocity(
						new THREE.Vector3(0, 0, 0),
						scale * 60,
						new Span(0, Math.PI * 2)
					)
				])
				.setBehaviours([
					new Alpha(0.5, 0),
					new Scale(new Span(0.8, 1.2), new Span(1.5, 2)),
					new Color(new THREE.Color('#e0e0e0'), new THREE.Color('#ffffff')),
					new RandomDrift(scale * 30, scale * 10, scale * 30, 0.3)
				])
				.setPosition(position);
			break;
	}
	
	emitter.emit(particleCount);
	return emitter;
}

// Handle window resize
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle mouse click
function onMouseClick(event) {
	// Ignore clicks on UI elements
	if (event.target.tagName === 'TEXTAREA' || event.target.tagName === 'BUTTON') {
		return;
	}
	
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	
	raycaster.setFromCamera(mouse, camera);
	
	// Create a plane at y = 0 for intersection
	const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
	const intersectPoint = new THREE.Vector3();
	raycaster.ray.intersectPlane(plane, intersectPoint);
	
	if (intersectPoint) {
		const elements = ['fire', 'water', 'earth', 'air'];
		const sizes = ['small', 'medium', 'large', 'extra large'];
		
		const randomElement = elements[Math.floor(Math.random() * elements.length)];
		const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
		
		createBall(randomElement, randomSize, intersectPoint.x, 5, intersectPoint.z);
	}
}

// Handle compile button
function onCompile() {
	const code = document.getElementById('codeTextarea').value;
	try {
		// Create a function that has access to createBall
		const func = new Function('createBall', code);
		func(createBall);
	} catch (error) {
		console.error('Compile error:', error);
		alert('Error: ' + error.message);
	}
}

// Animation loop
function animate() {
	requestAnimationFrame(animate);
	
	const deltaTime = clock.getDelta();
	const elapsedTime = clock.getElapsedTime();
	
	// Update controls
	controls.update();
	
	// Update nebula
	if (nebula) {
		nebula.update(deltaTime);
	}
	
	// Animate balls floating motion
	balls.forEach(ball => {
		const t = elapsedTime + ball.time;
		
		ball.currentPosition.x = ball.initialPosition.x +
			Math.sin(t * ball.frequency.x) * ball.amplitude.x;
		
		ball.currentPosition.y = ball.initialPosition.y +
			Math.sin(t * ball.frequency.y) * ball.amplitude.y;
		
		ball.currentPosition.z = ball.initialPosition.z +
			Math.cos(t * ball.frequency.z) * ball.amplitude.z;
		
		// Update emitter position
		ball.emitter.setPosition(ball.currentPosition);
	});
	
	// Render
	renderer.render(scene, camera);
}

// Start the application
init();
animate();
