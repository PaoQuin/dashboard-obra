// =====================================================================
// CÓDIGO DEL EQUIPO · Responsable: Ali
// main.js: junta las partes de los tres, en el orden en que pasan.
// =====================================================================

import { crearEscena, iniciarRender } from './escena.js';       // Ali
import { configurarVistas } from './materiales.js';             // Ali
import { cargarObra, crearEdificio } from './edificio.js';      // Misael
import { configurarSlider } from './tiempo.js';                 // Misael
import { activarPicking, actualizarResumen } from './interfaz.js'; // Rose
import './style.css';                                           // Rose

const escena = crearEscena();                        // 1. dónde se dibuja
const elementos = await cargarObra();                // 2. los datos
const { grupo, mallas } = crearEdificio(elementos);  // 3. las cajas
escena.scene.add(grupo);

configurarSlider(elementos, mallas, (fecha) => actualizarResumen(elementos, fecha)); // 4. tiempo + resumen
activarPicking(escena.camera, escena.renderer, mallas);                              // 5. clic
configurarVistas(escena.scene, mallas, escena.grilla);                               // 6. obra terminada
iniciarRender(escena);                                                               // 7. dibujar

// Para mostrar las matrices en la consola durante la exposición
window.camera = escena.camera;
