const express = require('express');
const Route = express.Router();
const RouteName = '/auth'
const AuthController = require('../controllers/AuthController');
const { verifyTokenWithRole , logUserActivity } = require('../middleware/verifytokenwithrole'); 
// const logUserActivity = require('../middleware/UserActivity');


Route.get(RouteName+'/',AuthController.index);
Route.post(RouteName+'/login', AuthController.login);
Route.post(RouteName+'/getToken/:username',AuthController.getToken);
Route.post(RouteName+'/checkAuthen',AuthController.checkAuthen);
Route.post(RouteName+'/RegisterUsers',AuthController.RegisterUsers);
Route.get(RouteName+'/GetUsers',verifyTokenWithRole(['superuser','superman']),logUserActivity('Read/GetUsers','GetUsers'),AuthController.GetUsers);
Route.delete(RouteName+'/DeleteUsers/:id',AuthController.DeleteUsers);
Route.put(RouteName+'/EditUsers/:id',AuthController.EditUsers);
Route.get(RouteName+'/GetRole',AuthController.GetRole);
Route.post(RouteName+'/AddRole',AuthController.AddRole);
Route.put(RouteName+'/EditRole/:id',AuthController.EditRole);
Route.delete(RouteName+'/DeleteRole/:id',AuthController.DeleteRole);

Route.get(RouteName+'/getUser',AuthController.getUser);
Route.put(RouteName+'/editUser/:id',AuthController.editUser);
Route.delete(RouteName+'/deleteUser/:id',AuthController.deleteUser);


Route.get('/protected-route', verifyTokenWithRole('superuser'), (req, res) => {
    // Access token is valid, and user data is available in req.user
    res.json({ message: 'Access granted', user: req.user });
  });



module.exports = Route
