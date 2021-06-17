var userModel = require('../models/userModel');

module.exports.createUsers = function(){
    
    userModel.find({}, function(err, collection){
        // Create only if no users are there db
        if(collection.length==0){
            var userJson = {username : 'user', role: 'user', password:'user', email: 'user@gmail.com'};
            var adminJson = {username : 'admin', role: 'admin', password:'admin', email: 'admin@gmail.com'};
            userModel.create(userJson);
            userModel.create(adminJson);
            console.log("Users Created");
        }
        else{
            console.log("Users Already Exist");
        }
    })
}