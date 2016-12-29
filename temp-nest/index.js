var https = require('https');
var querystring = require('querystring');


function Nest() {
    this.email = 'mail@emgeebee.com'; //what you use to login to nest
    this.password = 'xOmR$6nP7uW2a7R'; ////what you use to login to nest

    this.current_temp = 0;
    this.target_temp = 0;
    this.humidity = 0;
    this.auto_away = 0;
    this.heater_state = 0;

    this.performLogin();
}

Nest.prototype = {
    doGet: function(login_auth) {
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
            "X-nl-protocol-version": "1",
            "Accept-Language": "en-us",
            "Connection": "keep-alive",
            "Accept": "*/*"
        };

        var options = {
            "headers" : headers,
            "hostname": login_auth['urls']['transport_url'].replace("https://", ""),
            "path": "/v2/mobile/user."+login_auth['userid']
        };

        var request= https.get(options, (res) => {
            res.setEncoding('utf8');
            let response = "";
            res.on('data', (chunk) => {
                response += chunk;
            });

            res.on('end', () => {
                var result=JSON.parse(response);

                var structure_id = result['user'][login_auth['userid']]['structures'][0].split('.')[1];
                var device_id    = result['structure'][structure_id]['devices'][0].split('.')[1];

                this.current_temp = result["shared"][device_id]["current_temperature"];
                this.target_temp  = result["shared"][device_id]["target_temperature"];
                this.humidity     = result["device"][device_id]["current_humidity"]/100;
                this.auto_away    = result["shared"][device_id]["auto_away"];
                this.heater_state = result["shared"][device_id]["hvac_heater_state"];

                console.log([ this.current_temp, this.target_temp, this.humidity, this.heater_state, this.auto_away ]);
            })
        })
    },

    performLogin: function() {
        let payload = {
            "username" : this.email,
            "password" : this.password
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
                if (res.statusCode !== 200) {
                    throw "Invalid login credentials";
                }
                this.doGet(JSON.parse(chunk));
            })
        });

        post_req.write(querystring.stringify(payload));
        post_req.end();
    },

    getData: function() {
        return [ this.current_temp, this.target_temp, this.humidity, this.heater_state, this.auto_away ];
    }
}

let nest = new Nest();
module.exports = nest.getData();
