import * as THREE from 'three';
import { desviacion } from './costos.js';

export function activarClick(camera, renderer, mallas) {
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
