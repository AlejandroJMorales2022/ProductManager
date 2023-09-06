const { Router } = require('express')
const userManager = require('../../dao/managers/users/user.manager')

const router = Router()

router.post('/', async (req, res) => {
  const { body } =  req;

  const created = await userManager.create(body);

  res.send(created);
})

module.exports = router
