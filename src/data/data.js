// =====================================================
//  BASE DE DATOS EN MEMORIA - Fábrica de Maniquíes
// =====================================================

const db = {

  // --- CATÁLOGO ---
  colores: [
    { id_color: 1, nombre: "Blanco",    acabado: "Mate" },
    { id_color: 2, nombre: "Negro",     acabado: "Brillante" },
    { id_color: 3, nombre: "Tono Piel", acabado: "Estándar" },
  ],

  materiales: [
    { id_material: 1, nombre: "Fibra de vidrio" },
    { id_material: 2, nombre: "Plástico PVC" },
    { id_material: 3, nombre: "Madera" },
  ],

  // --- MODELOS ---
  modelos: [
    { id_modelo: 1, sexo: "F", edad: "ADULTO" },
    { id_modelo: 2, sexo: "M", edad: "ADULTO" },
    { id_modelo: 3, sexo: "F", edad: "INFANTIL" },
    { id_modelo: 4, sexo: "M", edad: "INFANTIL" },
  ],

  // --- PIEZAS ---
  cabezas: [
    { id_cabeza: 1, fecha_fabricacion: "2024-01-10", id_color: 1, id_material: 1, id_modelo: 1 },
    { id_cabeza: 2, fecha_fabricacion: "2024-01-11", id_color: 2, id_material: 2, id_modelo: 2 },
  ],

  torsos: [
    { id_torso: 1, talle: "MEDIANO", fecha_fabricacion: "2024-01-10", id_color: 1, id_material: 1, id_modelo: 1 },
    { id_torso: 2, talle: "LARGO",   fecha_fabricacion: "2024-01-11", id_color: 2, id_material: 2, id_modelo: 2 },
  ],

  brazos: [
    { id_brazo: 1, lado: "IZQUIERDO", fecha_fabricacion: "2024-01-10", id_color: 1, id_material: 1, id_modelo: 1 },
    { id_brazo: 2, lado: "DERECHO",   fecha_fabricacion: "2024-01-10", id_color: 1, id_material: 1, id_modelo: 1 },
    { id_brazo: 3, lado: "IZQUIERDO", fecha_fabricacion: "2024-01-11", id_color: 2, id_material: 2, id_modelo: 2 },
    { id_brazo: 4, lado: "DERECHO",   fecha_fabricacion: "2024-01-11", id_color: 2, id_material: 2, id_modelo: 2 },
  ],

  piernas: [
    { id_pierna: 1, lado: "IZQUIERDO", fecha_fabricacion: "2024-01-10", id_color: 1, id_material: 1, id_modelo: 1 },
    { id_pierna: 2, lado: "DERECHO",   fecha_fabricacion: "2024-01-10", id_color: 1, id_material: 1, id_modelo: 1 },
    { id_pierna: 3, lado: "IZQUIERDO", fecha_fabricacion: "2024-01-11", id_color: 2, id_material: 2, id_modelo: 2 },
    { id_pierna: 4, lado: "DERECHO",   fecha_fabricacion: "2024-01-11", id_color: 2, id_material: 2, id_modelo: 2 },
  ],

  // --- MANIQUÍES (ensamblados) ---
  maniquies: [
    {
      id_maniqui: 1,
      id_modelo: 1,
      id_cabeza: 1,
      id_torso: 1,
      id_brazo_izq: 1,
      id_brazo_der: 2,
      id_pierna_izq: 1,
      id_pierna_der: 2,
      fecha_ensamblaje: "2024-01-15",
    },
  ],

  // --- Contadores de IDs (simula AUTO_INCREMENT) ---
  _seq: {
    colores:    4,
    materiales: 4,
    modelos:    5,
    cabezas:    3,
    torsos:     3,
    brazos:     5,
    piernas:    5,
    maniquies:  2,
  },

  // Genera el próximo ID para una colección
  nextId(coleccion) {
    return this._seq[coleccion]++;
  },
};

export const colours = db.colores;
export const models = db.modelos;
export const maniquies = db.maniquies;
export default db;