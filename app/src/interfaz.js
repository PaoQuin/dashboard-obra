// =====================================================================
// CÓDIGO DEL EQUIPO · Responsable: Rose
// interfaz.js: el clic sobre las piezas (picking con Raycaster),
// la tarjeta de datos y el resumen de costos.
// =====================================================================

// Librería externa: Three.js
import * as THREE from 'three';
// Del equipo (Ali): la desviación de costo
import { desviacion } from './materiales.js';

// --- Picking: clic sobre una pieza con Raycaster ---
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

// --- Resumen 5D: suma los costos de los ítems que ya empezaron en la fecha ---
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
}
