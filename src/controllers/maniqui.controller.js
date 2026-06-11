// controllers/maniqui.controller.js
import db from '../data/data.js';
import { crearError } from '../middleware/errorHandler.js';

export const getManiquies = (req, res) => {
    const maniquiesEnsamblados = db.maniquies.map(maniqui => {
        const modelo = db.modelos.find(m => m.id_modelo === maniqui.id_modelo);

        return {
            ...maniqui,
            modelo_info: modelo ? `${modelo.sexo} - ${modelo.edad}` : 'Desconocido'
        };
    });

    res.json(maniquiesEnsamblados);
};

export const getManiquiById = (req, res, next) => {
    const { id } = req.params; 
    const maniqui = db.maniquies.find(m => m.id_maniqui === parseInt(id));

    if (!maniqui) return next(crearError("Maniquí no encontrado", 404));

    const modelo = db.modelos.find(m => m.id_modelo === maniqui.id_modelo);

    res.json({
        ...maniqui,
        modelo_info: modelo ? `${modelo.sexo} - ${modelo.edad}` : 'Desconocido'
    });
};
export const createManiqui = (req, res, next) => {
    const { id_modelo, id_cabeza, id_torso, id_brazo_izq, id_brazo_der, id_pierna_izq, id_pierna_der, fecha_ensamblaje } = req.body;
    
    if (!id_modelo || !id_cabeza || !id_torso || !id_brazo_izq || !id_brazo_der || !id_pierna_izq || !id_pierna_der || !fecha_ensamblaje) {
        return next(crearError("Faltan datos o piezas para ensamblar el maniquí", 400));
    }

    if (id_brazo_izq === id_brazo_der || id_pierna_izq === id_pierna_der) {
        return next(crearError("Error lógico: No puedes usar la misma pieza para el lado izquierdo y derecho simultáneamente", 400));
    }

    // Validación de stock
    const cabezaEnUso = db.maniquies.some(m => m.id_cabeza === id_cabeza);
    const torsoEnUso = db.maniquies.some(m => m.id_torso === id_torso);
    const brazoIzqEnUso = db.maniquies.some(m => m.id_brazo_izq === id_brazo_izq || m.id_brazo_der === id_brazo_izq);
    const brazoDerEnUso = db.maniquies.some(m => m.id_brazo_izq === id_brazo_der || m.id_brazo_der === id_brazo_der);
    const piernaIzqEnUso = db.maniquies.some(m => m.id_pierna_izq === id_pierna_izq || m.id_pierna_der === id_pierna_izq);
    const piernaDerEnUso = db.maniquies.some(m => m.id_pierna_izq === id_pierna_der || m.id_pierna_der === id_pierna_der);

    if (cabezaEnUso || torsoEnUso || brazoIzqEnUso || brazoDerEnUso || piernaIzqEnUso || piernaDerEnUso) {
        return next(crearError("Conflicto de stock: Una o más piezas solicitadas ya están ensambladas en otro maniquí", 409));
    }

    const nuevoManiqui = {
        id_maniqui: db.nextId("maniquies"),
        id_modelo,
        id_cabeza,
        id_torso,
        id_brazo_izq,
        id_brazo_der,
        id_pierna_izq,
        id_pierna_der,
        fecha_ensamblaje
    };

    db.maniquies.push(nuevoManiqui);
    res.status(201).json({ mensaje: "Maniquí ensamblado exitosamente", data: nuevoManiqui });
};

export const updateManiqui = (req, res, next) => {
    const id = parseInt(req.params.id);
    const index = db.maniquies.findIndex(m => m.id_maniqui === id);

    if (index === -1) return next(crearError("Maniquí no encontrado", 404));

    const { id_cabeza, id_torso, id_brazo_izq, id_brazo_der, id_pierna_izq, id_pierna_der } = req.body;

     
    const enUsoPorOtro = db.maniquies.some(m => {
        if (m.id_maniqui === id) return false;
        return (
            (id_cabeza && m.id_cabeza === id_cabeza) ||
            (id_torso && m.id_torso === id_torso) ||
            (id_brazo_izq && (m.id_brazo_izq === id_brazo_izq || m.id_brazo_der === id_brazo_izq)) ||
            (id_brazo_der && (m.id_brazo_izq === id_brazo_der || m.id_brazo_der === id_brazo_der)) ||
            (id_pierna_izq && (m.id_pierna_izq === id_pierna_izq || m.id_pierna_der === id_pierna_izq)) ||
            (id_pierna_der && (m.id_pierna_izq === id_pierna_der || m.id_pierna_der === id_pierna_der))
        );
    });

    if (enUsoPorOtro) {
        return next(crearError("Conflicto de stock: Una o más piezas nuevas ya están ensambladas en otro maniquí", 409));
    }
 
    const finalBrazoIzq = id_brazo_izq || db.maniquies[index].id_brazo_izq;
    const finalBrazoDer = id_brazo_der || db.maniquies[index].id_brazo_der;
    const finalPiernaIzq = id_pierna_izq || db.maniquies[index].id_pierna_izq;
    const finalPiernaDer = id_pierna_der || db.maniquies[index].id_pierna_der;

    if (finalBrazoIzq === finalBrazoDer || finalPiernaIzq === finalPiernaDer) {
        return next(crearError("Error lógico: No puedes tener la misma pieza en el lado izquierdo y derecho simultáneamente", 400));
    }

    
    db.maniquies[index] = { ...db.maniquies[index], ...req.body };

    res.json({ mensaje: "Maniquí actualizado exitosamente", data: db.maniquies[index] });
};


export const deleteManiqui = (req, res, next) => {
    const { id } = req.params;
    const index = db.maniquies.findIndex(m => m.id_maniqui === parseInt(id));

    if (index === -1) return next(crearError("Maniquí no encontrado", 404));

    db.maniquies.splice(index, 1);
    res.json({ mensaje: "Maniquí eliminado exitosamente" });
};
