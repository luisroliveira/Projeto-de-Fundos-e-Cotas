//Carregando módulos
    var express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    const principal = require("./routes/principal");
    const path = require("path");
    const session = require("express-session");
    const flash = require("connect-flash");

//Configurações
    //Sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }));
        app.use(flash());
    //Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            next();
        })
    //HandleBars - Template engine
        app.engine('handlebars', handlebars({
            defaultLayout: 'main'
        }));
        app.set('view engine', 'handlebars');
    //Body parser - (serve para pegar os dados do formulario)
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());
    //Public
        app.use(express.static(path.join(__dirname, "public")));

//Rotas
    app.use("/principal", principal);

//Outros
    const PORT = 8193;
    app.listen(PORT, () => {
        console.log('Servidor rodando!')
    });