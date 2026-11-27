// =====================================================================
// CÓDIGO DEL EQUIPO · Responsable: María A. Belaunde V.
// =====================================================================

const CAPA_VISIBLE = 0;
const CAPA_APAGADA = 1;

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

  const panel = document.createElement('section');
  panel.id = 'capas';
  panel.className = 'panel';
  panel.style.cssText =
    'top: 150px; left: 20px; padding: 12px 14px; width: 390px; font-size: 12px;';
  panel.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px">
      <span class="nombre" style="white-space:nowrap">Partes de la obra</span>
      <a href="#" id="capas-todo" style="white-space:nowrap; font-size:12px; color:var(--acento); text-decoration:none">Ver todo</a>
    </div>
    <div id="capas-lista" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:4px"></div>`;
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
      'display:flex; justify-content:space-between; align-items:center; gap:4px; ' +
      'box-sizing:border-box; min-width:0; width:100%; padding:4px 7px; border:1px solid var(--borde); border-radius:8px; ' +
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
