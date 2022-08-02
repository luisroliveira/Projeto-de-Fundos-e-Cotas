const db = require('./db');

const Fundos = db.sequelize.define("fundos", {
    nome: {
        type: db.Sequelize.TEXT
    },
    CNPJ: {
        type: db.Sequelize.INTEGER
    },
    razaoSocial: {
        type: db.Sequelize.TEXT
    },
    dataDaConsulta: {
        type: db.Sequelize.DATEONLY
    },
    valorUnit: {
        type: db.Sequelize.FLOAT
    },
    numeroCotas: {
        type: db.Sequelize.INTEGER
    },
    precoMedio: {
        type: db.Sequelize.FLOAT
    },
    retOperacao: {
        type: db.Sequelize.FLOAT
    },
    saldoAplicFundo: {
        type: db.Sequelize.FLOAT
    },
    valorInvestido: {
        type: db.Sequelize.FLOAT
    }
});

//Fundos.sync({force: true}); //Adicionando uma tabela ao bando de dados

module.exports = Fundos;