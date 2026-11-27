// =====================================================================
// CÓDIGO DEL EQUIPO · Responsable: María A. Belaunde V.
// =====================================================================

import { crearEscena, iniciarRender } from './escena.js';
import { configurarVistas } from './materiales.js';
import { configurarCapas } from './capas.js';
import { cargarObra, crearEdificio } from './edificio.js';
import { configurarSlider } from './tiempo.js';
import { activarPicking, actualizarResumen } from './interfaz.js';
import './style.css';

const escena = crearEscena();
const elementos = await cargarObra();
const { grupo, mallas } = crearEdificio(elementos);
escena.scene.add(grupo);

configurarSlider(elementos, mallas, (fecha) => actualizarResumen(elementos, fecha));
activarPicking(escena.camera, escena.renderer, mallas);
configurarVistas(escena.scene, mallas, escena.grilla);
configurarCapas(mallas);
iniciarRender(escena);

window.camera = escena.camera;
