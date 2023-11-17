const multer = require('multer');
const path = require('path');
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

const uploadUserDocuments = async (req, res) => {
  const { uid } = req.params;
  console.log('USUARIO ******* '+uid)

  try {
    const { body, files } = req;
    console.log('TIPO DE ARCHIVO   ' + JSON.stringify(files.length, null, 2));
    let docsUser =[];
    //buscar si el usuario existe en la base de datos
    let user = await userManager.getById(uid);
    if (!user) {
      res.status(404).send({
        status: 404,
        message: `El Usuario con id ${uid} NO Existe...`
      })
      return;
    }

    for (const elemento of files) {
      if (elemento.originalname.split('.')[1] === 'pdf' || elemento.originalname.split('.')[1] === 'doc') {
          docsUser.push({name: elemento.originalname, reference: `/uploads/documents/${uid}-${elemento.originalname}`})
      }
      console.log(`/uploads/documents/${uid}-${elemento.originalname}`);
    }
    let newDocsUser =[]
    if(user.documents){
       newDocsUser =[...user.documents, ...docsUser]
    }else { 
      newDocsUser =docsUser
    }
    console.log('DOCUMENTOS A ACTUALIZAR ********* '+newDocsUser);
    /* let newDocsUser =[...user.documents, ...docsUser] */
    //guardar en el modelo de usuario los documentos
    let newUser = {...user, documents: newDocsUser}

      /* console.log('NUEVO USUARIO' + JSON.stringify(newUser,null,2)) */
    const updatedUser = await userManager.update(uid,newUser)

      res.send({
        status: 200,
        payload: body,
        documents: files //documents array de documentos. Cada objeto del array tiene en originalname
      })

    } catch (error) {
      res.send({
        status: 500,
        payload: error
      })
    }
  }





module.exports = {
    createUser,
    changeUserRole,
    uploadUserDocuments
  }