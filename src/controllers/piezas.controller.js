import db from '../data/data.js';
import { crearError } from '../middleware/errorHandler.js';

const validarReferencias = (id_color, id_material, id_modelo, next) => {
  if (!db.colores.find((c) => c.id_color === id_color))
    return next(crearError(`Color con id ${id_color} no existe`, 404));
  if (!db.materiales.find((m) => m.id_material === id_material))
    return next(crearError(`Material con id ${id_material} no existe`, 404));
  if (!db.modelos.find((m) => m.id_modelo === id_modelo))
    return next(crearError(`Modelo con id ${id_modelo} no existe`, 404));
  return null; // sin error
};
 

 
const getCabezas = (req, res) => res.json(db.cabezas);
 
const getCabezaById = (req, res, next) => {
  const pieza = db.cabezas.find((c) => c.id_cabeza === parseInt(req.params.id));
  if (!pieza) return next(crearError("Cabeza no encontrada", 404));
  res.json(pieza);
};
 
const createCabeza = (req, res, next) => {
  const { fecha_fabricacion, id_color, id_material, id_modelo } = req.body;
  if (!fecha_fabricacion || !id_color || !id_material || !id_modelo)
    return next(crearError("Faltan campos obligatorios: fecha_fabricacion, id_color, id_material, id_modelo"));
 
  const err = validarReferencias(id_color, id_material, id_modelo, next);
  if (err) return;
 
  const nueva = {
    id_cabeza: db.nextId("cabezas"),
    fecha_fabricacion,
    id_color,
    id_material,
    id_modelo,
  };
  db.cabezas.push(nueva);
  res.status(201).json(nueva);
};
const updateCabeza = (req, res, next) => {
  const id = parseInt(req.params.id);
  const idx = db.cabezas.findIndex((c) => c.id_cabeza === id);
  if (idx === -1) return next(crearError("Cabeza no encontrada", 404));

  const { fecha_fabricacion, id_color, id_material, id_modelo } = req.body;

  
  const enUso = db.maniquies.some((m) => m.id_cabeza === id);

  
  if (enUso) {
    if (id_modelo && id_modelo !== db.cabezas[idx].id_modelo) {
      return next(crearError("No se puede cambiar el 'id_modelo' de una cabeza que ya está ensamblada en un maniquí", 400));
    }
  }

  
  if (id_color && !db.colores.find((c) => c.id_color === id_color)) {
    return next(crearError(`Color con id ${id_color} no existe`, 404));
  }
  if (id_material && !db.materiales.find((m) => m.id_material === id_material)) {
    return next(crearError(`Material con id ${id_material} no existe`, 404));
  }
  if (id_modelo && !db.modelos.find((m) => m.id_modelo === id_modelo)) {
    return next(crearError(`Modelo con id ${id_modelo} no existe`, 404));
  }

  
  if (fecha_fabricacion) db.cabezas[idx].fecha_fabricacion = fecha_fabricacion;
  if (id_color) db.cabezas[idx].id_color = id_color;
  if (id_material) db.cabezas[idx].id_material = id_material;
  if (id_modelo) db.cabezas[idx].id_modelo = id_modelo;

  res.json({ mensaje: "Cabeza actualizada correctamente", data: db.cabezas[idx] });
};
 
const deleteCabeza = (req, res, next) => {
  const id = parseInt(req.params.id);
  const idx = db.cabezas.findIndex((c) => c.id_cabeza === id);
  if (idx === -1) return next(crearError("Cabeza no encontrada", 404));
 
  const enUso = db.maniquies.some((m) => m.id_cabeza === id);
  if (enUso) return next(crearError("No se puede eliminar: la cabeza está ensamblada en un maniquí", 409));
 
  db.cabezas.splice(idx, 1);
  res.json({ mensaje: "Cabeza eliminada correctamente" });
};
 

 
const TALLES_VALIDOS = ["CHICO", "MEDIANO", "LARGO"];
 
const getTorsos = (req, res) => res.json(db.torsos);
 
const getTorsoById = (req, res, next) => {
  const pieza = db.torsos.find((t) => t.id_torso === parseInt(req.params.id));
  if (!pieza) return next(crearError("Torso no encontrado", 404));
  res.json(pieza);
};
 
const createTorso = (req, res, next) => {
  const { talle, fecha_fabricacion, id_color, id_material, id_modelo } = req.body;
  if (!talle || !fecha_fabricacion || !id_color || !id_material || !id_modelo)
    return next(crearError("Faltan campos obligatorios: talle, fecha_fabricacion, id_color, id_material, id_modelo"));
 
  if (!TALLES_VALIDOS.includes(talle.toUpperCase()))
    return next(crearError(`'talle' debe ser uno de: ${TALLES_VALIDOS.join(", ")}`));
 
  const err = validarReferencias(id_color, id_material, id_modelo, next);
  if (err) return;
 
  const nuevo = {
    id_torso: db.nextId("torsos"),
    talle: talle.toUpperCase(),
    fecha_fabricacion,
    id_color,
    id_material,
    id_modelo,
  };
  db.torsos.push(nuevo);
  res.status(201).json(nuevo);
};

