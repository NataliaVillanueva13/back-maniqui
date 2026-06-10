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
    res.status(201).json({ mensaje: "Maniquí creado exitosamente", data: nuevoManiqui });
};

export const updateManiqui = (req, res, next) => {
    const { id } = req.params;
    const index = db.maniquies.findIndex(m => m.id_maniqui === parseInt(id));

    if (index === -1) return next(crearError("Maniquí no encontrado", 404));

    // Actualiza solo los campos enviados en el body
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