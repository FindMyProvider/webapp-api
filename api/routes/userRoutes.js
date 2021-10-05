const express = require('express');
const router = express.Router();

//---
const userController = require('../controllers/userController');

//---get all----
router.get('/', userController.getAll);

//---get by id----
router.get('/:id', userController.getOne);
router.get('/search/:input', userController.search);
router.get('/searchParPrenom/:input', userController.searchParPrenom);


router.post('/remoteCmd', userController.remoteCmd)

//----post----
router.post('/signup', userController.newUser);
router.post('/login', userController.loginUser);
// router.post('/updatepwd', userController.upD);

//----patch-----
router.post('/:id/updateUserPassword', userController.updateUserPassword);
router.post('/:id/updateUser', userController.updateUser);


// //----delete----
// router.delete('/:id', userController.deleteUser);
// router.delete('/:id/favoris/:film', userController.deleteFavoris);
// router.delete('/:id/downloaded/:film', userController.deleteDownloaded);

module.exports = router;