import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function ModulosPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Módulos en Node.js</h1>
      <p className="text-text-muted text-lg mb-8">CommonJS vs ES Modules — require() vs import/export</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué es un módulo?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Un módulo es un <strong className="text-text">archivo de JavaScript</strong> que encapsula código relacionado
          (funciones, clases, variables) y lo expone para que otros archivos lo puedan usar. Los módulos son la
          base de la organización de código en Node.js.
        </p>
        <p className="text-text-muted leading-relaxed mb-4">
          Node.js soporta <strong className="text-text">dos sistemas de módulos</strong>: CommonJS (CJS) y ES Modules (ESM).
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">CommonJS (CJS) — El sistema original</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          CommonJS es el sistema de módulos original de Node.js. Usa <code className="text-primary">require()</code> para
          importar y <code className="text-primary">module.exports</code> para exportar.
        </p>

        <CodeBlock language="javascript" filename="math.js — Exportar" code={`// Exportar funciones individuales
function sumar(a, b) {
  return a + b;
}

function restar(a, b) {
  return a - b;
}

// Forma 1: Exportar como objeto
module.exports = { sumar, restar };

// Forma 2: Exportar individualmente
// exports.sumar = sumar;
// exports.restar = restar;

// Forma 3: Exportar una sola cosa (clase, función, objeto)
// module.exports = sumar;`} />

        <CodeBlock language="javascript" filename="app.js — Importar" code={`// Importar todo el módulo
const math = require('./math');
console.log(math.sumar(2, 3));  // 5
console.log(math.restar(5, 2)); // 3

// Importar con destructuring
const { sumar, restar } = require('./math');
console.log(sumar(2, 3)); // 5

// Importar módulos nativos de Node.js
const fs = require('fs');
const path = require('path');
const http = require('http');

// Importar paquetes de npm
const express = require('express');
const lodash = require('lodash');`} />

        <InfoBox type="info" title="¿Cómo funciona require()?">
          Cuando llamas <code>require('./math')</code>, Node.js:
          1) Resuelve la ruta del archivo,
          2) Lo lee del disco,
          3) Lo envuelve en una función,
          4) Lo ejecuta,
          5) Cachea el resultado (no se ejecuta dos veces),
          6) Retorna <code>module.exports</code>.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">ES Modules (ESM) — El estándar moderno</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          ES Modules es el sistema de módulos estándar de JavaScript (ECMAScript). Usa
          <code className="text-primary"> import</code>/<code className="text-primary">export</code>.
          Es el mismo sistema que usas en el navegador y en frameworks como React/Angular.
        </p>

        <CodeBlock language="javascript" filename="math.mjs — Exportar con ESM" code={`// Named exports (exportaciones nombradas)
export function sumar(a, b) {
  return a + b;
}

export function restar(a, b) {
  return a - b;
}

// También puedes exportar variables y constantes
export const PI = 3.14159;

// Default export (solo uno por archivo)
export default class Calculadora {
  sumar(a, b) { return a + b; }
  restar(a, b) { return a - b; }
}`} />

        <CodeBlock language="javascript" filename="app.mjs — Importar con ESM" code={`// Importar named exports
import { sumar, restar, PI } from './math.mjs';
console.log(sumar(2, 3)); // 5

// Importar default export
import Calculadora from './math.mjs';
const calc = new Calculadora();

// Importar todo como namespace
import * as math from './math.mjs';
console.log(math.sumar(2, 3));
console.log(math.PI);

// Importar con alias (renombrar)
import { sumar as add, restar as subtract } from './math.mjs';

// Importar módulos nativos
import fs from 'fs';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

// Importar paquetes npm
import express from 'express';`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Cómo activar ES Modules en Node.js?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Hay dos formas de usar ESM en Node.js:
        </p>

        <CodeBlock language="json" filename="Opción 1: type module en package.json (recomendada)" code={`{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/index.js"
  }
}
// Con "type": "module", TODOS los archivos .js se tratan como ESM
// Si necesitas un archivo CJS, usa extensión .cjs`} />

        <CodeBlock language="bash" filename="Opción 2: Extensión .mjs" code={`# Archivos con extensión .mjs siempre se tratan como ESM
# Archivos con extensión .cjs siempre se tratan como CJS
# Archivos con extensión .js dependen de "type" en package.json

node app.mjs    # Siempre ESM
node app.cjs    # Siempre CJS
node app.js     # Depende de package.json`} />

        <InfoBox type="warning" title="Recomendación 2026">
          <strong>Usa ES Modules</strong> para proyectos nuevos. Agrega <code>"type": "module"</code> en tu
          <code> package.json</code>. ESM es el estándar del lenguaje, tiene mejor soporte para tree-shaking,
          y es lo que usan todos los frameworks modernos. CJS sigue siendo necesario para librerías legacy.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Diferencias clave CJS vs ESM</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-text-muted">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text">Aspecto</th>
                <th className="text-left py-3 px-4 text-warning">CommonJS</th>
                <th className="text-left py-3 px-4 text-node">ES Modules</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50"><td className="py-3 px-4">Sintaxis importar</td><td className="py-3 px-4"><code>require()</code></td><td className="py-3 px-4"><code>import</code></td></tr>
              <tr className="border-b border-border/50"><td className="py-3 px-4">Sintaxis exportar</td><td className="py-3 px-4"><code>module.exports</code></td><td className="py-3 px-4"><code>export / export default</code></td></tr>
              <tr className="border-b border-border/50"><td className="py-3 px-4">Carga</td><td className="py-3 px-4">Síncrona</td><td className="py-3 px-4">Asíncrona</td></tr>
              <tr className="border-b border-border/50"><td className="py-3 px-4">Evaluación</td><td className="py-3 px-4">En tiempo de ejecución</td><td className="py-3 px-4">Estática (en tiempo de parseo)</td></tr>
              <tr className="border-b border-border/50"><td className="py-3 px-4">Top-level await</td><td className="py-3 px-4">No soportado</td><td className="py-3 px-4">Soportado</td></tr>
              <tr className="border-b border-border/50"><td className="py-3 px-4">__dirname</td><td className="py-3 px-4">Disponible</td><td className="py-3 px-4">No existe (usa import.meta)</td></tr>
              <tr><td className="py-3 px-4">JSON import</td><td className="py-3 px-4"><code>require('./data.json')</code></td><td className="py-3 px-4">Necesita assert</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">__dirname y __filename en ESM</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          En ESM no existen <code className="text-primary">__dirname</code> ni <code className="text-primary">__filename</code>.
          En su lugar usas <code className="text-primary">import.meta.url</code>:
        </p>

        <CodeBlock language="javascript" filename="Equivalentes en ESM" code={`// CommonJS — Disponible automáticamente
// console.log(__dirname);   // /Users/tu/proyecto/src
// console.log(__filename);  // /Users/tu/proyecto/src/app.js

// ES Modules — Necesitas construirlos
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__filename); // /Users/tu/proyecto/src/app.js
console.log(__dirname);  // /Users/tu/proyecto/src

// import.meta.url retorna una URL tipo file://
console.log(import.meta.url);
// file:///Users/tu/proyecto/src/app.js`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Tipos de módulos en Node.js</h2>
        <div className="space-y-4">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">1. Módulos nativos (built-in)</h3>
            <p className="text-text-muted text-sm mb-2">Vienen incluidos con Node.js. No necesitas instalar nada.</p>
            <CodeBlock language="javascript" code={`import fs from 'fs';           // File system
import path from 'path';       // Rutas de archivos
import http from 'http';       // Servidor HTTP
import crypto from 'crypto';   // Criptografía
import os from 'os';           // Info del sistema operativo
import events from 'events';   // EventEmitter
import stream from 'stream';   // Streams
import util from 'util';       // Utilidades`} />
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">2. Módulos locales (tus archivos)</h3>
            <p className="text-text-muted text-sm mb-2">Archivos que tú creas. Se importan con ruta relativa.</p>
            <CodeBlock language="javascript" code={`import { userController } from './controllers/user.js';
import config from './config/database.js';
import { validateEmail } from '../utils/validators.js';
// NOTA: En ESM debes incluir la extensión .js`} />
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">3. Módulos de terceros (npm)</h3>
            <p className="text-text-muted text-sm mb-2">Paquetes instalados con npm. Se importan por nombre.</p>
            <CodeBlock language="javascript" code={`import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
// Node.js los busca en la carpeta node_modules/`} />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Patrón de módulo: barrel exports</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Un patrón común es crear un archivo <code className="text-primary">index.js</code> que re-exporte
          todo desde una carpeta, simplificando los imports:
        </p>

        <CodeBlock language="javascript" filename="controllers/userController.js" code={`export const getUsers = (req, res) => { /* ... */ };
export const getUserById = (req, res) => { /* ... */ };
export const createUser = (req, res) => { /* ... */ };`} />

        <CodeBlock language="javascript" filename="controllers/productController.js" code={`export const getProducts = (req, res) => { /* ... */ };
export const createProduct = (req, res) => { /* ... */ };`} />

        <CodeBlock language="javascript" filename="controllers/index.js — Barrel export" code={`// Re-exportar todo desde un solo punto
export * from './userController.js';
export * from './productController.js';

// Ahora puedes importar así:
// import { getUsers, getProducts } from './controllers/index.js';
// O simplemente:
// import { getUsers, getProducts } from './controllers';`} />

        <InfoBox type="tip" title="Buena práctica">
          Los barrel exports mantienen tus imports limpios. En vez de importar desde 10 archivos diferentes,
          importas todo desde un solo <code>index.js</code>. Esto es muy común en proyectos profesionales.
        </InfoBox>
      </section>
    </div>
  );
}