const updateTorso = (req, res, next) => {
  const id = parseInt(req.params.id);
  const idx = db.torsos.findIndex((t) => t.id_torso === id);
  if (idx === -1) return next(crearError("Torso no encontrado", 404));

  const { talle, fecha_fabricacion, id_color, id_material, id_modelo } = req.body;

  
  const enUso = db.maniquies.some((m) => m.id_torso === id);

  
  if (enUso) {
    if (id_modelo && id_modelo !== db.torsos[idx].id_modelo) {
      return next(crearError("No se puede cambiar el 'id_modelo' de un torso que ya está ensamblado en un maniquí", 400));
    }
  }

  
  if (id_color && !db.colores.find((c) => c.id_color === id_color)) {
    return next(crearError(`Color con id ${id_color} no existe`, 404));
  }
  if (id_material && !db.materiales.find((m) => m.id_material === id_material)) {
    return next(crearError(`Material con id ${id_material} no existe`, 404));
  }
  if (id_modelo && !db.modelos.find((m) => m.id_modelo === id_modelo)) {
    return next(crearError(`Modelo con id ${id_modelo} no existe`, 404));
  }

  
  if (talle && !TALLES_VALIDOS.includes(talle.toUpperCase())) {
    return next(crearError(`'talle' debe ser uno de: ${TALLES_VALIDOS.join(", ")}`, 400));
  }
  if (fecha_fabricacion) db.torsos[idx].fecha_fabricacion = fecha_fabricacion;
  if (id_color) db.torsos[idx].id_color = id_color;
  if (id_material) db.torsos[idx].id_material = id_material;
  if (id_modelo) db.torsos[idx].id_modelo = id_modelo;

  res.json({ mensaje: "Torso actualizado correctamente", data: db.torsos[idx] });
};
 
 
const deleteTorso = (req, res, next) => {
  const id = parseInt(req.params.id);
  const idx = db.torsos.findIndex((t) => t.id_torso === id);
  if (idx === -1) return next(crearError("Torso no encontrado", 404));
 
  const enUso = db.maniquies.some((m) => m.id_torso === id);
  if (enUso) return next(crearError("No se puede eliminar: el torso está ensamblado en un maniquí", 409));
 
  db.torsos.splice(idx, 1);
  res.json({ mensaje: "Torso eliminado correctamente" });
};
 

 
const LADOS_VALIDOS = ["IZQUIERDO", "DERECHO"];
 
const getBrazos = (req, res) => {
  const { lado } = req.query;
  if (lado) {
    const ladoNorm = lado.toUpperCase();
    if (!LADOS_VALIDOS.includes(ladoNorm))
      return res.status(400).json({ error: `'lado' debe ser IZQUIERDO o DERECHO` });
    return res.json(db.brazos.filter((b) => b.lado === ladoNorm));
  }
  res.json(db.brazos);
};
 
const getBrazoById = (req, res, next) => {
  const pieza = db.brazos.find((b) => b.id_brazo === parseInt(req.params.id));
  if (!pieza) return next(crearError("Brazo no encontrado", 404));
  res.json(pieza);
};
 
