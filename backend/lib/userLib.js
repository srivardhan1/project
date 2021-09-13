var userModel=require('../models/registrationModel');
const multer= require('multer');
const fs =require('fs');
var userObject = {
    saveUserInLocalStorage : function(userJson){
        window.localStorage.setItem('currentUser', JSON.stringify(userJson));
    },
    removeCurrentUser: function(){
        window.localStorage.removeItem('currentUser');
    },
    getCurrentUser : function(){
        return window.localStorage.getItem('currentUser');
    },
    getCurrentUserName : function(){
        var curUserString = this.getCurrentUser();
        if(curUserString){
            var json = JSON.parse(curUserString);
            if(json && json.username)
                return json.username;
            return "";
        }
        return "";
    },
    isUserLoggedIn : function(){
        if(this.getCurrentUser()==null)
            return false;
        return true;
    }
};
module.exports.isUserValid=function(userJson,cb){
    var query = {username: userJson.username, password:userJson.password, isDeleted:{$ne : true}};

    userModel.find(query, function(err, collections){
        var response = {success: false, message: 'Login Failed', user: null };
        if(err){
            response.message = 'Server Side Error Occured, Try again after some time';
            return cb(response);
        }
        if(collections.length==0){
            response.message = 'Invalid username/password';
            return cb(response);
        }
        response.success = true;
        response.message = 'Login SuccessFul';
        response.user = {username: collections[0].username,phonenumber: collections[0].phonenumber,date:collections[0].date,email:collections[0].email};
        cb(response);
    })
}
module.exports.mailCheck=function(userJson,cb){
    var query = {email: userJson.email};

    userModel.find(query, function(err, collections){
        var response = {success: false, message: 'Registration Successful', user: null };
        if(err){
            response.message = 'Server Side Error Occured, Try again after some time';
            return cb(response);
        }
        if(collections.length==0){
            response.message = 'Registration Successful';
            return cb(response);
        }
        response.success = true;
        response.message = 'Email Id already registered';
        cb(response);
    })
}
module.exports.search=function(userJson,cb){
    var query = {username: userJson};

    userModel.find(query, function(err, collections){
        var response = {success: false, message: 'Login Failed', user: null };
        if(err){
            response.message = 'Server Side Error Occured, Try again after some time';
            return cb(response);
        }
        if(collections.length==0){
            response.message = 'Invalid username/password';
            return cb(response);
        }
        response.success = true;
        response.message = 'Login SuccessFul';
        response.user = {username: collections[0].username};
        cb(response);
    })
}
module.exports.searchdetails=function(cb){
    var query = {};
     console.log("entered");
    userModel.find(query, function(err, collections){
        var response = {success: false ,users:null};
        if(err){
            return cb(response);
        }
        if(collections.length==0){
            return cb(response);
        }
        //console.log(collections.username);
        response.success = true;
        response.users=collections;
        console.log(response);
        cb(response);
    })
}
module.exports.getdata=function(data,cb){
    var query = {username:data};
     console.log("entered");
    userModel.find(query, function(err, collections){
        var response = {success: false ,user:null};
        if(err){
            return cb(response);
        }
        if(collections.length==0){
            return cb(response);
        }
        //console.log(collections.username);
        response.success = true;
        response.user=collections[0];
        cb(response);
    })
}
module.exports.getall = function(req,res)
{
var query = {};
userModel.find(query, function(err, obj){
if(err)
console.log("ERROR: "+err);
res.send(obj);
});
}

module.exports.update = function(req,res)
{
   // console.log(req);
   var response = {success: false, message: 'Login Failed', user: null };
   var user=req.params.oldusername;
   //console.log(JSON.stringify(user));
   //var username=req.body.username;
    var obj = userModel.find({username: user},function(err,obj){
        console.log(user);
        const query = { username: user };
        console.log((req.body.date))
   //Model.findOneAndUpdate(query, { name: 'jason bourne' }, options, callback)
    userModel.findOneAndUpdate(query, {username:(req.body.username),date: (req.body.date),email: (req.body.email),phonenumber:(req.body.phonenumber),profilePicUrl:(req.body.profilePicUrl)},
     function (err, docs) {
    if (err){
console.log(err)
}
else{

    response.success = true;
console.log("Updated User : ", docs);
}
});
    })
}



module.exports.upload=function(req,res,next){
    const file=req.file;
    var name=userObject.getCurrentUserName;
    console.log(name);
    //console.log(file);
    if (!file){
        const error =new Error('please chosse files');
        error.httpStatusCode=400;
        return next(error)
    }
    let img=fs.readFileSync(file.path);
    let encoded_img=img.toString('base64');
    let filename1 = file.originalname;
    let contenttype = file.mimetype;
    let immageb4= encoded_img;

    var obj = userModel.find({username: name},function(err,obj){
        // console.log(obj);
        // console.log(username);
    userModel.findByIdAndUpdate(obj[0]._id, {filename:filename1,contentType:contenttype,image:immageb4},
     function (err, docs) {
    if (err){
console.log(err)
}
else{
// console.log("Updated User : ", docs);
}
});
res.json(file);
    })

};

module.exports.postdata=function(cb){
    var query = {};
     console.log("entered");
    userModel.find(query, function(err, collections){
        var response = {success: false ,users:null};
        if(err){
            return cb(response);
        }
        if(collections.length==0){
            return cb(response);
        }
        //console.log(collections.username);
        response.success = true;
        response.users=collections;
        console.log(response);
        cb(response);
    })
}


module.exports.getuserdetails=function(id,cb){
     console.log("entered");
    userModel.findById(id, function(err, collections){
        var response = {success: false ,users:null};
        if(err){
            return cb(response);
        }
        if(collections.length==0){
            return cb(response);
        }
        //console.log(collections.username);
        response.success = true;
        response.users=collections;
        //console.log(response);
        cb(response);
    })
}


module.exports.getDevCount=function(cb){
    var query = {role:'Developer'};
    //console.log(query);
     console.log("entered");
    userModel.find(query, function(err, collections){
        var response = {success: false ,count:null};
        if(err){
            return cb(response);
        }
        if(collections.length==0){
            console.log(response);
            return cb(response);
        }
        //console.log(collections.username);
        response.success = true;
        response.count=collections.length;
        console.log(response);
        cb(response);
    })
}

module.exports.getClientCount=function(cb){
    var query = {role:'Client'};
    //console.log(query);
     console.log("entered");
    userModel.find(query, function(err, collections){
        var response = {success: false ,count:null};
        if(err){
            return cb(response);
        }
        if(collections.length==0){
            console.log(response);
            return cb(response);
        }
        //console.log(collections.username);
        response.success = true;
        response.count=collections.length;
        console.log(response);
        cb(response);
    })
}