const express = require("express");
const bodyParser =  require("body-parser");
const request = require("request");
const https = require("https")

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use("/public",express.static(__dirname+"/public"))

app.get("/",function (req,res ){
  res.sendFile(__dirname + "/signup.html")
})

app.post("/",function(req,res){

  var firstName = req.body.fname;
  var lastName = req.body.lname;
  var cEmail = req.body.email;

  const data = {
    members: [
      {
        email_address: cEmail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/45fda89e79";

  const options = {
    method: "POST",
    auth: "abd_b6488:bd09353c3d8b120c976c47699cfd26a9-us14"
  }

  const request = https.request(url,options, function(response){

    if (response.statusCode == 200){
      res.sendFile(__dirname + "/success.html")
    } else{
      res.sendFile(__dirname + "/failure.html")
    }
      response.on("data",function(data){
        console.log(JSON.parse(data));
      })
  })

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 2000, function(){
  console.log("server hosted on port 2000");
})



// API key
// bd09353c3d8b120c976c47699cfd26a9-us14

// list id
// 45fda89e79
