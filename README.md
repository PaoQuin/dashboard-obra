# Dashboard de avance de obra

Proyecto Integrador de Gráficos por Computador (ISW-232), UCB Santa Cruz.
Integrantes: María Alicia Belaunde Villagomez, Paola Rosenda Quinteros Pérez y Misael Guzmán Villaroel.

Visor 3D en Three.js de la estructura de la Recepción de Vehículos GAC (Santa Cruz, 2023-2024), con datos de la fiscal de obra, Ing. María René Villagomez. Un slider de fechas muestra el avance (4D) y los colores marcan sobrecostos y atrasos (5D).

## Cómo correrlo

```bash
npm install
npm run dev
```

## Qué es del equipo y qué es de las herramientas

```text
dashboard-obra/
│
├── app/                      CÓDIGO DEL EQUIPO (lo que corre en el navegador)
│   ├── index.html            Rose    la página: paneles, slider, tarjeta
│   ├── public/data/obra.json Misael  los datos de la obra
│   └── src/
│       ├── main.js           Ali     junta las partes de los tres
│       ├── escena.js         Ali     escena, cámara, luces, render loop
│       ├── materiales.js     Ali     colores por costo y vista de obra terminada
│       ├── edificio.js       Misael  carga los datos y crea las cajas
│       ├── tiempo.js         Misael  slider 4D
│       ├── interfaz.js       Rose    picking (clic), tarjeta y resumen de costos
│       └── style.css         Rose    diseño de la interfaz
│
├── docs/                     DEL EQUIPO: Códice de Translación (PDF)
├── tools/armar_json.py       DEL EQUIPO: convierte la planilla de la ingeniera al JSON
├── README.md                 DEL EQUIPO: este archivo
│
├── node_modules/             HERRAMIENTAS: librerías descargadas por npm (no se toca, no se sube)
├── package.json              HERRAMIENTAS: ficha del proyecto (librerías y comandos)
├── package-lock.json         HERRAMIENTAS: versiones exactas, la escribe npm
├── vite.config.js            HERRAMIENTAS: le dice a Vite que el proyecto está en app/
└── .gitignore                HERRAMIENTAS: lo que Git no sube
```

Cada archivo del equipo empieza con un encabezado `CÓDIGO DEL EQUIPO · Responsable: ...`. Dentro del código, las líneas que usan una librería externa están marcadas con `// Librería externa: Three.js`.

Librerías: Three.js (el 3D, sobre WebGL). Vite solo se usa para desarrollar.

## Datos

`app/public/data/obra.json`: 14 ítems de estructura (hormigón armado y metálica), 119 piezas en 3D.

- Costos: planilla de avance final de la obra, módulos M03 y M04 (contrato contra orden de cambio).
- Medidas: cómputos métricos de la misma planilla. Las posiciones de las columnas son aproximadas.
- Fechas por ítem: definidas por el equipo a partir de la Curva S de la obra.

Colores: rojo = sobrecosto, naranja = terminó tarde, gris = en orden.
