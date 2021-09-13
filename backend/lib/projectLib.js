var projectModel=require('../models/projectModel');
var postModel=require('../models/postsModel');

module.exports.addNewProject = function(data,cb){
	var newProjectJson = {
		title: data.title, 
		requirement:  data.requirement,
		postedBy: data.userid
	};
	var resultObj = {result:true, message:'success'};
	var project = new projectModel(newProjectJson);
	project.save(function(err, savedProject){
		if(err){
			resultObj.result= false;
			resultObj.message = "Some error occured";
		}
		return cb(resultObj);
	});
}

// /api/projects
module.exports.getProjectsPostedByUser = function(data,cb){
    //console.log("hello");
	var resultObj = {result:true, message:'success', projects:[]};
	if(data.userid){
        console.log("hello");
		var query = {};
		projectModel.find(query, function(err, projectArray){
			if(err){
				resultObj.result= false;
				resultObj.message = "Some error occured";
			}
			else{
				resultObj.projects = projectArray;
			}
            //console.log(resultObj);
			return cb(resultObj);
		})
	}
	else{
        //console.log("hello");
		resultObj.result= false;
		resultObj.message = "You need to be logged in first";
		//return cb(resultObj);
	}
}
module.exports.getpostsPostedByUser = function(data1,cb){
    //console.log("hello");
	var resultObj = {result:true, message:'success', posts:[]};
	if(data1.userid){
        console.log("hello");
		var query = {};
		postModel.find(query, function(err, postsArray){
			if(err){
				resultObj.result= false;
				resultObj.message = "Some error occured";
			}
			else{
				resultObj.posts = postsArray;
			}
            console.log(resultObj);
			return cb(resultObj);
		})
	}
	else{
        //console.log("hello");
		resultObj.result= false;
		resultObj.message = "You need to be logged in first";
		//return cb(resultObj);
	}
}