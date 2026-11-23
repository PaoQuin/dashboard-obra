import * as THREE from 'three';
import { desviacion } from './costos.js';

export function activarClick(camera, renderer, mallas) {
  const raycaster = new THREE.Raycaster();
  const puntero = new THREE.Vector2();
  const tarjeta = document.querySelector('#tarjeta');
  const bs = (n) => `Bs ${n.toLocaleString('es-BO')}`;

  renderer.domElement.addEventListener('click', (ev) => {
    const r = renderer.domElement.getBoundingClientRect();
    puntero.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
    puntero.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(puntero, camera);

    const hit = raycaster.intersectObjects(mallas).find((h) => h.object.visible);
    if (!hit) { tarjeta.hidden = true; return; }

    const e = hit.object.userData;
    console.log(e.id_elemento, e.costo_presupuestado, e.costo_real, e.estado);
    tarjeta.innerHTML = `<b>${e.nombre}</b> (${e.item_planilla})<br>
      Presupuestado: ${bs(e.costo_presupuestado)}<br>
      Real: ${bs(e.costo_real)}<br>
      Desviación: ${(desviacion(e) * 100).toFixed(1)} %<br>
      Fin planificado: ${e.fecha_fin} · real: ${e.fecha_fin_real}<br>
      Estado: ${e.estado}`;
    tarjeta.style.left = `${ev.clientX + 12}px`;
    tarjeta.style.top = `${ev.clientY + 12}px`;
    tarjeta.hidden = false;
  });
}
