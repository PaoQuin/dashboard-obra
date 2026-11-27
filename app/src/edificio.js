// =====================================================================
// CÓDIGO DEL EQUIPO · Responsable: Misael
// edificio.js: carga los datos de la obra y crea una caja 3D por pieza.
// =====================================================================

// Librería externa: Three.js
import * as THREE from 'three';
// Del equipo (Ali): el color según el costo
import { colorPorCosto } from './materiales.js';

// Lee los datos de la obra (public/data/obra.json)
export async function cargarObra() {
  const respuesta = await fetch('/data/obra.json');
  const datos = await respuesta.json();
  return datos.elementos;
}

// Cada elemento del JSON es un ítem de la planilla (por ejemplo "Columnas")
// y puede tener varias piezas 3D. Todas las piezas comparten los datos del ítem.
export function crearEdificio(elementos) {
  const grupo = new THREE.Group();
  const mallas = [];
  const gruposPorTipo = new Map();

  for (const e of elementos) {
    let grupoTipo = gruposPorTipo.get(e.tipo);
    if (!grupoTipo) {
      grupoTipo = new THREE.Group();
      grupoTipo.name = e.tipo;
      gruposPorTipo.set(e.tipo, grupoTipo);
      grupo.add(grupoTipo);
    }

    const grupoItem = new THREE.Group();
    grupoItem.name = e.id_elemento;
    const material = new THREE.MeshStandardMaterial({ color: colorPorCosto(e), transparent: true, opacity: 1 });

    for (const p of e.piezas) {
      const { ancho, alto, largo } = p.dimensiones;
      const malla = new THREE.Mesh(new THREE.BoxGeometry(ancho, alto, largo), material);
      malla.position.set(p.posicion.x, p.posicion.y, p.posicion.z);
      if (p.rotacion) malla.rotation.set(p.rotacion.x ?? 0, p.rotacion.y ?? 0, p.rotacion.z ?? 0);
      malla.name = p.nombre ?? e.id_elemento;
      malla.userData = e;
      grupoItem.add(malla);
      mallas.push(malla);
    }
    grupoTipo.add(grupoItem);
  }
  return { grupo, mallas, gruposPorTipo };
}
