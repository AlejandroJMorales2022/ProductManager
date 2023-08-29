const { Router } = require("express");
const userManager = require('../../dao/managers/users/user.manager');
const { hashPassword, isValidPassword } = require("../../utils/password.utils");
const passport = require('passport');


const router = Router()


//Login de Usuario

router.post('/signup', (req, res, next) => {
  passport.authenticate('local-signup', (err, user, info) => {
    if (err) {
      // Manejo de error
      return res.render('signup', {
        status: '500',
        error: 'Error en el Servidor...',
        style: 'style',
      });
    }

    if (!user) {
      // Manejo de fallo de registro
      return res.render('signup', {
        status: '401',
        error: 'El Usuario ya Existe...',
        style: 'style',
      });
    }

    // Autenticación exitosa (registro exitoso)
    /* req.logIn(user, (err) => {
      if (err) {
        // Manejo de error de inicio de sesión
        return res.render('signup', {
          status: '500',
          error: 'Error en el Servidor...',
          style: 'style',
        });
      }
      // Almacenar la propiedad role en la sesión (si es necesario)
      // No siempre es necesario almacenar la propiedad role en el registro

      // Redirección después de un registro exitoso
      res.redirect('/login');
    }); */
    res.redirect('/login');
  })(req, res, next);
});


router.post('/login', (req, res, next) => {

  passport.authenticate('local-login', (err, user, info) => {

    console.log('PASSPORT.AUTHENTICATE USER: ' + JSON.stringify(user, null, 2))
    if (err) {
      // Manejo de error
      res.render('login', {
        status: '500',
        error: 'Error en el Servidor...',
        login: false,
        style: 'style',
      });
    }

    if (!user) {
      return res.render('login', {
        status: '401',
        error: 'Usuario o Contraseña Invalidos...',
        login: false,
        style: 'style',
      });

    }

    // Verificar el password para asignar el rol
    const { password, email } = req.body;

    // Autenticación exitosa
    req.logIn(user, (err) => {
      console.log('LOGIN USER: ' + JSON.stringify(user, null, 2))
      if (err) {
        // Manejo de error de inicio de sesión
        return res.render('login', {
          status: '500',
          error: 'Error en el Servidor...',
          login: false,
          style: 'style',
        });
      }
      // Almacenar la propiedad role en la sesión
      req.session.role = (email === 'adminCoder@coder.com') ? 'Administrador' : 'Usuario';
      // Redirección después de un inicio de sesión exitoso
      res.redirect('/');
    });
    
  })(req, res, next);
});




module.exports = router;
