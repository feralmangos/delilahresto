'use strict';

const sequelize = require('./db');
const jwt = require('jsonwebtoken');
const firma = 'Mi_firma_secreta';
let token;
const bcrypt = require("bcrypt");
const saltRounds = 10;

//----------GET PEDIDOS-----------//

async function getPedidos(req, res) {
    const pedidos = await sequelize.query(`SELECT pedidos.ID , pedidos.dt , pedidos.card, estados.nombre_estado,usuarios.nombre_apellido,usuarios.direccion as estado, usuarios.nombre as user from pedidos JOIN estados ON pedidos.id_estado = estados.id JOIN usuarios ON pedidos.id_usuario = usuarios.id `, {
        type: sequelize.QueryTypes.SELECT
    }).then(function(resultados) {
        return resultados
    });
    const items = await sequelize.query(`SELECT items.id_pedido, items.cantidad, productos.nombre_producto as producto, productos.PRECIO as precio from items JOIN productos ON productos.ID = items.id_producto`, {
        type: sequelize.QueryTypes.SELECT
    }).then(function(resultados) {
        return resultados
    });
    console.log(items);
    let pedidosItems = [...pedidos];

    (function combinar() {
        //console.log(pedidosItems);
        pedidosItems.map((elem) => {
            elem.items = items.filter((elem2) => elem2.id_pedido == elem.ID);
            elem.total = 0;
            console.log(elem.items);
            elem.items.map(elem3 => {
                console.log('Price is ' + elem3.precio);
                console.log('Quantity is ' + elem3.cantidad);
                elem3.subTotal = parseFloat(elem3.precio) * elem3.cantidad;
                elem.total += elem3.subTotal;
            });
        });
        console.log(pedidosItems);
    })();
    return res.json(pedidos)
}
//----------GET PEDIDOS USER-----------//

async function getPedidosUser(req, res) {
    const token = await req.headers.authorization.split(' ')[1];
    const descodificado = jwt.verify(token, firma);
    console.log(descodificado);
    const user = await sequelize.query(`SELECT * FROM usuarios WHERE usuarios.nombre='${descodificado}'`, {
        type: sequelize.QueryTypes.SELECT
    });
    const pedidos = await sequelize.query(`SELECT pedidos.ID , pedidos.dt , pedidos.card, estados.nombre_estado,usuarios.nombre_apellido,usuarios.direccion as estado, usuarios.nombre as user from pedidos JOIN estados ON pedidos.id_estado = estados.id JOIN usuarios ON pedidos.id_usuario =usuarios.id WHERE pedidos.id_usuario=${user[0].ID}`, {
        type: sequelize.QueryTypes.SELECT
    }).then(function(resultados) {
        return resultados
    });
    const items = await sequelize.query('SELECT items.id_pedido, items.cantidad, productos.nombre_producto as producto, productos.PRECIO as precio from items JOIN productos ON productos.ID = items.id_producto ', {
        type: sequelize.QueryTypes.SELECT
    }).then(function(resultados) {
        return resultados
    });
    console.log(items);
    let pedidosItems = [...pedidos];

    (function combinar() {
        //console.log(pedidosItems);
        pedidosItems.map((elem) => {
            elem.items = items.filter((elem2) => elem2.id_pedido == elem.ID);
            elem.total = 0;
            console.log(elem.items);
            elem.items.map(elem3 => {
                console.log('Price is ' + elem3.precio);
                console.log('Quantity is ' + elem3.cantidad);
                elem3.subTotal = parseFloat(elem3.precio) * elem3.cantidad;
                elem.total += elem3.subTotal;
            });
        });
        console.log(pedidosItems);
    })();
    return res.json(pedidos)
}


//----------CREAR PEDIDO-----------//

async function crearPedido(req, res) {
    sequelize.query(`INSERT INTO pedidos values (NULL,${req.body.id_estado},${req.body.dt},${req.body.id_usuario},${req.body.card})`, {
        type: sequelize.QueryTypes.INSERT
    }).then(function(resultados) {
        res.status(200).json("Se agregó el producto correctamente");
    });
}

//----------CREAR ITEM-----------//

async function crearItem(req, res) {
    const { id_pedido, id_producto, cantidad } = req.body;
    console.log(req.body);
    sequelize.query(`INSERT INTO items values (NULL,${req.body.id_pedido},${req.body.id_producto},${req.body.cantidad})`, {
        type: sequelize.QueryTypes.INSERT
    }).then(function(resultados) {
        res.status(200).json(`Se agregó el item correctamente`);
    });
}

//----------UPDATE ESTADO-----------//

async function updatePedidoEstado(req, res) {
    const idPedido = req.params.id;
    sequelize.query(`UPDATE pedidos SET pedidos.id_estado=${req.body.id_estado} WHERE pedidos.ID= ${idPedido}`, {
        type: sequelize.QueryTypes.UPDATE
    }).then(function(resultados) {
        res.status(200).json("Se modificó el pedido correctamente");
    });
}

module.exports = {
    getPedidos,
    crearPedido,
    crearItem,
    updatePedidoEstado,
    getPedidosUser
}