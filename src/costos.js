export const desviacion = (e) =>
  (e.costo_real - e.costo_presupuestado) / e.costo_presupuestado;

export const estaAtrasado = (e) =>
  Boolean(e.fecha_fin_real) && e.fecha_fin_real > e.fecha_fin;

export function colorPorCosto(e) {
  if (e.costo_real > e.costo_presupuestado) return 0xd62828; // sobrecosto
  if (estaAtrasado(e)) return 0xf77f00;                      // atraso
  return 0x9aa5b1;                                           // en orden
}
