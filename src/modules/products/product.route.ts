import { Router }  from 'express';
import { authMiddleware } from '../../middleware/auth';
import { adminMiddleware } from '../../middleware/admin';
import { upload } from '../../config/cloudinary';
import { validate } from '../../middleware/validate';
import { createProductSchema } from './product.schema';
import { createProductHandler, listProductsHandler } from './product.controller';






const router = Router();

router.post('/', authMiddleware, adminMiddleware, upload.single('image'), validate(createProductSchema), createProductHandler);
router.get('/', listProductsHandler);

export default router;