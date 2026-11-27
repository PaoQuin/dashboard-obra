// =====================================================================
// CÓDIGO DEL EQUIPO · Responsable: Ali
// capas.js: botones para encender y apagar partes de la obra
// (fundaciones, columnas, vigas, losas, cubierta, fachada...).
// =====================================================================
//
// Cómo funciona: Three.js tiene "capas" (layers) del 0 al 31.
// La cámara solo dibuja los objetos que están en la capa 0, y el
// Raycaster del clic también mira solo la capa 0.
// Para apagar una parte, pasamos sus piezas a la capa 1: no se dibujan
// (no hay draw call para ellas) y tampoco se pueden tocar con el clic.
// Así no chocamos con el slider, que usa "visible" para mostrar el avance.

const CAPA_VISIBLE = 0;
const CAPA_APAGADA = 1;

// Nombre que se muestra en cada botón, en orden de abajo hacia arriba.
// Si Misael agrega tipos nuevos al JSON, aparecen solos al final.
const NOMBRES = {
  fundacion: 'Fundaciones',
  columna: 'Columnas',
  viga: 'Vigas',
  losa: 'Losas',
  escalera: 'Escalera',
  piso: 'Piso',
  muro: 'Muros',
  vidrio: 'Vidrios',
  cubierta: 'Cubierta',
  techo: 'Techo',
  fachada: 'Fachada',
  letrero: 'Letrero',
};

export function configurarCapas(mallas) {
  // Agrupamos las piezas por tipo (todas las columnas juntas, etc.)
  const porTipo = new Map();
  for (const m of mallas) {
    const tipo = m.userData.tipo;
    if (!porTipo.has(tipo)) porTipo.set(tipo, []);
    porTipo.get(tipo).push(m);
  }
  const orden = Object.keys(NOMBRES);
  const tipos = [...porTipo.keys()].sort(
    (a, b) => (orden.indexOf(a) + 1 || 99) - (orden.indexOf(b) + 1 || 99)
  );

  // El panel se arma desde aquí para no tocar index.html (es de Rose)
  const panel = document.createElement('section');
  panel.id = 'capas';
  panel.className = 'panel';
  panel.style.cssText =
    'top: 150px; left: 20px; padding: 12px 14px; width: 290px; font-size: 13px;';
  panel.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px">
      <span class="nombre" style="white-space:nowrap">Partes de la obra</span>
      <a href="#" id="capas-todo" style="white-space:nowrap; font-size:12px; color:var(--acento); text-decoration:none">Ver todo</a>
    </div>
    <div id="capas-lista" style="display:grid; grid-template-columns:1fr 1fr; gap:4px"></div>`;
  document.body.appendChild(panel);

  const lista = panel.querySelector('#capas-lista');
  const botones = new Map();

  const pintar = (boton, encendido) => {
    boton.setAttribute('aria-pressed', String(encendido));
    boton.style.opacity = encendido ? '1' : '0.45';
    boton.querySelector('.check').textContent = encendido ? '●' : '○';
  };

  const cambiar = (tipo, encendido) => {
    for (const m of porTipo.get(tipo)) {
      m.layers.set(encendido ? CAPA_VISIBLE : CAPA_APAGADA);
    }
    pintar(botones.get(tipo), encendido);
  };

  for (const tipo of tipos) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.style.cssText =
      'display:flex; justify-content:space-between; align-items:center; gap:8px; ' +
      'box-sizing:border-box; min-width:0; width:100%; padding:5px 8px; border:1px solid var(--borde); border-radius:8px; ' +
      'background:transparent; color:var(--texto); font:inherit; cursor:pointer; text-align:left;';
    boton.innerHTML = `
      <span><span class="check" style="color:var(--acento); margin-right:6px">●</span>${NOMBRES[tipo] ?? tipo}</span>
      <span style="color:var(--suave); font-size:12px">${porTipo.get(tipo).length}</span>`;
    boton.addEventListener('click', () => {
      const encendido = boton.getAttribute('aria-pressed') !== 'true';
      cambiar(tipo, encendido);
    });
    botones.set(tipo, boton);
    lista.appendChild(boton);
    pintar(boton, true);
  }

  panel.querySelector('#capas-todo').addEventListener('click', (ev) => {
    ev.preventDefault();
    for (const tipo of tipos) cambiar(tipo, true);
  });
}
