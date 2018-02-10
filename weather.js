
$(document).ready(function(){
  
   
  
  var target;
  var forecast;
  var temp;
  var posx;
  var posy;
  var result;
  var city;
  var place;
  var icon;
  
  //Variable for Weather Images
  
  var weatherImages = { 
    clearDay: "http://cdn.wallpapersafari.com/3/7/Rhf3Eb.png",
    clearNight: "https://s-media-cache-ak0.pinimg.com/originals/e8/3f/1f/e83f1f000ea89fafe6bd5e12c44af55c.jpg",
    partCloudDay: "http://www.iphonewallpapers.me/wp-content/uploads/2012/03/Cloud1.jpg",
    partCloudNight: "https://lh3.ggpht.com/k-EP8Vh9KLfeITjLKFB2DcQNSkh1FtN_6VIeyPZOlPUzG08fL23NmL4zaDpmV3FeMDg=h900",
    cloudy: "http://www.hdiphonewallpapers.us/phone-wallpapers/iphone-5-wallpapers/iphone-5-wallpapers-hd-440.jpg",
    rain:  "http:freedesignfile.com/upload/2017/05/Dark-storm-sky-with-rain-vector-background-01.jpg",
    default: "https://cdn6.f-cdn.com/contestentries/329593/14489232/569add2d8d3cb_thumb900.jpg"
    
  };
  //Hide text on page-load
  $("#City, #weather, #temperature, #tempSwitch").hide();
  
 //Geolocation Response *****************************************
  function tracked(pos){ 
    target = pos.coords;
    posx = target.latitude;
    posy = target.longitude;
    
    console.log("Latitude: "  + posx);
    console.log("Longitude: " + posy);
   
    
     //--------------GET WEATHER via Darksky API---------------
    
    $.ajax({  //------------Requesting API---------------
      
      url: "https://api.darksky.net/forecast/8a5e15f81bf02ddae1752779cc6d5b65/" + posx + ", " + posy, //API URL
      
      dataType: 'jsonp', //for HTTPS
    
      success: function(response) {
//---------Response received from API-----------------
       
        forecast = response.currently.summary;
        temp = response.currently.temperature;
        icon = response.currently.icon;
        $("#temperature").text(Math.round(temp) + "°");
        $("#weather").text(forecast);
        console.log("Temperature is " + temp + "°F."); //Temperature Test
        console.log("Forecast is " + forecast); //Forecast Test
        console.log("Your icon is " + icon);
        
        //-------Image Switch via ICON expression//
         switch(icon) {
        
      case "clear-day": 
        $("#mainBox").css("background-image","url("+ weatherImages.clearDay + ")"); //Clear Day Image
        break;
             
      case "clear-night":
             
        $("#mainBox").css("background-image","url("+ weatherImages.clearNight + ")"); //Clear Night Image
        break;   
             
      case "partly-cloudy-day":
        $("#mainBox").css("background-image","url("+ weatherImages.cloudy + ")"); //Partly cloudy day image
        break;
             
      case "partly-cloudy-night":
        $("#mainBox").css("background-image","url("+ weatherImages.partCloudNight + ")"); // Partly cloudy night image
        break;
             
      case "cloudy":
        $("#mainBox").css("background-image","url("+ weatherImages.cloudy+ ")"); //Cloudy Image
        break;
      case "rain":
        $("#mainBox").css("background-image","url("+ weatherImages.rain + ")"); //Rain Image
        break;
      default: 
        $("#mainBox").css("background-image","url("+ weatherImages.default + ")"); //Default Image
                 
             
    } //-----End of Image Switch------//
       //------Fahrenheit vs Celsius-------------
      $("#tempSwitch").on("click", function(){
        
        if($(this).hasClass("fah")){
          
        temp = Math.round((temp-32)*(5/9));
                $("#tempSwitch").removeClass("fah").addClass("cel");
        $("#cDeg").css("color","white");
        $("#fDeg").css("color","black");  
        $("#temperature").text(temp + "°");
        }
        
        else {
        temp = Math.round((temp*(9/5))+32);
        $("#tempSwitch").removeClass("cel").addClass("fah");
        $("#cDeg").css("color","black");
        $("#fDeg").css("color","white");
        $("#temperature").text(temp + "°"); 
        }
      
        
      });  
        //--------End of Fahrenheit vs Celsius-------
        
      }//---------END OF GET WEATHER--------//
      
      
    });
    
   
     //-------NEAREST CITY via GOOGLE API------------------
  
   var GEOurl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + posx + "," + posy + "&key=AIzaSyBi7nDau1xInzvKTEoT-nHD-cPz_mY1zh4";

 $.getJSON(GEOurl, function (json) {
     if (json.status == "OK") {
         //Check Result[0] / address_components
         result = json.results[0];
         //look for locality (city) tag
         
        
         for (var i = 0, aLength = result.address_components.length; i < aLength; i++) {
              place = result.address_components[i];
            if (place.types.indexOf("locality") >= 0) 
              city = place.long_name;
              
         }
         if (city != '') {
          
             $("#City").text(city);
           
         }
      
     }

 });
  
  //--------------END OF NEAREST CITY----------
    
   

    
    
  } //*********End of GEOLOCATION response************************
  
  function error(err){ //Location not received
    console.warn("ERROR (" + err.code + "): " + err.message);
  }
  
  
  
  
  
  //-----------On and Off Button
  $("#homeButton").on("click", function() {
   
    if($(this).hasClass("powerOff")) {
      //If off, then turn on on-click
       console.log("clicked");
    $("#homeButton").removeClass("powerOff");
    $("#City, #weather, #temperature, #tempSwitch").fadeIn("slow");
    //Activate Geolocation 
    navigator.geolocation.getCurrentPosition(tracked, error);
  }
       else {
       //If on, then turn off on-click
        $("#homeButton").addClass("powerOff");
        $("#mainBox").css("background", "black").css("background-size", "cover");
       $("#City, #weather, #temperature,     #tempSwitch").fadeOut("slow");
                      }               
    
  }); //----------------------------------
    
  
  
  });

 

