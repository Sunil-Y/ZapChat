const express = require('express');
const router = express.Router();

var user = require('../models/user.js');

const APP = require('../../firebase_configuration.js');
const db = APP.registerApplication().database();

router.get('/', (req, res, next) =>{
    res.status(200).json({
        message: 'user details fetched'
    })
});

router.post('/', (req, res, next) =>{
    let isValid = false;

    var ref = db.ref("chat/");
    ref.once("value", function(snap) {
        snap.forEach(function(data) {
            console.log("phoneNumber: " + req.body.phoneNumber);
            console.log("password: " + req.body.password);

            if(data.key == req.body.phoneNumber && data.child("password").val() == req.body.password){
                console.log(data.key);
                console.log(data.child("password").val());
                isValid = true;

                console.log(isValid);
                if(isValid){
                res.status(200).json({
                    phoneNumber: "",
                    isValid: true,
                    password:""
                });
                }
                
            }
            else
                {
                res.status(401).json({
                    message: 'Invalid login credentials'
                })
                }
        });
      });
     
});

module.exports = router;