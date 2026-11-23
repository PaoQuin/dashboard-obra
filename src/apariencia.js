
// Dos formas de ver el edificio:
// "costos": el color dice si el ítem tuvo sobrecosto, atraso o está en orden.
// "terminada": colores parecidos a la obra real (estructura gris, fachada roja).
const COLOR_TERMINADA = {
  fundacion: 0x7d8288,
  viga: 0x9ea3a8,
  columna: 0xb8bcc0,
  losa: 0xc9ccd0,
  escalera: 0xb8bcc0,
  piso: 0x8c9196,
  cubierta: 0x2f3237,
  muro: 0x3a3d42,
  fachada: 0xc8102e,
};

const FONDO = {
  costos: 0xdfe6ee,
  terminada: 0x15181d,
};

export function configurarApariencia(scene, mallas, grilla) {
  const boton = document.querySelector('#modo');
  const leyenda = document.querySelector('#leyenda');
  const slider = document.querySelector('#slider');

  // Guardamos el color original (el de costos) de cada material una sola vez.
  const materiales = new Map();
  for (const m of mallas) {
    if (!materiales.has(m.material)) {
      materiales.set(m.material, { costo: m.material.color.getHex(), elemento: m.userData });
    }
  }

  let modo = 'costos';

  const aplicar = () => {
    const terminada = modo === 'terminada';
    for (const [material, { costo, elemento }] of materiales) {
      material.color.setHex(terminada ? COLOR_TERMINADA[elemento.tipo] ?? 0x9ea3a8 : costo);
      // La cenefa de aluminio brilla un poco de noche, como el letrero iluminado.
      const brilla = terminada && elemento.id_elemento === 'Cenefa_aluminio';
      material.emissive.setHex(brilla ? 0xffffff : 0x000000);
      material.emissiveIntensity = brilla ? 0.6 : 1;
    }
    scene.background.setHex(FONDO[modo]);
    scene.fog.color.setHex(FONDO[modo]);
    grilla.material.transparent = true;
    grilla.material.opacity = terminada ? 0.15 : 1;
    grilla.material.needsUpdate = true;
    document.body.classList.toggle('noche', terminada);
    leyenda.hidden = terminada;
    boton.textContent = terminada ? 'Ver costos' : 'Ver obra terminada';

    // En la vista terminada mostramos el edificio completo.
    if (terminada) {
      slider.value = slider.max;
      slider.dispatchEvent(new Event('input'));
    }
  };

  boton.addEventListener('click', () => {
    modo = modo === 'costos' ? 'terminada' : 'costos';
    aplicar();
  });
}
