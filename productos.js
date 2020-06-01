'use strict';

const sequelize = require('./db');

//----------GET PRODUCTOS-----------//

async function getProductos(req, res) {
    sequelize.query('SELECT * from productos', {
        type: sequelize.QueryTypes.SELECT
    }).then(function(resultados) {
        console.log(resultados);
        res.json(resultados)
    });
}

//----------GET PRODUCTOS POR ID-----------//

async function getProductosId(req, res) {
    const idProduct = req.params.id;
    sequelize.query(`SELECT * FROM productos WHERE productos.ID=${idProduct}`, {
        type: sequelize.QueryTypes.SELECT
    }).then(function(resultados) {
        console.log(resultados);
        res.json(resultados)
    });
}

//----------CREAR PRODUCTO-----------//

async function crearProducto(req, res) {
    sequelize.query(`INSERT INTO productos values (NULL,'${req.body.nombre_producto}','${req.body.imagen}',${req.body.PRECIO})`, {
        type: sequelize.QueryTypes.INSERT
    }).then(function(resultados) {
        res.status(200).json("Se agregó el producto correctamente");
    });
}

//----------UPDATE PRODUCTO-----------//

async function updateProducto(req, res) {
    const idProduct = req.params.id;
    sequelize.query(`UPDATE productos SET nombre_producto='${req.body.nombre_producto}',imagen='${req.body.imagen}',PRECIO=${req.body.PRECIO} WHERE productos.ID= ${idProduct}`, {
        type: sequelize.QueryTypes.UPDATE
    }).then(function(resultados) {
        res.status(200).json("Se modificó el producto correctamente");
    });
}

//----------DELETE PRODUCTO-----------//

async function deleteProducto(req, res) {
    const idDelete = req.params.id;
    sequelize.query(`DELETE from productos where id=${idDelete}`, {
        type: sequelize.QueryTypes.DELETE
    }).then(function(resultados) {
        res.status(200).json(`Se Elimino el registro del producto con id ${idDelete} correctamente`);
    });
}

module.exports = {
    getProductos,
    getProductosId,
    updateProducto,
    deleteProducto,
    crearProducto
}