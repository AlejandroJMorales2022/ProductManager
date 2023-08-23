const { Router } = require("express");
const pM = require('../dao/managers/products/Product.db.manager');
const cM = require('../dao/managers/carts/cart.db.manager');
const userManager = require('../dao/managers/users/user.manager');
const isAuth = require('../dao/managers/users/middlewares/auth.middleware');
const { Session } = require("express-session");



/* const pM = productManager; */

const router = Router();

router.get('/chat', isAuth, (req, res) => {
    res.render('chat', {
        chat: true,
        style: 'style',
        js: 'chat',
        title: 'CHAT',
        user: req.session.user ? {
            ...req.session.user,
            role: (req.session.user.email === 'adminCoder@coder.com' && req.session.user.password === 'Cod3r123') ? 'Administrador' : 'Usuario',
            isAdmin: (req.session.user.email === 'adminCoder@coder.com' && req.session.user.password === 'Cod3r123') ? true : false,
        } : null,
    });
});


router.get('/', isAuth, async (req, res) => {
    const { page, limit, query, sort } = req.query;
    const protocol = req.protocol;
    const host = req.get('host');
    try {
        const { docs: products, ...pageInfo } = await pM.getAllPaged(page, limit, query, sort);

        pageInfo.prevLink = pageInfo.hasPrevPage ? `${protocol}://${host}/?page=${pageInfo.prevPage}&limit=${!limit ? 10 : limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}` : null;
        pageInfo.nextLink = pageInfo.hasNextPage ? `${protocol}://${host}/?page=${pageInfo.nextPage}&limit=${!limit ? 10 : limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}` : null;
        pageInfo.startLink = pageInfo.totalPages >= 2 ? `${protocol}://${host}/?page=1&limit=${!limit ? 10 : limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}` : null;
        pageInfo.endLink = pageInfo.totalPages >= 2 ? `${protocol}://${host}/?page=${pageInfo.totalPages}&limit=${!limit ? 10 : limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}` : null;

        req.session.homeCount = (req.session.homeCount || 0) + 1;


        if (products) {
            res.render('home', {
                products: products,
                pageInfo,
                title: 'Listado de Productos',
                realtimeProducts: true,
                style: 'style',
                js: 'realtimeproducts',
                user: req.session.user ? {
                    ...req.session.user,
                    logged: true,
                    role: (req.session.user.email === 'adminCoder@coder.com' && req.session.user.password === 'Cod3r123') ? 'Administrador' : 'Usuario',
                    isAdmin: (req.session.user.email === 'adminCoder@coder.com' && req.session.user.password === 'Cod3r123') ? true : false,
                } : null,
            });
            /* console.log(JSON.stringify(req.session.user, null, 2)) */
        };
    } catch (e) {
        res.status(500).send({
            status: 'error',
            statusNumber: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
        console.log('Error: ' + e);
    };
});



router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        if (cid) {
            const cart = await cM.getById(cid);
            if (!cart) {
                res.status(404).send({
                    status: 'error',
                    statusNumber: 404,
                    message: `El Cart con Id:${cid} No Existe...`
                });
                console.log('El Cart no Existe...');
                return;
            }
            let products = [];
            cart.products.forEach(prod => (
                products.push({                 //cargo el array products con las propiedades y formato adecuado para renderizar en la plantilla
                    _id: prod.product._id,
                    title: prod.product.title,
                    description: prod.product.description,
                    code: prod.product.code,
                    price: prod.product.price,
                    status: prod.product.status,
                    stock: prod.product.stock,
                    category: prod.product.category,
                    thumbnails: prod.product.thumbnails,
                    quantity: prod.quantity
                })
            ));
            res.render('cartproducts', {
                products: products,
                title: 'Carrito de Compras',
                realtimeProducts: false,
                style: 'style',
                cartId: cart._id
            });
        };
    } catch (e) {
        res.status(500).send({
            status: 'error',
            statusNumber: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
        console.log('Error: ' + e);
    };
});

router.get('/profile', isAuth, (req, res) => {

    res.render('profile', {
        user: req.session.user ? {
            ...req.session.user,
            logged: true,
            role: (req.session.user.email === 'adminCoder@coder.com' && req.session.user.password === 'Cod3r123') ? 'Administrador' : 'Usuario',
            isAdmin: (req.session.user.email === 'adminCoder@coder.com' && req.session.user.password === 'Cod3r123') ? true : false,
        } : null,
        style: 'style',
    })
})

router.get('/signup', (_, res) => res.render('signup', {
    style: 'style',
    signup: true,
    js: 'signup'
}))

/* router.post('/signup', async (req, res) => {
    let user = req.body
    const existing = await userManager.getByEmail(user.email)

    if (existing) {
        return res.render('signup', {
            error: 'El email ya existe',
            style: 'style',
        })
    }
    // crear al usuario
    try {
    
        const newUser = await userManager.create(user)

        req.session.user = {
            name: newUser.firstname,
            id: newUser._id,
            ...newUser._doc
        }
        req.session.save((err) => {
            res.redirect('/')
        })

    } catch (e) {
        console.log(e)
        return res.render('signup', {
            error: 'Ocurrio un error. Intentalo mas tarde',
            style: 'style',
        })
    }
})
 */
router.get('/login', (_, res) => res.render('login', {
    login: true,
    style: 'style',
    js: 'login'
}))

/* router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userManager.getByEmail(email)
        if (!user) {
            return res.render('login', {
                error: 'El usuario no existe',
                style: 'style'
            });
        } else if (user.password !== password) {
            return res.render('login', {
                error: 'La Contraseña es Incorrecta',
                style: 'style'
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
                res.redirect('/');
            };
        });
    } catch (e) {
        res.render('login', {
            error: 'Ha ocurrido un error',
            style: 'style'
        });
    };
}); */



router.get('/logout', isAuth, (req, res) => {
    const { user } = req.cookies

    // borrar la cookie
    res.clearCookie('user');

    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/error');
        }

        res.render('logout', {
            user: req.user.name,
            logged: false,
            style: 'style'
        })

        req.user = null;
    })

    // res.render('logout', {
    //   user
    // })
});

router.get('/user-data', (req, res) => {
    if (req.session.user) {
        res.json({ usuario: req.session.user });
    } else {
        /*  res.json({ mensaje: 'Usuario no autenticado' }); */
        res.redirect('/');
    }
});

router.get('/administracion', (req, res) => {
    res.render('administracion', {
        user: {
            ...req.session.user,
            email: req.session.user.email
        },
        title: 'Pantalla de Administración',
        style: 'style'
    })
})



module.exports = router;