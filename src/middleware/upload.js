// middlewares/upload.js
import multer from 'multer';
import path from 'path';
import { __dirname } from '../utils.js';

// Configuración de Multer para imágenes de perfil
const storageProfiles = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/uploads/profiles')); 
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Configuración de Multer para otros documentos
const storageDocuments = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/uploads/documents'));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

export const uploadProfile = multer({ storage: storageProfiles });
export const uploadDocument = multer({ storage: storageDocuments });
