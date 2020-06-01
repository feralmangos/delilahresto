'use strict';

const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const sequelize = require('./db');
const colors = require('colors');
const path = require('path');
const PORT = process.env.PORT || 3000;

const {
    getProductos,
    getProductosId,
    updateProducto,
    deleteProducto,
    crearProducto
} = require('./productos');

const {
    userAdmin,
    userLogged,
    userLogin,
    userRegister,
    favoritos,
    crearFavoritos,
    getUsuarios,
    getUsuario
} = require('./users');

const {
    getPedidos,
    crearPedido,
    crearItem,
    updatePedidoEstado,
    getPedidosUser
} = require('./pedidos');

//--------------------------------//

server.use(bodyParser.json());
server.listen(PORT, () => console.log(`Server is on the port: ${PORT}`.rainbow));

//------------------CRUD PRODUCTOS-------------------//

server.get('/productos', getProductos);
server.get('/productos/:id', userLogged, getProductosId);
server.post('/productos', userAdmin, crearProducto);
server.put('/productos/:id', userAdmin, updateProducto);
server.delete('/productos/:id', userAdmin, deleteProducto);

//------------------USERS-------------------//

server.post('/login', userLogin);
server.post('/register', userRegister);
server.get('/favoritos', userLogged, favoritos);
server.post('/favoritos', userLogged, crearFavoritos);
server.get('/usuarios', userAdmin, getUsuarios);
server.get('/usuario', userLogged, getUsuario);

//------------------PEDIDOS-------------------//

server.get('/userpedidos', userLogged, getPedidosUser);
server.get('/pedidos', userAdmin, getPedidos);
server.post('/pedidos', userLogged, crearPedido);
server.post('/items', userLogged, crearItem);
server.put('/pedidos/:id', userAdmin, updatePedidoEstado);