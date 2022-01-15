const router = require('express').Router();
const { check } = require('express-validator');

const authController = require('../controllers/authController');
const validateData = require('../middlewares/validateData');
const { validateEmailToken } = require('../middlewares/validateToken');

//ROUTE:  login => /api/auth/login
router.post(
  '/login',
  [
    check('user', 'El usuario es obligatorio').not().isEmpty().trim().escape(),
    check('password', 'La contraseña es requerida').not().isEmpty(),
    check('password', 'La contraseña es de mínimo 8 carátecteres')
      .not()
      .isEmpty()
      .isLength({ min: 8 }),
  ],
  validateData,
  authController.loginController
);

//ROUTE: register => /api/auth/register
router.post(
  '/register',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty().trim().escape(),
    check('user', 'El nombre de usuario es obligatorio')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('email', 'El correo no es válido')
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty().trim(),
    check('password', 'Contraseña mínimo de 8 carácteres')
      .not()
      .isEmpty()
      .isLength({ min: 8 }),
    check('passwordCheck', 'La contraseña de verificación es obligatoria')
      .not()
      .isEmpty()
      .trim(),
    check('birthdate', 'Fecha de nacimiento es obligatoria')
      .not()
      .isEmpty()
      .isDate(),
  ],
  validateData,
  authController.registerController
);

// path to Confirm email when user is registered
router.get(
  '/confirm-email/:token',
  validateEmailToken,
  authController.confirmEmailController
);

//path to send email when user forgot password
router.post(
  '/forgot-password/',
  [
    check('email', 'El correo es obligatorio')
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail(),
  ],
  validateData,
  authController.forgotPassControllerPOST
);

router.get(
  '/forgot-password',
  authController.forgotPassControllerGET
  );

  router.put(
    '/forgot-password',
    [
      check('email', 'El correo no es válido')
        .not()
        .isEmpty()
        .isEmail()
        .normalizeEmail(),
      check('password', 'La contraseña es obligatoria').not().isEmpty().trim(),
      check('password', 'Contraseña mínimo de 8 carácteres')
        .not()
        .isEmpty()
        .isLength({ min: 8 }),
      check('passwordCheck', 'La contraseña de verificación es obligatoria')
        .not()
        .isEmpty()
        .trim()
        .isLength({ min: 8 }),
    ],
    validateData,
    authController.forgotPassControllerPUT
  );

module.exports = router;
