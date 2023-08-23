const { Router } = require("express");
const { Session } = require("express-session");
const pM = require('../../dao/managers/products/Product.db.manager');
const cM = require('../../dao/managers/carts/cart.db.manager');
const userManager = require('../../dao/managers/users/user.manager');
const isAuth = require('../../dao/managers/users/middlewares/auth.middleware');


const router = Router()

//Login de Usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await userManager.getByEmail(email)

        if (!user) {
            return res.status(404).send({
                status: '404',
                message: 'El Usuario No Existe'
            });
        } else if (user.password !== password) {
            return res.status(500).send({
                status: '500',
                message: 'La Contraseña es Incorrecta'
            });
        }

        req.session.user = {
            name: user.firstname,
            id: user._id,
            role: user.email === 'adminCoder@coder.com' && user.password === 'Cod3r123' ? 'Administrador' : 'Usuario',
            ...user
        };
        // guardo la session con la informacion del usuario
        req.session.save((err) => {
            if (!err) {
                res.status(200).send({
                    status: 200,
                    messagge: 'Login Exitoso...!',
                    user: req.session.user
                })
            }
        });
    } catch (e) {
        res.status(500).send({
            status: '500',
            message: 'Error: ' + e
        });
    };
});


//Registro de Usuario
router.post('/signup', async (req, res) => {
    let user = req.body

    const existing = await userManager.getByEmail(user.email)

    if (existing) {
        return res.status(500).send({
            status: '500',
            message: 'El Usuario ya Existe...'
        });
    }
    // crear al usuario
    try {
        const newUser = await userManager.create(user)

        res.status(200).send({
            status: '200',
            message: 'El Usuario se Registro Exitosamente...!',
            user: req.session.user
        });

    } catch (e) {
        return res.status(500).send({
            status: '500',
            message: 'Error: ' + e
        });
    }
})


module.exports = router;
