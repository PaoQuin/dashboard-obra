// Resumen 5D: suma los costos de los ítems que ya empezaron en la fecha del slider.
const bs = (n) => `Bs ${Math.round(n).toLocaleString('es-BO')}`;

export function actualizarPanel(elementos, fecha) {
  const iniciados = elementos.filter((e) => e.fecha_inicio <= fecha);
  const plan = iniciados.reduce((s, e) => s + e.costo_presupuestado, 0);
  const real = iniciados.reduce((s, e) => s + e.costo_real, 0);
  const desv = plan ? (real - plan) / plan : 0;

  document.querySelector('#kpi-plan').textContent = bs(plan);
  document.querySelector('#kpi-real').textContent = bs(real);
  const d = document.querySelector('#kpi-desv');
  d.textContent = `${desv > 0 ? '+' : ''}${(desv * 100).toLocaleString('es-BO', { maximumFractionDigits: 1 })} %`;
  d.className = 'valor ' + (desv > 0 ? 'malo' : 'bueno');
  document.querySelector('#kpi-items').textContent = `${iniciados.length} de ${elementos.length}`;
}
