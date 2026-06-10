// index.js
import express from 'express';
import { errorHandler } from './middleware/errorHandler.js';

// Importar rutas
import maniquiRoutes from './routes/maniqui.route.js';
import catalogoRoutes from './routes/catalogo.route.js';
import modeloRoutes from './routes/modelo.route.js';
import piezasRoutes from './routes/piezas.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(express.json());

// Ruta base
app.get('/', (req, res) => {
  res.json({
    nombre: 'API Fábrica de Maniquíes',
    version: '1.0.0',
    endpoints: {
      catalogo:  ['/colores', '/materiales'],
      modelos:   ['/modelos'],
      piezas:    ['/cabezas', '/torsos', '/brazos', '/piernas'],
      maniquies: ['/maniquies'],
    },
  });
});

// Registrar Rutas de la API
app.use('/', catalogoRoutes);      // Monta /colores y /materiales
app.use('/', piezasRoutes);        // Monta /cabezas, /torsos, /brazos, /piernas
app.use('/modelos', modeloRoutes); // Monta /modelos
app.use('/maniquies', maniquiRoutes); // Monta /maniquies

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: true, mensaje: `Ruta '${req.method} ${req.path}' no encontrada` });
});

// Manejo de errores global
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🪆  Fábrica de Maniquíes corriendo en http://localhost:${PORT}`);
  console.log(`📋  Documentación de rutas disponible en GET /\n`);
});