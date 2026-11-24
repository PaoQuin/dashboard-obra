// =====================================================================
// CÓDIGO DEL EQUIPO · Responsable: Ali
// escena.js: crea la escena, la cámara, las luces, los controles
// y el render loop. Es el "escenario" donde se dibuja todo.
// =====================================================================

// Librería externa: Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function crearEscena() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdfe6ee);
  scene.fog = new THREE.Fog(0xdfe6ee, 40, 90);

  // Cámara en perspectiva: campo de visión 50°, near 0.1, far 200
  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 200);
  camera.position.set(28, 18, -14);

  // El renderer es el que habla con WebGL
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  // Controles para girar y acercar con el mouse
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(5.5, 2.5, 12);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.6;
  controls.addEventListener('start', () => (controls.autoRotate = false));

  // Luces: sin ellas MeshStandardMaterial se ve negro
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const sol = new THREE.DirectionalLight(0xffffff, 1.5);
  sol.position.set(10, 20, 10);
  scene.add(sol);

  // Grilla del piso
  const grilla = new THREE.GridHelper(40, 40, 0x9aa5b1, 0xc8d0d8);
  grilla.position.set(5.5, 0, 12);
  scene.add(grilla);

  // Si cambia el tamaño de la ventana, se ajusta la proyección
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  return { scene, camera, renderer, controls, grilla };
}

// Render loop: dibuja la escena unas 60 veces por segundo
export function iniciarRender({ scene, camera, renderer, controls }) {
  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });
}
