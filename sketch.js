// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

import colors from 'nice-color-palettes'
import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';

const colorIndex = 91;
const color = colors[colorIndex];

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  attributes: {antialias: true},
  dimensions: [1080, 1920],
  duration: 2,
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();


  const points = [];
  const particlesAmount = 100;
  for(let i = 0; i < particlesAmount; i++) {
    const p = i / particlesAmount;

    const x = p*Math.cos(p*60);
    const y = p*4;
    const z = p*Math.sin(p*60);

    points.push(new THREE.Vector3(x,y,z))
  }

  // Setup a geometry
  const geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 4000, 0.1, 40, false);

  // Setup a material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      playhead: {type: 'f', value: 0},
      colors: {type: 'fv1', value: color.map(c => (new THREE.Color(c)))},
    },
    side: THREE.DoubleSide,
    vertexShader,
    fragmentShader,
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  mesh.position.y = -2;

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time, playhead }) {
      mesh.rotation.y = playhead * Math.PI*2;
      material.uniforms.playhead.value = playhead;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