const createBrazo = (req, res, next) => {
  const { lado, fecha_fabricacion, id_color, id_material, id_modelo } = req.body;
  if (!lado || !fecha_fabricacion || !id_color || !id_material || !id_modelo)
    return next(crearError("Faltan campos obligatorios: lado, fecha_fabricacion, id_color, id_material, id_modelo"));
 
  if (!LADOS_VALIDOS.includes(lado.toUpperCase()))
    return next(crearError(`'lado' debe ser uno de: ${LADOS_VALIDOS.join(", ")}`));
 
  const err = validarReferencias(id_color, id_material, id_modelo, next);
  if (err) return;
 
  const nuevo = {
    id_brazo: db.nextId("brazos"),
    lado: lado.toUpperCase(),
    fecha_fabricacion,
    id_color,
    id_material,
    id_modelo,
  };
  db.brazos.push(nuevo);
  res.status(201).json(nuevo);
};
const updateBrazo = (req, res, next) => {
  const id = parseInt(req.params.id);
  const idx = db.brazos.findIndex((b) => b.id_brazo === id);
  if (idx === -1) return next(crearError("Brazo no encontrado", 404));

  const { lado, fecha_fabricacion, id_color, id_material, id_modelo } = req.body;

  
  const enUso = db.maniquies.some(
    (m) => m.id_brazo_izq === id || m.id_brazo_der === id
  );

 
  if (enUso) {
    if (lado && lado.toUpperCase() !== db.brazos[idx].lado) {
      return next(crearError("No se puede cambiar el 'lado' de un brazo que ya está ensamblado en un maniquí", 400));
    }
    if (id_modelo && id_modelo !== db.brazos[idx].id_modelo) {
      return next(crearError("No se puede cambiar el 'id_modelo' de un brazo que ya está ensamblado", 400));
    }
  }

  
  if (lado) {
    const ladoNorm = lado.toUpperCase();
    if (!["IZQUIERDO", "DERECHO"].includes(ladoNorm)) {
      return next(crearError("'lado' debe ser IZQUIERDO o DERECHO"));
    }
    db.brazos[idx].lado = ladoNorm;
  }

  
  if (id_color && !db.colores.find((c) => c.id_color === id_color)) {
    return next(crearError(`Color con id ${id_color} no existe`, 404));
  }
  if (id_material && !db.materiales.find((m) => m.id_material === id_material)) {
    return next(crearError(`Material con id ${id_material} no existe`, 404));
  }
  if (id_modelo && !db.modelos.find((m) => m.id_modelo === id_modelo)) {
    return next(crearError(`Modelo con id ${id_modelo} no existe`, 404));
  }

  
  if (fecha_fabricacion) db.brazos[idx].fecha_fabricacion = fecha_fabricacion;
  if (id_color) db.brazos[idx].id_color = id_color;
  if (id_material) db.brazos[idx].id_material = id_material;
  if (id_modelo) db.brazos[idx].id_modelo = id_modelo;

  res.json({ mensaje: "Brazo actualizado correctamente", data: db.brazos[idx] });
};
 
const deleteBrazo = (req, res, next) => {
  const id = parseInt(req.params.id);
  const idx = db.brazos.findIndex((b) => b.id_brazo === id);
  if (idx === -1) return next(crearError("Brazo no encontrado", 404));
 
  const enUso = db.maniquies.some(
    (m) => m.id_brazo_izq === id || m.id_brazo_der === id
  );
  if (enUso) return next(crearError("No se puede eliminar: el brazo está ensamblado en un maniquí", 409));
 
  db.brazos.splice(idx, 1);
  res.json({ mensaje: "Brazo eliminado correctamente" });
};
 
 
const getPiernas = (req, res) => {
  const { lado } = req.query;
  if (lado) {
    const ladoNorm = lado.toUpperCase();
    if (!LADOS_VALIDOS.includes(ladoNorm))
      return res.status(400).json({ error: `'lado' debe ser IZQUIERDO o DERECHO` });
    return res.json(db.piernas.filter((p) => p.lado === ladoNorm));
  }
  res.json(db.piernas);
};
 
const getPiernaById = (req, res, next) => {
  const pieza = db.piernas.find((p) => p.id_pierna === parseInt(req.params.id));
  if (!pieza) return next(crearError("Pierna no encontrada", 404));
  res.json(pieza);
};
 
const createPierna = (req, res, next) => {
  const { lado, fecha_fabricacion, id_color, id_material, id_modelo } = req.body;
  if (!lado || !fecha_fabricacion || !id_color || !id_material || !id_modelo)
    return next(crearError("Faltan campos obligatorios: lado, fecha_fabricacion, id_color, id_material, id_modelo"));
 
  if (!LADOS_VALIDOS.includes(lado.toUpperCase()))
    return next(crearError(`'lado' debe ser uno de: ${LADOS_VALIDOS.join(", ")}`));
 
  const err = validarReferencias(id_color, id_material, id_modelo, next);
  if (err) return;
 
  const nueva = {
    id_pierna: db.nextId("piernas"),
    lado: lado.toUpperCase(),
    fecha_fabricacion,
    id_color,
    id_material,
    id_modelo,
  };
  db.piernas.push(nueva);
  res.status(201).json(nueva);
};

