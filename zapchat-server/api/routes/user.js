const express = require('express');
const router = express.Router();

const APP = require('../../firebase_configuration.js');
const db = APP.registerApplication().database();

//api to show all user details
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'user details fetched'
    })
});


//api for sign up
router.post('/', (req, res, next) => {
    let ref = db.ref("chat/");

    UserExist(ref, req, res, next,  function (data) {
        if(!data){
            let newRef = db.ref("chat/" + req.body.phoneNumber + "/");
            CreateUser(newRef, req, res, next,  function (data) {
                res.status(200).json({
                    firstName:"",
                    lastName: "",
                    email:"",
                    phoneNumber:req.body.phoneNumber,
                    password: "",
                    passwordRepeat:"",                    
                    isUserExist: false
                }).end();
            });
        }
        else
        {
            res.status(409).json({
                    firstName:"",
                    lastName: "",
                    email:"",
                    phoneNumber:req.body.phoneNumber,
                    password: "",
                    passwordRepeat:"",                    
                    isUserExist: true
            }).end();
        }

    });

});


//api for login
router.post('/login/', (req, res, next) => {
    var ref = db.ref("chat/");
    AuthenticateUser(ref, req, res, next,  function (data) {
        if(data){
            res.status(200).json({
                phoneNumber: "",
                isValid: true,
                password: ""
            }).end();
            
        }
        else
        {
            if(!res.headersSent){
                res.status(401).json({
                    message: 'Invalid login credentials'
                }).end();
            }
        }

    });
});


//api to send message
router.post('/sendMessage/', (req, res, next) => {
    let ref = db.ref("chat/");
    SendMessage(ref, req.body.senderNumber,req.body.receiverNumber,req.body.message, res, next, 'sent', function (data) {
        let newReceiver = req.body.senderNumber;
        let newSender = req.body.receiverNumber;
        let message = req.body.message
        req.body.receiverNumber = newReceiver;
        req.body.senderNumber = newSender;
        
        SendMessage(ref,newSender, newReceiver, message, res, next, 'received',  function (data) {
            if(data){
                res.status(200).json({
                    message: message,
                    senderNumber: req.body.newSender,
                    receiverNumber: req.body.newReceiver
                }).end();
                
            }
            else
            {
                res.status(500).json({
                    message: 'Message not sent'
                }).end();
            }
        });

    });
});

// Function to send message 
function SendMessage(ref, senderNumber,receiverNumber,message , res, next, messageType,callback) {
    ref.once("value", function (snap) {
        snap.forEach(function (data) {
            if (data.key == senderNumber) {
                let newRef = db.ref("chat/" + senderNumber + "/contactList/");
                newRef.once("value", function (snap) {
                    snap.forEach(function (data){
                        if (data.key == receiverNumber){
                            let msgRef = db.ref("chat/" + senderNumber + "/contactList/"+ receiverNumber + "/chats/");
                            msgRef.push().set({
                                message: message,
                                type: messageType
                            });
                        }
                    });
                });
                //callback(true);
            }
        });
        //callback(false);
    });
    callback(true);
};


// Function to validate user 
function AuthenticateUser(ref, req, res, next,callback) {
    ref.once("value", function (snap) {
        snap.forEach(function (data) {
            if (data.key == req.body.phoneNumber && data.child("password").val() == req.body.password) {
               callback(true);
            }
        });
        callback(false);
    });
};

// Function to check for existing user 
function UserExist(ref, req, res, next,callback) {
    let isUserExist = false;
    ref.once("value", function (snap) {
       
        snap.forEach(function (number) {
            if (number.key == req.body.phoneNumber) {
                isUserExist = true;
            }
        });
    }).then(function(){
        callback(isUserExist);
     });
};

// Function to create user 
function CreateUser(ref, req, res, next,callback) {
   ref.set({
        name: req.body.firstName,
        password: req.body.password
    }).then( function(){
        callback(true);
    });
};

module.exports = router;