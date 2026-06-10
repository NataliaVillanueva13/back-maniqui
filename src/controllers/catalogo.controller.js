import db from '../data/data.js';
import { crearError } from '../middleware/errorHandler.js';

// ========================= COLORES =========================

const getColores = (req, res) => {
  res.json(db.colores);
};

const getColorById = (req, res, next) => {
  const color = db.colores.find((c) => c.id_color === parseInt(req.params.id));
  if (!color) return next(crearError("Color no encontrado", 404));
  res.json(color);
};

const createColor = (req, res, next) => {
  const { nombre, acabado = "Estándar" } = req.body;
  if (!nombre) return next(crearError("El campo 'nombre' es obligatorio"));

  const existe = db.colores.find(
    (c) => c.nombre.toLowerCase() === nombre.toLowerCase()
  );
  if (existe) return next(crearError(`Ya existe un color con el nombre '${nombre}'`));

  const nuevo = { id_color: db.nextId("colores"), nombre, acabado };
  db.colores.push(nuevo);
  res.status(201).json(nuevo);
};

const updateColor = (req, res, next) => {
  const idx = db.colores.findIndex((c) => c.id_color === parseInt(req.params.id));
  if (idx === -1) return next(crearError("Color no encontrado", 404));

  const { nombre, acabado } = req.body;
  if (nombre) {
    const duplicado = db.colores.find(
      (c) => c.nombre.toLowerCase() === nombre.toLowerCase() && c.id_color !== parseInt(req.params.id)
    );
    if (duplicado) return next(crearError(`Ya existe un color con el nombre '${nombre}'`));
    db.colores[idx].nombre = nombre;
  }
  if (acabado !== undefined) db.colores[idx].acabado = acabado;

  res.json(db.colores[idx]);
};

const deleteColor = (req, res, next) => {
  const id = parseInt(req.params.id);
  const idx = db.colores.findIndex((c) => c.id_color === id);
  if (idx === -1) return next(crearError("Color no encontrado", 404));

  // Verificar que no esté en uso
  const enUso = [...db.cabezas, ...db.torsos, ...db.brazos, ...db.piernas].some(
    (p) => p.id_color === id
  );
  if (enUso) return next(crearError("No se puede eliminar: el color está en uso por alguna pieza", 409));

  db.colores.splice(idx, 1);
  res.json({ mensaje: "Color eliminado correctamente" });
};

// ========================= MATERIALES =========================

const getMateriales = (req, res) => {
  res.json(db.materiales);
};

const getMaterialById = (req, res, next) => {
  const mat = db.materiales.find((m) => m.id_material === parseInt(req.params.id));
  if (!mat) return next(crearError("Material no encontrado", 404));
  res.json(mat);
};

const createMaterial = (req, res, next) => {
  const { nombre } = req.body;
  if (!nombre) return next(crearError("El campo 'nombre' es obligatorio"));

  const existe = db.materiales.find(
    (m) => m.nombre.toLowerCase() === nombre.toLowerCase()
  );
  if (existe) return next(crearError(`Ya existe un material con el nombre '${nombre}'`));

  const nuevo = { id_material: db.nextId("materiales"), nombre };
  db.materiales.push(nuevo);
  res.status(201).json(nuevo);
};

const updateMaterial = (req, res, next) => {
  const idx = db.materiales.findIndex((m) => m.id_material === parseInt(req.params.id));
  if (idx === -1) return next(crearError("Material no encontrado", 404));

  const { nombre } = req.body;
  if (!nombre) return next(crearError("El campo 'nombre' es obligatorio"));

  const duplicado = db.materiales.find(
    (m) => m.nombre.toLowerCase() === nombre.toLowerCase() && m.id_material !== parseInt(req.params.id)
  );
  if (duplicado) return next(crearError(`Ya existe un material con el nombre '${nombre}'`));

  db.materiales[idx].nombre = nombre;
  res.json(db.materiales[idx]);
};

const deleteMaterial = (req, res, next) => {
  const id = parseInt(req.params.id);
  const idx = db.materiales.findIndex((m) => m.id_material === id);
  if (idx === -1) return next(crearError("Material no encontrado", 404));

  const enUso = [...db.cabezas, ...db.torsos, ...db.brazos, ...db.piernas].some(
    (p) => p.id_material === id
  );
  if (enUso) return next(crearError("No se puede eliminar: el material está en uso por alguna pieza", 409));

  db.materiales.splice(idx, 1);
  res.json({ mensaje: "Material eliminado correctamente" });
};

export {
  getColores, getColorById, createColor, updateColor, deleteColor,
  getMateriales, getMaterialById, createMaterial, updateMaterial, deleteMaterial,
};