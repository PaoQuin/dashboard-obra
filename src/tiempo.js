const DIA = 86_400_000;
const aDia = (fecha, origen) =>
  Math.round((Date.parse(fecha) - Date.parse(origen)) / DIA);

export function configurarSlider(datos, mallas) {
  const origen = datos.map((e) => e.fecha_inicio).sort()[0];
  const ultimo = datos.map((e) => e.fecha_fin_real ?? e.fecha_fin).sort().at(-1);
  const slider = document.querySelector('#slider');
  const etiqueta = document.querySelector('#fecha');
  slider.min = 0;
  slider.max = aDia(ultimo, origen);
  slider.value = 0;

  const actualizar = () => {
    const dia = Number(slider.value);
    for (const m of mallas) {
      const e = m.userData;
      const ini = aDia(e.fecha_inicio, origen);
      const fin = aDia(e.fecha_fin_real ?? e.fecha_fin, origen);
      m.visible = dia >= ini;
      const avance = Math.min(1, (dia - ini + 1) / (fin - ini + 1));
      const maxima = e.opacidad_max ?? 1; // cubierta y fachada semitransparentes para ver la estructura
      m.material.opacity = (0.3 + 0.7 * avance) * maxima;
    }
    etiqueta.textContent = new Date(Date.parse(origen) + dia * DIA)
      .toISOString().slice(0, 10);
  };

  slider.addEventListener('input', actualizar);
  actualizar();
}
