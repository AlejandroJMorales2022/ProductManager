const { Router } = require('express');
const controller = require('../../controllers/users.controler');

const router = Router();

router.post('/', controller.createUser);

router.put('/premium/:uid', controller.changeUserRole);

module.exports = router
