const express = require('express');
const router = express.Router();
const { conexionMaestro, conexionEsclavo } = require('../conexionBD');

// Middleware para proteger rutas
const esAdmin = (req, res, next) => {
    if (req.session.usuario && req.session.usuario.rol === 'admin') return next();
    res.redirect('/login');
};

const esCliente = (req, res, next) => {
    if (req.session.usuario && req.session.usuario.rol === 'cliente') return next();
    res.redirect('/login');
};

// Redirección inicial
router.get('/', (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');
    res.redirect(req.session.usuario.rol === 'admin' ? '/admin' : '/cliente');
});

// ==========================================
// ROL ADMINISTRADOR (CRUD Completo)
// ==========================================

router.get('/admin', esAdmin, async (req, res) => {
    try {
        const [recetas] = await conexionEsclavo.query('SELECT * FROM recetas ORDER BY id DESC');
        res.render('panel-admin', { recetas, error: null, exito: null });
    } catch (err) {
        res.render('panel-admin', { recetas: [], error: 'Error al consultar catálogo', exito: null });
    }
});

// Crear Receta con validación de código duplicado
router.post('/admin/crear', esAdmin, async (req, res) => {
    const { codigo, nombre, descripcion, categoria, porciones, disponible, imagen_url, video_url } = req.body;

    try {
        // 1. Validar si ya existe el código en la réplica/maestro
        const [existe] = await conexionEsclavo.query('SELECT id FROM recetas WHERE codigo = ?', [codigo]);

        if (existe.length > 0) {
            const [recetas] = await conexionEsclavo.query('SELECT * FROM recetas ORDER BY id DESC');
            return res.render('panel-admin', {
                recetas,
                error: `El código "${codigo}" ya está registrado. Ingresa uno diferente.`,
                exito: null
            });
        }

        // 2. Insertar en el Maestro
        await conexionMaestro.query(
            `INSERT INTO recetas (codigo, nombre, descripcion, categoria, porciones, disponible, imagen_url, video_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [codigo, nombre, descripcion, categoria, porciones || 1, disponible ? 1 : 0, imagen_url || null, video_url || null]
        );

        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.redirect('/admin');
    }
});

// Eliminar Receta
router.get('/admin/eliminar/:id', esAdmin, async (req, res) => {
    try {
        await conexionMaestro.query('DELETE FROM recetas WHERE id = ?', [req.params.id]);
        res.redirect('/admin');
    } catch (err) {
        res.redirect('/admin');
    }
});

// ==========================================
// ROL CLIENTE (Consulta en tiempo real y Pedido)
// ==========================================

router.get('/cliente', esCliente, async (req, res) => {
    const categoriaFiltro = req.query.categoria || '';
    let sql = 'SELECT * FROM recetas WHERE disponible = 1';
    let parametros = [];

    if (categoriaFiltro) {
        sql += ' AND categoria = ?';
        parametros.push(categoriaFiltro);
    }

    try {
        const [recetas] = await conexionEsclavo.query(sql, parametros);
        res.render('catalogo-cliente', { recetas, categoriaFiltro });
    } catch (err) {
        res.render('catalogo-cliente', { recetas: [], categoriaFiltro: '' });
    }
});

module.exports = router;