import db from '../data/data.js';
import { crearError } from '../middleware/errorHandler.js';

const SEXOS_VALIDOS = ["M", "F"];
const EDADES_VALIDAS = ["ADULTO", "INFANTIL"];

const getModelos = (req, res) => {
  res.json(db.modelos);
};

const getModeloById = (req, res, next) => {
  const modelo = db.modelos.find((m) => m.id_modelo === parseInt(req.params.id));
  if (!modelo) return next(crearError("Modelo no encontrado", 404));
  res.json(modelo);
};

const createModelo = (req, res, next) => {
  const { sexo, edad } = req.body;

  if (!sexo || !edad) return next(crearError("Los campos 'sexo' y 'edad' son obligatorios"));
  if (!SEXOS_VALIDOS.includes(sexo.toUpperCase()))
    return next(crearError(`'sexo' debe ser uno de: ${SEXOS_VALIDOS.join(", ")}`));
  if (!EDADES_VALIDAS.includes(edad.toUpperCase()))
    return next(crearError(`'edad' debe ser uno de: ${EDADES_VALIDAS.join(", ")}`));

  const sexoNorm = sexo.toUpperCase();
  const edadNorm = edad.toUpperCase();

  const existe = db.modelos.find(
    (m) => m.sexo === sexoNorm && m.edad === edadNorm
  );
  if (existe) return next(crearError(`Ya existe un modelo ${sexoNorm}/${edadNorm}`));

  const nuevo = { id_modelo: db.nextId("modelos"), sexo: sexoNorm, edad: edadNorm };
  db.modelos.push(nuevo);
  res.status(201).json(nuevo);
};

const deleteModelo = (req, res, next) => {
  const id = parseInt(req.params.id);
  const idx = db.modelos.findIndex((m) => m.id_modelo === id);
  if (idx === -1) return next(crearError("Modelo no encontrado", 404));

  const enUso = [...db.cabezas, ...db.torsos, ...db.brazos, ...db.piernas, ...db.maniquies].some(
    (p) => p.id_modelo === id
  );
  if (enUso) return next(crearError("No se puede eliminar: el modelo está en uso", 409));

  db.modelos.splice(idx, 1);
  res.json({ mensaje: "Modelo eliminado correctamente" });
};

export { getModelos, getModeloById, createModelo, deleteModelo };