const updatePierna = (req, res, next) => {
  const id = parseInt(req.params.id);
  const idx = db.piernas.findIndex((p) => p.id_pierna === id);
  if (idx === -1) return next(crearError("Pierna no encontrada", 404));

  const { lado, fecha_fabricacion, id_color, id_material, id_modelo } = req.body;

  
  const enUso = db.maniquies.some(
    (m) => m.id_pierna_izq === id || m.id_pierna_der === id
  );

 
  if (enUso) {
    if (lado && lado.toUpperCase() !== db.piernas[idx].lado) {
      return next(crearError("No se puede cambiar el 'lado' de una pierna que ya está ensamblada en un maniquí", 400));
    }
    if (id_modelo && id_modelo !== db.piernas[idx].id_modelo) {
      return next(crearError("No se puede cambiar el 'id_modelo' de una pierna que ya está ensamblada", 400));
    }
  }

  
  if (lado) {
    const ladoNorm = lado.toUpperCase();
    if (!["IZQUIERDO", "DERECHO"].includes(ladoNorm)) {
      return next(crearError("'lado' debe ser IZQUIERDO o DERECHO"));
    }
    db.piernas[idx].lado = ladoNorm;
  }

  
  if (id_color && !db.colores.find((c) => c.id_color === id_color)) {
    return next(crearError(`Color con id ${id_color} no existe`, 404));
  }
  if (id_material && !db.materiales.find((m) => m.id_material === id_material)) {
    return next(crearError(`Material con id ${id_material} no existe`, 404));
  }
  if (id_modelo && !db.modelos.find((m) => m.id_modelo === id_modelo)) {
    return next(crearError(`Modelo con id ${id_modelo} no existe`, 404));
  }

  
  if (fecha_fabricacion) db.piernas[idx].fecha_fabricacion = fecha_fabricacion;
  if (id_color) db.piernas[idx].id_color = id_color;
  if (id_material) db.piernas[idx].id_material = id_material;
  if (id_modelo) db.piernas[idx].id_modelo = id_modelo;

  res.json({ mensaje: "Pierna actualizada correctamente", data: db.piernas[idx] });
};
 
const deletePierna = (req, res, next) => {
  const id = parseInt(req.params.id);
  const idx = db.piernas.findIndex((p) => p.id_pierna === id);
  if (idx === -1) return next(crearError("Pierna no encontrada", 404));
 
  const enUso = db.maniquies.some(
    (m) => m.id_pierna_izq === id || m.id_pierna_der === id
  );
  if (enUso) return next(crearError("No se puede eliminar: la pierna está ensamblada en un maniquí", 409));
 
  db.piernas.splice(idx, 1);
  res.json({ mensaje: "Pierna eliminada correctamente" });
};


export const getStockDisponible = (req, res) => {
  // Filtramos cada arreglo devolviendo solo las piezas que NO (!) están en ningún maniquí
  const cabezasDisponibles = db.cabezas.filter(c => 
    !db.maniquies.some(m => m.id_cabeza === c.id_cabeza)
  );

  const torsosDisponibles = db.torsos.filter(t => 
    !db.maniquies.some(m => m.id_torso === t.id_torso)
  );

  const brazosDisponibles = db.brazos.filter(b => 
    !db.maniquies.some(m => m.id_brazo_izq === b.id_brazo || m.id_brazo_der === b.id_brazo)
  );

  const piernasDisponibles = db.piernas.filter(p => 
    !db.maniquies.some(m => m.id_pierna_izq === p.id_pierna || m.id_pierna_der === p.id_pierna)
  );

  res.json({
    mensaje: "Stock de piezas disponibles (no ensambladas)",
    totales: {
      cabezas: cabezasDisponibles.length,
      torsos: torsosDisponibles.length,
      brazos: brazosDisponibles.length,
      piernas: piernasDisponibles.length
    },
    detalle: {
      cabezas: cabezasDisponibles,
      torsos: torsosDisponibles,
      brazos: brazosDisponibles,
      piernas: piernasDisponibles
    }
  });
};

export const getStockEnUso = (req, res) => {
  // Filtramos cada arreglo devolviendo solo las piezas que SÍ están en algún maniquí
  const cabezasEnUso = db.cabezas.filter(c => 
    db.maniquies.some(m => m.id_cabeza === c.id_cabeza)
  );

  const torsosEnUso = db.torsos.filter(t => 
    db.maniquies.some(m => m.id_torso === t.id_torso)
  );

  const brazosEnUso = db.brazos.filter(b => 
    db.maniquies.some(m => m.id_brazo_izq === b.id_brazo || m.id_brazo_der === b.id_brazo)
  );

  const piernasEnUso = db.piernas.filter(p => 
    db.maniquies.some(m => m.id_pierna_izq === p.id_pierna || m.id_pierna_der === p.id_pierna)
  );

  res.json({
    mensaje: "Piezas actualmente ensambladas en maniquíes",
    detalle: {
      cabezas: cabezasEnUso,
      torsos: torsosEnUso,
      brazos: brazosEnUso,
      piernas: piernasEnUso
    }
  });
};
 
export {
  getCabezas, getCabezaById, createCabeza, updateCabeza, deleteCabeza,
  getTorsos, getTorsoById, createTorso, updateTorso, deleteTorso,
  getBrazos, getBrazoById, createBrazo, updateBrazo, deleteBrazo,
  getPiernas, getPiernaById, createPierna, updatePierna, deletePierna, getStockDisponible, getStockEnUso
};
 