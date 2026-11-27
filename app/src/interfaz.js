// =====================================================================
// CÓDIGO DEL EQUIPO · Responsable: Paola R. Quinteros P.
// interfaz.js: el clic sobre las piezas (picking con Raycaster),
// la tarjeta de datos y el resumen de costos.
// =====================================================================

// Librería externa: Three.js
import * as THREE from 'three';
// Del equipo (Ali): la desviación de costo
import { desviacion } from './materiales.js';

// Picking: clic sobre una pieza con Raycaster
export function activarPicking(camera, renderer, mallas) {
  const raycaster = new THREE.Raycaster();
  const puntero = new THREE.Vector2();
  const tarjeta = document.querySelector('#tarjeta');
  const bs = (n) => `Bs ${n.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const pct = (x) => `${x > 0 ? '+' : ''}${(x * 100).toLocaleString('es-BO', { maximumFractionDigits: 1 })} %`;
  const estados = {
    sobrecosto: ['rojo', 'Sobrecosto'],
    atrasado: ['naranja', 'Terminó tarde'],
    en_orden: ['gris', 'En orden'],
  };

  renderer.domElement.addEventListener('click', (ev) => {
    const r = renderer.domElement.getBoundingClientRect();
    puntero.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
    puntero.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(puntero, camera);

    const hit = raycaster.intersectObjects(mallas).find((h) => h.object.visible);
    if (!hit) { tarjeta.hidden = true; return; }

    const e = hit.object.userData;
    console.log(e.id_elemento, e.costo_presupuestado, e.costo_real, e.estado);
    const [clase, texto] = estados[e.estado];
    tarjeta.innerHTML = `<b>${e.nombre}</b> <span class="codigo">${e.item_planilla}</span><br>
      <i class="punto ${clase}"></i>${texto}<br>
      Presupuestado: ${bs(e.costo_presupuestado)}<br>
      Real: ${bs(e.costo_real)} (${pct(desviacion(e))})<br>
      Fin planificado: ${e.fecha_fin}<br>
      Fin real: ${e.fecha_fin_real}`;
    // que la tarjeta no se salga de la pantalla
    const x = Math.min(ev.clientX + 12, innerWidth - 340);
    const y = Math.min(ev.clientY + 12, innerHeight - 200);
    tarjeta.style.left = `${x}px`;
    tarjeta.style.top = `${y}px`;
    tarjeta.hidden = false;
  });
}

// Resumen 5D: suma los costos de los ítems que ya empezaron en la fecha
const bsResumen = (n) => `Bs ${Math.round(n).toLocaleString('es-BO')}`;

export function actualizarResumen(elementos, fecha) {
  const iniciados = elementos.filter((e) => e.fecha_inicio <= fecha);
  const plan = iniciados.reduce((s, e) => s + e.costo_presupuestado, 0);
  const real = iniciados.reduce((s, e) => s + e.costo_real, 0);
  const desv = plan ? (real - plan) / plan : 0;

  document.querySelector('#kpi-plan').textContent = bsResumen(plan);
  document.querySelector('#kpi-real').textContent = bsResumen(real);
  const d = document.querySelector('#kpi-desv');
  d.textContent = `${desv > 0 ? '+' : ''}${(desv * 100).toLocaleString('es-BO', { maximumFractionDigits: 1 })} %`;
  d.className = 'valor ' + (desv > 0 ? 'malo' : 'bueno');
  document.querySelector('#kpi-items').textContent = `${iniciados.length} de ${elementos.length}`;
  actualizarLista(elementos, fecha);
}

  // --- Lista de avance por ítem ---
// Avance de un ítem en una fecha: 0 si no empezó, 1 si terminó, y entre medio según los días.
const DIA = 86_400_000;
function avanceDe(e, fecha) {
  const ini = Date.parse(e.fecha_inicio);
  const fin = Date.parse(e.fecha_fin_real ?? e.fecha_fin) + DIA; // + 1 día: el último día cuenta
  const hoy = Date.parse(fecha) + DIA;
  return Math.min(1, Math.max(0, (hoy - ini) / (fin - ini)));
}

const colores = { sobrecosto: '#d62828', atrasado: '#f77f00', en_orden: '#9aa5b1' };
let seleccionado = null; // el ítem que se está viendo solo (o ninguno)

export function actualizarLista(elementos, fecha) {
  const lista = document.querySelector('#lista-avance');
  lista.innerHTML = '';
  for (const e of elementos) {
    const pct = Math.round(avanceDe(e, fecha) * 100);
    const fila = document.createElement('li');
    if (seleccionado === e) fila.className = 'activo';
    fila.innerHTML = `
      <div class="fila-item"><span>${e.nombre}</span><span class="pct">${pct} %</span></div>
      <div class="barra"><span style="width:${pct}%; background:${colores[e.estado]}"></span></div>`;
    fila.addEventListener('click', () => verSoloItem(e, elementos));
    lista.appendChild(fila);
  }
}

// --- Ver solo una parte ---
// Marca los demás ítems como "atenuados" y le pide al slider que redibuje.
// Tocar el mismo ítem otra vez vuelve todo a la normalidad.
export function verSoloItem(item, elementos) {
  seleccionado = seleccionado === item ? null : item;
  for (const e of elementos) e.atenuado = seleccionado !== null && e !== seleccionado;
  document.querySelector('#slider').dispatchEvent(new Event('input'));
}
