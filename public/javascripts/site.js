/*var onSignIn = function(loggedIn){
    if(loggedIn){
        console.log("Logged In");
        $("#signedIn").show();
        $("#notSignedIn").hide();
       // $("#welcomeUser").html("Welcome "+ userObject.getCurrentUser());
    }
    else{
        console.log("Not Logged In");
        $("#notSignedIn").show();
        $("#signedIn").hide();
    }
}*/

$("#lnkSignout").on('click',function(){
    $.post( "/api/logout")
    .done(function( data ) {
        //signOut();
        //console.log("signed out");
        //onSignIn(false);
        if(data.success==false){
            $("#notSignedIn").show();
            $("#signedIn").hide();
            $("#signedInchat").hide();
            $("#mailb").hide();
            $("#profileb").hide();
            $("#slide").hide();
            $("#users").hide();
            $("#signedInPost").hide();
            $("#posts").hide();
            signOut();
        }
    })
    .fail(function() {
        //alert( "error" );
    })
    .always(function() {
        //alert( "finished" );
    });
})
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
$("#search").on('click',function(e){
    e.preventDefault();
    e.stopPropagation();
    var user=$("#input-search").val();
    console.log("hi");
    $.get( "/api/search"+user)
    .done(function( data ) {
        //console.log("enter");
        //signOut();
        //console.log("signed out");
        //onSignIn(false);
        if(data.success==true){
            toastr.success( 'User Found');
        console.log(JSON.stringify(data.user.username));
        $("#name").html(JSON.stringify(data.user.username));
        }
        else{
            toastr.error( 'User Not Found');
        }
    })
    .fail(function() {
        //toastr.error( 'User Not Found');
        //alert( "error" );
    })
    .always(function() {
        //toastr.error( 'User Not Found');
        //alert( "finished" );
    });
  })
function onSignIn(googleUser) {
    //console.log("signin");
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/loggedin');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            //console.log(payload);
        console.log('Signed in as: ' + xhr.responseText);
        //console.log(xhr.responseText.given_name);
        if(xhr.responseText=='success'){
            //signOut();
            //getPayload();
            //$("#notSignedIn").show();
            $("#signedIn").show();
        $("#notSignedIn").hide();
        $("#lnkLogout").hide();
        $("#lnkSignout").show();
        $("#signedInchat").show();
        $("#mailb").show();
        $("#profileb").show();
        $("#slide").show();
        $("#users").show();
        $("#posts").show();
        $("#signedInPost").show();
            //onSignIn(true);
        }
        };
        xhr.send(JSON.stringify({token: id_token}));
}

$(document).ready(function(){ 
    
    var onSignIn = function(loggedIn){
        if(loggedIn){
            console.log("Logged In");
            $("#signedIn").show();
            $("#notSignedIn").hide();
            $("#mailb").show();
            $("#signedInchat").show();
            $("#profileb").show();
            $("#slide").show();
            $("#lnkLogout").show();
            $("#lnkSignout").hide();
            $("#users").show();
            $("#signedInPost").show();
            $("#posts").show();
            $("#welcomeUser").html("Welcome "+ userObject.getCurrentUserName());
            $("#homeuser").html("WELCOME "+ userObject.getCurrentUserName());
        }
        else{
            console.log("Not Logged In");
            $("#notSignedIn").show();
            $("#signedIn").hide();
            $("#signedInchat").hide();
            $("#mailb").hide();
            $("#profileb").hide();
            $("#slide").hide();
            $("#users").hide();
            $("#posts").hide();
            $("#signedInPost").hide();
        }
    }
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
    $("#lnkLogout").click(function(){
        // TODO:  When session is implemented, delete session on server side also
        $.ajax({
            url: "/api/loggedout",
            type: "GET",
            success: function(data) {
              
            if(data.success){
            //toastr.success( 'Updated successfully');
            }
            },
            error: function (xhr, status, error) {
            //alert(error);
            }
            });
            userObject.removeCurrentUser(); // will this update UI?
        onSignIn(false);
    })
    console.log("jquery running");
if(userObject.isUserLoggedIn()){
    onSignIn(true);
}
else{
    onSignIn(false);
}
//console.log((userObject.getCurrentUserName()));
$("#btnLogIn").on('click', function(e){
    e.preventDefault();
    e.stopPropagation(); 
    $("#lnkLogout").show();
    $("#lnkSignout").hide();
    var userObj = {username: '', password:''};
    userObj.username = $("#Username").val();
    userObj.password = $("#Password").val();
    console.log(userObj);
    $.post( "/api/login", userObj)
    .done(function( data ) {
        //var datapro=data;
        //console.log(datapro);
        //console.log(JSON.stringify(data));
        if(data.success){
            toastr.success(data.message, 'Successful');
            console.log(data.user);
            userObject.saveUserInLocalStorage(data.user);
            onSignIn(true);
        }
        else{
            toastr.error(data.message, 'Failed');
        }
    })
    .fail(function() {
        //alert( "error" );
    })
    .always(function() {
        //alert( "finished" );
    });
})
})


var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}
//console.log(datapro);