# Dashboard de avance de obra

Proyecto Integrador de Gráficos por Computador (ISW-232), UCB Santa Cruz.

Visor 3D en Three.js de la estructura de la Recepción de Vehículos GAC (Santa Cruz, 2023-2024), con datos reales de la fiscal de obra, Ing. María René Villagomez. Un slider de fechas muestra el avance (4D) y los colores marcan sobrecostos y atrasos (5D). Clic sobre un elemento para ver su reporte de costos.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrir la dirección que aparece (normalmente http://localhost:5173).

## Datos

`public/data/obra.json`: 14 ítems de estructura (hormigón armado y metálica), 119 piezas en 3D.

- Costos: Planilla de avance #3 final, módulos M03 y M04 (contrato contra orden de cambio #1).
- Medidas: hoja COMPUTOS de la misma planilla. Las posiciones de las columnas son aproximadas a partir de las luces entre ejes.
- Fechas: el plan sale de la Curva S, contando semanas desde el contrato del 29/09/2023. La fecha real de cada ítem es estimada: plan más el atraso que muestra la Curva S en ese momento.

Colores: rojo = sobrecosto, naranja = terminó tarde, gris = en orden. La cubierta y la fachada se muestran semitransparentes para ver la estructura.

Para regenerar el JSON: `python3 tools/armar_json.py public/data/obra.json`
