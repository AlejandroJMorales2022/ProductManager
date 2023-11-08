const userManager = require('../dao/managers/users/user.manager');
/* const { getCurrentUser } = require('../controllers/sessions.controller'); */


const createUser = async (req, res) => {
  const { body } = req;

  const created = await userManager.create(body);

  res.send(created);
};

const changeUserRole = async (req, res) => {
  const { uid } = req.params;
  try {
    const resp = await userManager.getById(uid)
    if (resp.role === "Usuario") {
      //Modificar el rol a "Premium"
      await userManager.update(uid, { role: "Premium" });
      res.status(200).send({
        estatus: 200,
        msg: 'Role modificado de Usuario a Premium'
      });
    } else if (resp.role === "Premium") {
      //modificar el role a "User"
      await userManager.update(uid, { role: "Usuario" });
      res.status(200).send({
        estatus: 200,
        msg: 'Role modificado de Premium a Usuario'
      })
    } else {
      //no modificar role 
      res.status(403).send({
        estatus: 403,
        msg: `Role No modificado, el rol actual es ${resp.role}`
      })
    }
  } catch (error) {
    res.status(500).send({
      estatus: 500,
      msg: 'Role No Modificado',
      error: error
    })
  }



}

module.exports = {
  createUser,
  changeUserRole
}