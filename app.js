const express = require('express');
const app = express();
const https = require('https');
//setting up the bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

//setting up a server which listens form https requests on localhost on port 3000
app.listen(3000, function() {
  console.log("server is running on port 3000.");
});

//sending html file after getting det request to the brower
app.get("/", function(req, res) {
  res.sendFile(__dirname +"/index.html");
});

//fetching weather data form the API and posting
app.post("/",function(req,res){
  const query=req.body.cityName;
  const apid="bcfb65aefcb4c9ce390f5e8fd53b8f9f";
  const units="metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+query +"&appid="+apid +"&units="+units+"";

  https.get(url, function(response){
    if(response.statusCode==404){
      res.send("The name of the city is incorrect or city doesnot exsist");
    }
else{
    response.on("data",function (data){

      const weatherData=JSON.parse(data);
      const temp=weatherData.main.temp;
      const description=weatherData.weather[0].description;
      const icon=weatherData.weather[0].icon;

      const imageURl = "http://openweathermap.org/img/wn/"+ icon +"@2x.png";

      res.write("<p>The description of the weather is "+ description + "</p>");
      res.write("<h1>The temperature in "+query+" is "+ temp + " degrees in Celsius </h1>")
      res.write("<img src="+ imageURl +">");
      res.send();
    })
  }
  })
})
