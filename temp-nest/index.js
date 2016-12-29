var https = require('https');
var querystring = require('querystring');

var email = 'mail@emgeebee.com'; //what you use to login to nest
var password = 'xOmR$6nP7uW2a7R' ////what you use to login to nest

function doGet(login_auth) {
// you only need to modify the next four lines of this code then publish web app

/*  to publish web app just:
  1) Make sure the four variables are set above before you publish
  2) Click Publish --> Deploy as web app
  3) Describe the web app and save a new version
  4) Execute the app as: me (your google account)
  5) Who has access to the app: Anyone, even anonymous (this what allows the timebased() triggers to run as expected)
  6) Click Deploy
  7) Set your timebased() trigger to run getData() which just does a url fetch of this script and invokes doGet()
*/

  // var login_auth = performLogin(email,password);

  var headers = {
    "Authorization": 'Basic '+login_auth['access_token'],
    "X-nl-user-id": login_auth['userid'],
    "X-nl-protocol-version": '1',
    'Accept-Language': 'en-us',
    'Connection': 'keep-alive',
    'Accept': '*/*'
  };

  var options = {
    "headers" : headers,
    "hostname": login_auth['urls']['transport_url'].replace("https://", ""),
    "path": "/v2/mobile/user."+login_auth['userid']
  };
console.log(options);
  var request= https.get(options, (res) => {
    res.setEncoding('utf8');
    let response = "";
    res.on('data', (chunk) => {
        response += chunk;
    });

    res.on('end', () => {
        console.log('a', response);
        var result=JSON.parse(response);

        var structure_id = result['user'][login_auth['userid']]['structures'][0].split('.')[1]
        var device_id    = result['structure'][structure_id]['devices'][0].split('.')[1]

        var current_temp = result["shared"][device_id]["current_temperature"];
        var target_temp  = result["shared"][device_id]["target_temperature"];
        var humidity     = result["device"][device_id]["current_humidity"]/100;
        var auto_away    = result["shared"][device_id]["auto_away"];
        var heater_state = result["shared"][device_id]["hvac_heater_state"];
        var time = new Date();

        console.log([ time, current_temp, target_temp, humidity, heater_state, auto_away ]);
     })
  })
}

function performLogin(email, password) {
  let payload = {
    "username" : email,
    "password" : password
  };

  let options = {
    "hostname": "home.nest.com",
    "method": "POST",
    "path": "/user/login",
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded"
    }
  };

  let post_req = https.request(options, (res) => {

    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(chunk);
        if (res.statusCode !== 200) {
            throw "Invalid login credentials";
        }
        doGet(JSON.parse(chunk));
    })
  });

  console.log(querystring.stringify(payload));
  post_req.write(querystring.stringify(payload));
  post_req.end();
}

performLogin(email, password);
