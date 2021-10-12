const express = require('express')
const app = express()
const port = 3008
    // IMPORTS
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser");
const { authorization, checkUser } = require('./utils/authorization')
    // MIDDLEWARES
app.set('view engine', 'ejs')
app.use(express.urlencoded())
app.use(cookieParser())

// ROUTES
app.get('*', checkUser) // verifie si User a un JWT, si c'est le cas on passe user dans l'objet Locals
app.get('/', (req, res) => {
    res.render('home')
})
app.get('/login', (req, res) => {
    res.render('login')
})

//LOGIN
app.post('/login', (req, res) => {
    // ON INSTENCIER DES VARIABLE EN DUR 
    // TODO : RECUPERER LES DONNES DE LA BDD
    const username = "toto@yahoo.fr"
    const password = "1234"

    if (username == req.body.username && password == req.body.password) {
        // create jwt : on lui passe les valeur de l'user, la clé secrete c'est a nous de la definir
        const token = jwt.sign({ _id: 1, username: username }, "SECRET-KEY")

        res.cookie("Token", token, { httpOnly: true }) // passer le token dans le cookie
        res.redirect("/protected")
    } else {
        res.redirect("/")
    }
})

// PROTECTED
app.get('/protected', authorization, (req, res) => {
    // console.log(jwt.verify(req.cookies.Token, "SECRET-KEY"))
    res.send('protected page..')
})

app.get('/logout', (req, res) => {
    console.log('loged out')
        //res.clearCookie('Token')
    res.cookie('Token', 'SECRET-KEY', { maxAge: 1 })
        .redirect('/login')
})
app.listen(port, () => console.log(`Example app listening on port port!`))