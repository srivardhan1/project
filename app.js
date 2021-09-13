var express = require('express');
var app = express();
var MongoStore = require('connect-mongo');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var dbconnect = require('./backend/lib/connectLib');
var config = require('./backend/config/config');
var user=require('./backend/models/registrationModel');
const formatMessage=require('./public/utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./public/utils/users');
//require('./backend/lib/dbUsersBootstrap').createUsers();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userLib=require('./backend/lib/userLib');

const mongoose=require('mongoose');
mongoose.set('useFindAndModify', false);

var multer=require('multer');
const fs=require('fs');
const http=require('http');
const socketio=require('socket.io');
//const bodyParser = require('body-parser');
const server=http.createServer(app);
const io= socketio(server);
const botName='Chat Bot';
io.on('connection',socket=>{

    socket.on('joinRoom',({username,room})=>{
        console.log("room");
       const user=userJoin(socket.id,username,room);
       socket.join(user.room);

        socket.emit('message',formatMessage(botName,'welcome to chat'));
        socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`)); 
io.to(user.room).emit('roomUsers',{
    room:user.room,
    users:getRoomUsers(user.room)
});
    
});  

    socket.on('chatMessage',(msg)=>{
        //const user=userJoin(socket.id,username,room);
        const user=getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });
    socket.on('disconnect',()=>{
const user=userLeave(socket.id);

if(user){
    io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
}
    });
});



dbconnect.connect();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login',function(req,res){
    htmlBase=__dirname+'/public/index.html';
    res.sendFile(htmlBase);
})

  app.get("/api/search:user",function(req,res){
      var user=req.params.user;
      //console.log(user);
    userLib.search(user,function(resultJson){
        res.json(resultJson);
       })
  })
app.use(session({
    secret: "goutham",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_CONNECT_STRING})

}))
  const isAuth=(req,res,next)=>{
      if(req.session.isAuth){
          next()
      }else{
          res.redirect('/index');
      }
  }

  app.post('/api/login', function(req, res) {
    user.find(req.body, function(err, data) {
        var response = {success: false, message: 'Login Failed', user: null };
        if (err) { res.status(400).json({ msg: "Failed" }); } else if (data.length == 1) {
            //req.session.user=data
            req.session.userid = data[0]._id
            req.session.username = data[0].username
            console.log(req.session)
            response.success = true;
        response.message = 'Login Successful';
        response.user = {username: req.session.username};
        //req.session.isAuth=true;
        //console.log(response);
            res.json(response);
        } else {

            res.redirect("/login");

        }
    });
})
app.get("/api/loggedout", function(req,res){
    
    req.session.destroy(err => {
        if (err)
            return res.status(404).json({
                err: "error"
            })
    })

    return res.status(200).json({
        message: "succcessfully signout"
    })

})
var isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userid)
        next();
    else
        return res.redirect("/login");
}
var isNotAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.userid)
        next();
    else
        return res.redirect("/");
}
app.get("/", isAuthenticated, (req, res) => {
    res.sendFile(__dirname + "/public/sample.html")
})

app.get("/api/logout", isAuthenticated, (req, res) => {
    req.session.destroy(err => {
        if (err)
            return res.status(404).json({
                err: "error"
            })
    })

    return res.status(200).json({
        message: "succcessfully signout"
    })

})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/check',function(req,res){
    path=__dirname+'/public/sample.html';
    res.sendFile(path);
})
app.get('/register',function(req,res){
    path=__dirname+'/public/registration.html';
    res.sendFile(path);
})
app.get('/test',function(req,res){
    path=__dirname+'/public/test.html';
    res.sendFile(path);
})

app.get('/searchbox',function(req,res){
    path=__dirname+'/public/searchbox.html';
    res.sendFile(path);
})
app.get('/slide',function(req,res){
    path=__dirname+'/public/slide.html';
    res.sendFile(path);
})
app.get('/image',function(req,res){
    path=__dirname+'/public/image.html';
    res.sendFile(path);
})
app.get('/userdetails',function(req,res){
    path=__dirname+'/public/userdetails.html';
    res.sendFile(path);
})
app.get('/boots',function(req,res){
    path=__dirname+'/public/boots.html';
    res.sendFile(path);
})
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
  });

/*var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads');
    },
    filename:function(req,file,cb){
                cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

var upload=multer({
    storage:storage
})

app.post("/uploadphoto",upload.single('myImage'),(req,res)=>{
    console.log("hello");
    var img=fs.readFileSync(req.file.path);
    var encode_image=img.toString('base64');
    var finalImg={
        contentType:req.file.mimetype,
        path:req.file.path,
        image:new Buffer(encode_image,'base64')
    };

    dbconnect.collections('courses').insertOne(finalImg,(err,result)=>{
        console.log(result);

        if(err) return console.log(err);

        console.log("saved to db");
        res.contentType(finalImg.contentType);
        res.send(finalImg.image);
    })
})*/
  
module.exports = app;
