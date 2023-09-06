const { Router } = require('express')
const passport = require('passport')

const userManager = require('../../dao/managers/users/user.manager')
const { generateToken } = require('../../utils/jwt.utils')
const { isValidPassword } = require('../../utils/password.utils')
const gitHubHandler = require('../../config/passport.github')

const router = Router()

// este manejador es ejecutado cuando el user le da click a iniciar session con github
// passport ejecutara el login con la app de github y esta se abrira para que el usuario
// pueda meter sus datos y loguearse
router.get('/github', passport.authenticate(gitHubHandler, { scope: ['user:email'] }), (req, res) => { });


// una vez que el usuario se logueo en github
// es redirigido a nuestro callback para poder guardar la session
router.get('/githubcallback',
    passport.authenticate(gitHubHandler, { failureRedirect: '/login' }),
    async (req, res) => {
        // se guarda la session del usuario
        const { email } = req.user;

        req.session.save((err) => {
            if (!err) {
                // Almacenar la propiedad role en la sesión
                req.session.role = (email === 'adminCoder@coder.com') ? 'Administrador' : 'Usuario';
                return res.redirect('/');
            }
            console.log(err)
            res.redirect('/login');
        });
    });




module.exports = router