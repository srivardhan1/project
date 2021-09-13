var express = require('express');
var router = express.Router();
var userLib=require('../backend/lib/userLib');
var user=require('../backend/models/registrationModel');
var postsModel=require('../backend/models/postsModel');
const CLIENT_ID= '445093466494-u1c7jg8178j553gv6o6ao8uohia3cja6.apps.googleusercontent.com';
const {OAuth2Client} = require('google-auth-library');
var session = require('express-session');
const client = new OAuth2Client(CLIENT_ID);
const cookieParser=require('cookie-parser');
const store=require('../multer/multer');
var projectLib=require('../backend/lib/projectLib');
const path =require('path');
const fs =require('fs');
const multer=require('multer');
router.use(cookieParser());
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/sample',checkAuthenticated,function(req,res){
  let user=req.user;
  res.render('sample',{user});
})
/*router.post('/api/login',function(req,res){
  userLib.isUserValid(req.body,function(resultJson){
      if(resultJson.success==true){
        //console.log("Session for User Initialized");
        //req.session.user = {username: resultJson.username};
        console.log("Session for User Initialized");
            console.log(resultJson);
            req.session.user = {username: resultJson.user.username};
      }
      res.json(resultJson);
     })
})*/
router.get("/api/userdetails",function(req,res){
  //console.log(user);
userLib.searchdetails(function(resultJson){
    //console.log(resultJson);
    res.json(resultJson);
   })
})
router.get("/data:user",function(req,res){
  //console.log(user);
  var dat=req.params.user;
userLib.getdata(dat,function(resultJson){
    //console.log(resultJson);
    res.json(resultJson);
   })
})
router.post('/api/loggedin',function(req,res){
  let token=req.body.token;
  console.log(token);
  async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  console.log(payload);
}
verify()
.then(()=>{
  
    res.cookie('session-token',token);
    res.send('success');
    //res.json(payload);
}).catch(console.error);
})
router.post("/regis",function(req,res){
  var username=req.body.username;
  var password=req.body.password;
  var birthday=req.body.birthday;
  var gender=req.body.gender;
  var role=req.body.role;
  //var first=req.body.username;
  var email=req.body.email;
  var phonenumber=req.body.phonenumber;
  var filename1=req.body.filename;
  var contenttype=req.body.contentType;
  var imageb4=req.body.image;
  //console.log(profilePicUrl);
  var data={
      "username":username,
      "password":password,
      "birthday":birthday,
      "gender":gender,
      "email":email,
      "phonenumber":phonenumber,
      "filename":filename1,
      "contentType":contenttype,
      "image":imageb4,
      "role":role,
      
  }
userLib.mailCheck(req.body,function(resultJson){
  if(resultJson.success==true)
  {
    res.json(resultJson);
  }
  else{
    user.insertMany(data,(err,collection)=>{
      if(err)
      {
          throw err;
      }
      console.log(data);
      res.json(data);
  });
  }
})
});
router.put("/edit:oldusername", userLib.update);
router.post('/api/logout',function(req,res){
  //console.log("hi");
  var response = {success: false, message: 'Login Failed', user: null };
  //res.clearCookie('session-token');
  res.json(response);
})
router.get('/mailbox', function(req, res) {
  // if this is a valid user having session, return his mailbox
  if(req.session && req.session.username){
      // User is authenticated and his session table has an entry, so we know his username
      // Can we get his details from db?
      // Can we make a db call using userLib or mailboxLib to get his data and return back?
      res.json({success:true, username:req.session.username});
  }
  else{
      // Redirect him to login page
      res.json({success:false, message:'Need to be logged in to get mailbox'});
  }
});
function checkAuthenticated(req,res,next){
  let token=req.cookies['session-token'];
  let user={};
  async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  
  });
  const payload = ticket.getPayload();
  user.name=payload.name;
  user.email=payload.email;
  user.picture=payload.picture;
  //console.log(payload);
}
verify()
.then(()=>{
    req.user=user;
    next();
}).catch(err=>{
    res.redirect('/login');
})
}

router.post("/uploadimage",store.single('image'), (req,res,next)=>{

  //  
      const file=req.file;
      console.log(file);
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
      //console.log(req.body.username1);
      user.findByIdAndUpdate(req.session.userid, {filename:filename1,contentType:contenttype,image:immageb4},
       function (err, docs) {
      if (err){
       console.log(err)
      }
      else{
       console.log("Updated User : ", docs);
         }
        });
  });
  /*router.get("/posts",function(req,res){
    //console.log(user);
  userLib.postdata(function(resultJson){
      //console.log(resultJson);
      res.json(resultJson);
     })
  })*/
  router.post("/uploadposts",store.single('image'), (req,res,next)=>{

    //  
        const file=req.file;
        console.log(file);
        if (!file){
            const error =new Error('please choose files');
            error.httpStatusCode=400;
            return next(error)
        }
        let img=fs.readFileSync(file.path);
        let encoded_img=img.toString('base64');
        let filename1 = file.originalname;
        let contenttype = file.mimetype;
        let immageb4= encoded_img;
        var usede= req.session.userid;
    
        var obj = new postsModel({filename:filename1,contentType:contenttype,image:immageb4,postedBy:usede});
    console.log(obj);
    obj.save(function(err){
        if(err)
        console.log("ERROR: "+err);
        else
        console.log("SAV SUCCESS "+ JSON.stringify(obj));
        })   
    
    });

    router.post("/posts",function(req,res){
      var data=req.body;
      data.userid=req.session.userid;
      console.log(data);
      projectLib.addNewProject(req.body,function(resultJson){
        res.json(resultJson);
      })
    });
    /*router.get("/getprojects",function(req,res){
      var data={};
      data.userid=req.session.userid;
      projectLib.getPostsPostedByUser(data,function(resultJson){
        res.json(resultJson);
      })
    });*/
    router.get("/getposts",function(req,res){
      var data={};
      data.userid=req.session.userid;
      projectLib.getProjectsPostedByUser(data,function(resultJson){
        res.json(resultJson);
      })
    });

    router.get("/getprojects",function(req,res){
      var data={};
      data.userid=req.session.userid;
      projectLib.getpostsPostedByUser(data,function(resultJson){
        res.json(resultJson);
      })
    });
    

    router.get("/postuserdetails:id",function(req,res){
      //console.log(user);
      var id=req.params.id;
      var obj=req.body.obj;
      console.log(obj);
    userLib.getuserdetails(id,function(resultJson){
        //console.log(resultJson);
        res.json(resultJson);
       })
    })

    router.get("/developers",function(req,res){
      userLib.getDevCount(function(resultJson){
        res.json(resultJson);
      })
    })

    router.get("/clients",function(req,res){
      userLib.getClientCount(function(resultJson){
        res.json(resultJson);
      })
    })

module.exports = router;
