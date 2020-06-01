'use strict';

const Sequelize = require('sequelize');

//-------------CONNECT TO DB DELILAH DB-------------------//

const sequelize = new Sequelize('delilah', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

//-----------CONNECTION TEST TO DB----------------------//

(async function tryDb() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.'.inverse);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})()


module.exports = sequelize;