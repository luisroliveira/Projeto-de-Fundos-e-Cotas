const express = require("express");
const Fundos = require("../models/Fundo");
const router = express.Router();
const Fundo = require('../models/Fundo');

router.get("/fundos", (req, res) => {
    Fundo.findAll().then((fundo) => {
        res.render("principal/fundos", {fundo: fundo})
    }) .catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias!");
        res.redirect("/admin");
    })
})

router.get("/fundos/add", (req, res) => {
    res.render("principal/addfundos");
})

router.post("/fundos/novo", (req, res) => {
    Fundo.create({
        nome: req.body.nome,
        CNPJ: req.body.CNPJ,
        razaoSocial: req.body.razaoSocial,
        dataDaConsulta: req.body.dataDaConsulta,
        valorUnit: req.body.valorUnit,
        numeroCotas: req.body.numeroCotas,
        precoMedio: req.body.valorUnit,
        retOperacao: 0.00,
        saldoAplicFundo: req.body.valorUnit * req.body.numeroCotas,
        valorInvestido: req.body.valorUnit * req.body.numeroCotas
    }).then(() => {
        res.redirect("/principal/fundos");
    })
})

router.get("/fundos/comprar/:id", (req, res) => {
    Fundo.findOne({where: {id: req.params.id}}).then((fundo) => {
        res.render("principal/comprarfundos", {fundo: fundo});
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe!");
        res.redirect("/principal/fundos");
    });
})

router.post("/fundos/editcomprar", (req, res) => {
    Fundo.findOne({where: {id: req.body.id}}).then((fundo) => {

        var numeroCotasNovo = parseFloat(req.body.numeroCotas) + parseFloat(fundo.numeroCotas);
        var precoMedioNovo = (parseFloat(req.body.numeroCotas) * parseFloat(req.body.valorUnit) + parseFloat(fundo.precoMedio) * parseFloat(fundo.numeroCotas)) / parseFloat(numeroCotasNovo);
        var saldoAplicFundoNovo = parseFloat(req.body.valorUnit) * parseFloat(numeroCotasNovo);
        //var valorInvestidoNovo = fundo.valorInvestido + parseFloat(req.body.numeroCotas) * parseFloat(req.body.valorUnit);
        var retOperacaoNovo = (parseFloat(req.body.valorUnit) / parseFloat(precoMedioNovo) - 1) * 100; 
        
        fundo.update({
            dataDaConsulta: req.body.dataDaConsulta,
            valorUnit: req.body.valorUnit,
            numeroCotas: numeroCotasNovo,
            precoMedio: precoMedioNovo,
            saldoAplicFundo: saldoAplicFundoNovo,
            retOperacao: retOperacaoNovo
        });

        req.flash("success_msg", "Categoria editada com sucesso!");
        res.redirect("/principal/fundos");
        
    }).catch((err) => {
        console.log(req.body.id);
        console.log(req.body.numeroCotas);
        req.flash("error_msg", "Houve um erro ao editar a categoria!")
        res.redirect("/principal/fundos");
    })
})

router.get("/fundos/vender/:id", (req, res) => {
    Fundo.findOne({where: {id: req.params.id}}).then((fundo) => {
        res.render("principal/venderfundos", {fundo: fundo});
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe!");
        res.redirect("/principal/fundos");
    });
})

router.post("/fundos/editvender", (req, res) => {
    Fundo.findOne({where: {id: req.body.id}}).then((fundo) => {
        var erros = [];

        if (req.body.numeroCotas > fundo.numeroCotas) {
            req.flash("error_msg", "Esse fundo não possui tantas cotas para vender!");
            res.redirect("/principal/fundos");
        }

        else {
            var numeroCotasNovo = parseFloat(fundo.numeroCotas) - parseFloat(req.body.numeroCotas);
            var saldoAplicFundoNovo = parseFloat(req.body.valorUnit) * parseFloat(numeroCotasNovo);
            var retOperacaoNovo = parseFloat(fundo.valorUnit) / parseFloat(fundo.precoMedio); 
            
            if (numeroCotasNovo == 0) {
                fundo.destroy().then(() => {
                    res.redirect("/principal/fundos");
                })
                req.flash("success_msg", "Fundo apagado com sucesso!");
                res.redirect("/principal/fundos");
            }

            else {
                fundo.update({
                    dataDaConsulta: req.body.dataDaConsulta,
                    valorUnit: req.body.valorUnit,
                    numeroCotas: numeroCotasNovo,
                    saldoAplicFundo: saldoAplicFundoNovo,
                    retOperacao: retOperacaoNovo
                });
                req.flash("success_msg", "Fundo vendido com sucesso!");
                res.redirect("/principal/fundos");
            }
        }
        
    }).catch((err) => {
        console.log(req.body.id);
        console.log(req.body.numeroCotas);
        req.flash("error_msg", "Houve um erro ao editar o fundo!")
        res.redirect("/principal/fundos");
    })
})

module.exports = router;