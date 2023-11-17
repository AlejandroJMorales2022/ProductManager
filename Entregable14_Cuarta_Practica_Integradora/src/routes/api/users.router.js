const { Router } = require('express');
const controller = require('../../controllers/users.controler');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const userDocsOk = require('../../dao/managers/users/middlewares/userDocsOk.js');



const router = Router();


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Obtener el tipo de archivo del cuerpo de la solicitud
        const fileName = file.originalname.split('.')[0]
        const fileExt = file.originalname.split('.')[1]
        let fileType = ''

        if (fileExt === 'pdf' || fileExt === 'doc') {
                fileType='user_doc'
        }else if(fileExt === 'jpg' || fileExt === 'png') {
            if(fileName==='img_profile') {
                fileType='img_profile'
        }else fileType='img_product'
    }
        // Determinar la carpeta de destino según el tipo de archivo
        let destinationFolder;
        switch (fileType) {
            case 'img_profile':
                destinationFolder = 'profile';
                break;
            case 'img_product':
                destinationFolder = 'products';
                break;
            case 'user_doc':
                destinationFolder = 'documents';
                break;
            default:
                destinationFolder = ''; // Carpeta predeterminada en caso de un tipo no reconocido
        }
        cb(null, path.join(__dirname, `../../uploads/${destinationFolder}`));
    },
    filename: (req, file, cb) => {
        cb(null, `${req.params.uid}-${file.originalname}`);
    }
});

const upload = multer({ storage });


router.post('/', controller.createUser);

router.put('/premium/:uid', userDocsOk, controller.changeUserRole);


router.post('/:uid/documents', upload.array('documents', 100), controller.uploadUserDocuments);

module.exports = router
