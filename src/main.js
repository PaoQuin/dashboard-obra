import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { crearEdificio } from './edificio.js';
import { configurarSlider } from './tiempo.js';
import { activarClick } from './interaccion.js';
import './style.css';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 200);
camera.position.set(28, 18, -14);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(5.5, 2.5, 12);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sol = new THREE.DirectionalLight(0xffffff, 1.2);
sol.position.set(10, 20, 10);
scene.add(sol);
const grilla = new THREE.GridHelper(40, 40);
grilla.position.set(5.5, 0, 12);
scene.add(grilla);

const { elementos } = await (await fetch('/data/obra.json')).json();
const { grupo, mallas } = crearEdificio(elementos);
scene.add(grupo);

configurarSlider(elementos, mallas);
activarClick(camera, renderer, mallas);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});
