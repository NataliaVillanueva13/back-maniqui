

export const crearError = (mensaje, status = 500) => {
  const err = new Error(mensaje);
  err.status = status;
  return err;
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const mensaje = err.message || "Error interno del servidor";
  
  res.status(status).json({ 
    error: true,
    status: status,
    mensaje: mensaje 
  });
};