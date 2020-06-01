'use strict';

const sequelize = require('./db');
const jwt = require('jsonwebtoken');
const firma = 'Mi_firma_secreta';
let token;
const bcrypt = require("bcrypt");
const saltRounds = 10;

//----------ADMIN VALIDATION-----------//

async function userAdmin(req, res, next) {
    const token = await req.headers.authorization.split(' ')[1];
    const descodificado = jwt.verify(token, firma);
    console.log(descodificado);
    const user = await sequelize.query(`SELECT * FROM usuarios WHERE usuarios.nombre='${descodificado}'`, {
        type: sequelize.QueryTypes.SELECT
    });
    console.log(user);
    if (user.length) {
        if (user[0].es_admin) {
            next();
        } else {
            res.status(409).json("Forbidden Access")
        }
    } else {
        res.status(409).json("No user with such username in db")
    }
}

//----------USER VALIDATION-----------//

async function userLogged(req, res, next) {
    const token = await req.headers.authorization.split(' ')[1];
    const descodificado = jwt.verify(token, firma);
    console.log(descodificado);
    const user = await sequelize.query(`SELECT * FROM usuarios WHERE usuarios.nombre='${descodificado}'`, {
        type: sequelize.QueryTypes.SELECT
    });
    console.log(user);
    if (user.length) {
        if (user[0]) {
            next();
        } else {
            res.status(409).json("Forbidden Access")
        }
    } else {
        res.status(409).json("No user with such username in db")
    }
}

//----------LOGIN-----------//

async function userLogin(req, res) {
    const { email, password, usuario } = req.body;
    //usuario en la base de datos se registra como nombre
    const user = await sequelize.query(`SELECT * FROM usuarios WHERE usuarios.email='${email}' || usuarios.nombre='${usuario}'`, {
        type: sequelize.QueryTypes.SELECT
    });
    if (user.length) {
        console.log(user.length);
        console.log(user);
        console.log(`La password hasheada del usuario es ${user[0].password}`);
        if (bcrypt.compareSync(password, user[0].password)) {
            token = jwt.sign(user[0].nombre, firma);
            console.log(`El token es ${token} de ${user[0].nombre}`.red);
            res.status(200).json(`El token es ${token} del usuario ${user[0].nombre}`);
        } else { res.status(404).json("Password is not matched") }
    } else {
        res.status(404).json("User is not matched")
    }
}

//----------REGISTER-----------//

async function userRegister(req, res) {
    const { password, email, usuario } = req.body;
    const user = req.body;
    //CHECKEO DE EXISTENCIA DE USUARIO
    //usuario en la base de datos se registra como nombre
    const userdb = await sequelize.query(`SELECT * FROM usuarios WHERE usuarios.email='${email}' || usuarios.nombre='${usuario}'`, {
        type: sequelize.QueryTypes.SELECT
    });
    if (!userdb.length) {
        let passwordEncrypted = bcrypt.hashSync(password, saltRounds);
        console.log(`La password enviada es ${passwordEncrypted}`);
        sequelize.query(`INSERT INTO usuarios values (NULL,'${req.body.usuario}','${req.body.nombre_apellido}','${req.body.email}','${req.body.tel}','${req.body.direccion}','${passwordEncrypted}',0)`, {
            type: sequelize.QueryTypes.INSERT
        }).then(function(resultados) {
            res.status(200).json("Se registró el usuario correctamente");
        });
    } else {
        res.status(404).json("User ya existe")
    }
}

//----------FAVORITOS-----------//

async function favoritos(req, res, next) {
    const token = await req.headers.authorization.split(' ')[1];
    const descodificado = jwt.verify(token, firma);
    console.log(descodificado);
    const user = await sequelize.query(`SELECT * FROM usuarios WHERE usuarios.nombre='${descodificado}'`, {
        type: sequelize.QueryTypes.SELECT
    });
    const fav = await sequelize.query(`SELECT productos.nombre_producto as favorito FROM favoritos JOIN productos ON productos.ID = favoritos.id_producto WHERE favoritos.id_usuario='${user[0].ID}'`, {
        type: sequelize.QueryTypes.SELECT
    }).then(function(resultados) {
        res.status(200).json(resultados);
    });

}
//----------CREAR FAVORITOS-----------//

async function crearFavoritos(req, res, next) {
    const token = await req.headers.authorization.split(' ')[1];
    const descodificado = jwt.verify(token, firma);
    console.log(descodificado);
    const user = await sequelize.query(`SELECT * FROM usuarios WHERE usuarios.nombre='${descodificado}'`, {
        type: sequelize.QueryTypes.SELECT
    });
    sequelize.query(`INSERT INTO favoritos values (NULL,${user[0].ID},${req.body.id_producto})`, {
        type: sequelize.QueryTypes.INSERT
    }).then(function(resultados) {
        res.status(200).json("Se registró el favorito correctamente");
    });
}

//----------GET USUARIOS-----------//

async function getUsuarios(req, res) {
    sequelize.query('SELECT * from usuarios', {
        type: sequelize.QueryTypes.SELECT
    }).then(function(resultados) {
        console.log(resultados);
        res.json(resultados)
    });
}

async function getUsuario(req, res) {
    const token = await req.headers.authorization.split(' ')[1];
    const descodificado = jwt.verify(token, firma);
    console.log(descodificado);
    const user = await sequelize.query(`SELECT * FROM usuarios WHERE usuarios.nombre='${descodificado}'`, {
        type: sequelize.QueryTypes.SELECT
    });
    sequelize.query(`SELECT * from usuarios WHERE usuarios.ID=${user[0].ID}`, {
        type: sequelize.QueryTypes.SELECT
    }).then(function(resultados) {
        console.log(resultados);
        res.json(resultados)
    });
}

module.exports = {
    userAdmin,
    userLogged,
    userLogin,
    userRegister,
    favoritos,
    crearFavoritos,
    getUsuarios,
    getUsuario
}