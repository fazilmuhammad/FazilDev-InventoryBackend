const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../config/multer');

const uploadFields = upload.fields([
  { name: 'main_image', maxCount: 1 },
  { name: 'additional_images', maxCount: 4 }
]);

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', uploadFields, productController.createProduct);
router.put('/:id', uploadFields, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/:id/stock', productController.adjustStock);

module.exports = router;
