# OTF²
On The Fly Framework : OTF²

OTF² is a Node.js development Framework which aims to simplify front end application development.  It's designed over a [finite-state machine](http://en.wikipedia.org/wiki/Finite-state_machine) model.
Modules are loaded dynamically by otf.js, they are defined into a "flight plan" named "otf_default.json" for public interfaces and "otf_admin.json" for private interfaces.

Also, OTF² has some generic modules to produce specific actions : writing / reading / deleting / updating  mongoDB collection, files uploading, signup account, demo application.

# Pre-requisites

You need to install Node.js, npm, mongoDB and Redis to use OTF². For example, on Ubuntu 14.04 you just need to make :

<pre><code>$ sudo apt-get install nodejs npm redis-server build-essential python2.7 nodejs-legacy</code></pre>

You need to install graphicsmagic library for images work :
 
<pre><code>$ sudo apt-get install graphicsmagick</code></pre>

And you to install mongoDB v2.6.10 :

<pre><code>$ sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10</code></pre>
<pre><code>$ echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list</code></pre>
<pre><code>$ sudo apt-get update</code></pre>
<pre><code>$ sudo apt-get install mongodb-org</code></pre>

It's possible to define the version number like below :
<pre><code>$ apt-get install mongodb-org=2.6.0 mongodb-org-server=2.6.0 mongodb-org-shell=2.6.0 mongodb-org-mongos=2.6.0 mongodb-org-tools=2.6.0</code></pre>

Create « /data/db/ » folder , on your system's root. (cd /)
In sudoer mode
<pre><code>$ sudo -s</code></pre>
<pre><code># mkdir /data</code></pre>
<pre><code># mkdir /data/db</code></pre>

After mongoDB installation, you can restore the database of the demo application by opening a terminal, go into your workspace directory to get source code and type :

<pre><code>$ git clone https://github.com/huiledecode/OTF-.git</code></pre>

Change the current directory to name "otf" :

<pre><code>$ mv OTF- otf</code></pre>
<pre><code>$ cd otf</code></pre>

You need to start mongoDB with a ReplicatSet,

1st, in a new Terminal, go to  /data/db folder
<pre><code>$ sudo mongod --replSet otf_demo</code></pre>

2sd, in a new Terminal, run mongo shell you need to configure replicatSet like this :

Open Mongo DB
<pre><code>$ mongo</code></pre>
<blockquote>MongoDB shell version: 2.4.9</blockquote>
<blockquote>connecting to: test</blockquote>
Change the db 
<pre><code>> use otf_demo</code></pre>

<pre><code>>var config = {_id: "otf_demo", members: [{_id: 0, host: "127.0.0.1:27017"}]}</code></pre>
<pre><code>>rs.initiate(config)</code></pre>
<i>You should have this result :</i>
<code>
{
	"info" : "Config now saved locally.  Should come online in about a minute.",
	"ok" : 1
}</code>

<pre><code>> exit</code></pre>

And return into dump directory (cd /workspace/otf/) :

<pre><code>$ cd dump</code></pre>

Restore database MongoDB like this :

<pre><code>$ mongorestore ./otf_demo</code></pre>
<i>You should have this result in your Terminal:</i>
<code><pre>connected to: 127.0.0.1
Mon Apr 27 10:33:17.133 ./otf_demo/logs.bson
Mon Apr 27 10:33:17.133 	going into namespace [otf_demo.logs]
262 objects found
Mon Apr 27 10:33:17.135 	Creating index: { key: { _id: 1 }, ns: "otf_demo.logs", name: "_id_" }
Mon Apr 27 10:33:17.154 ./otf_demo/users.bson
Mon Apr 27 10:33:17.154 	going into namespace [otf_demo.users]
Mon Apr 27 10:33:17.157 	Created collection otf_demo.users with options: { "create" : "users", "autoIndexId" : true, "size" : 0, "capped" : false, "max" : 0, "strict" : true }
2 objects found
Mon Apr 27 10:33:17.157 	Creating index: { key: { _id: 1 }, ns: "otf_demo.users", name: "_id_" }
Mon Apr 27 10:33:17.158 ./otf_demo/accounts.bson
Mon Apr 27 10:33:17.158 	going into namespace [otf_demo.accounts]
Mon Apr 27 10:33:17.160 	Created collection otf_demo.accounts with options: { "create" : "accounts", "autoIndexId" : true, "size" : 0, "capped" : false, "max" : 0, "strict" : true }
1 objects found
Mon Apr 27 10:33:17.160 	Creating index: { key: { _id: 1 }, ns: "otf_demo.accounts", name: "_id_" }
Mon Apr 27 10:33:17.160 ./otf_demo/accountsuuid.bson
Mon Apr 27 10:33:17.160 	going into namespace [otf_demo.accountsuuid]
Mon Apr 27 10:33:17.162 	Created collection otf_demo.accountsuuid with options: { "create" : "accountsuuid", "autoIndexId" : true, "size" : 0, "capped" : false, "max" : 0, "strict" : true }
1 objects found
Mon Apr 27 10:33:17.162 	Creating index: { key: { _id: 1 }, ns: "otf_demo.accountsuuid", name: "_id_" }
Mon Apr 27 10:33:17.163 ./otf_demo/log.bson
Mon Apr 27 10:33:17.163 	going into namespace [otf_demo.log]
40 objects found
Mon Apr 27 10:33:17.164 	Creating index: { key: { _id: 1 }, ns: "otf_demo.log", name: "_id_" }
</pre></code>

<b>Create log directory</b>
Go back to the OTF's root directory.
<pre><code>$ cd ..</code></pre>
<pre><code>$ mkdir log</code></pre>

# Quick Start

Open a terminal, Go back to the OTF's root directory. :

<pre><code>$ cd otf</code></pre>

Get all the dependancies by npm :

<pre><code>$ npm install</code></pre>

Wait a moment for dependancies

Before launching OTF²,</br>

In new Terminal, Start "redis-server" in 'sudo' mode

Go back to the OTF's root directory.
<pre><code>/otf$ sudo redis-server</code></pre>
Stand "redis-server" start into the Terminal.

Now in the otf directory you can start the demo application :
<pre><code>$ ./start.sh</code></pre>
<pre><code>sudoer password : </code></pre>

OTF² cluster is OFF by default, if you like to use cluster mode, you must change config.json into conf directory :
```js
{
    "ENV": {
        "mode": "TEST"
    },
    "WWW": {
        "port": "3000",
        "host": "0.0.0.0"
    },
    "LOGS": {
        "path": "/../../conf/log4js.json",
        "reload": "300",
        "mongodb": "localhost:27017/log",
        "level": "ERROR"
    },
    "MONGO": {
        "url": "mongodb://@127.0.0.1:27017/otf_demo",
        "options": {
            "server": {
                "poolSize": 5
            }
        }
    },
    "WEBSOCK": {
        "log": false

    },
    "SESSION": {
        "secret": "7m62cnP9rgVh7hH9NyUAdRNwTSHWDsfWFLeMMD7n4vUEuREJtyWbfzsTMFSeqzmYnng6CRd4yBYTCesJdDkNX4SjDmYWqZLcSscHw5Nh256b4wWjdjSdxr7rrsAU7RWZ",
        "cookie_name": "connect.sid",
        "ttl": "900",
        "prefix": "sess:",
        "store": "MEMORY"

    },
    "GLANCES": {
        "host": "127.0.0.1"
    },
    "CLUSTER": {
        "mode": "OFF",
        "nb_cpu": "3"
    }
}
```
Put to "ON" the mode attribute of CLUSTER entry to run OTF over multi CPU.

NB : <i>We conducted a test on a 24-cpu server, we allocated 23 CPU OTF² and we launch 10 million authentications per 5000 simultaneously. The test lasted 40 minutes, no errors and little RAM used</i>

Now you can fire up your browser and access your OTF app with the following url : 
<pre><code>http://localhost:3000</code></pre>

You can see authenticaton page of otf_demo application :

<img src="http://www.huile-de-code.fr/otf/public/img/Capture-login.png" />

You can access backend by giving the login "admin" and the password "otf" into the authentication page of the demo application. You can now see a menu bar at the top of the index page.

<img src="http://www.huile-de-code.fr/otf/public/img/Capture-back_office.png" />

# How to ?

You can see in demo application the menu "users" which displays the list of users authorized to connect to the backend. 

<img src="http://www.huile-de-code.fr/otf/public/img/Capture-list_user.png" />

What happens when you click on "users" link in the top menu :

1- You send a pathname "<b>/users</b>" from GET HTTP method<br/>
2- You request the server to read into the accounts collection of MongoDB,<br/>
3- You need to display the data into a JQuery DataTable<br/>

How can we do this into OTF² ?
Follow the rabbit ;-) :

You need to set the "<b>conf/profiles/otf_admin.json</b>" file. It defines actions (pathnames) which can be used by the user account :
```js
(...)
   "GET/users": {
        "module": "finder",
        "methode": "list",
        "screen": "user_list",
        "auth": true,
        "params_names": [],
        "data_model": "Accounts"
   },
(...)
```        
Nb : OTF² is listening the changes of conf files and charging them by the module "otf globals.js"

To understand the "<b>Flight Plan</b>", we need to explore all the attributes in the json file "<b>otf_admin.json</b>" :
<ul>
    <li> <b>module</b> : define the name of the module to load (i.e : "<b>finder</b>"),</li>
    <li> <b>methode</b> : define the name of the function which will be called to make the action (i.e. : "<b>list</b>"),</li>
    <li> <b>screen</b> : define the template page which will be displayed once the action is done ("i.e. : "<b>user_list</b>),</li>
    <li> <b>auth</b> : define if the action requires an authentication : (i.e. : "<b>true</b>),</li>
    <li> <b>params_names</b> : define into an array the "params" which can be used to filter the reading into MongoDB. <br>Data can be used to be inserted into a collection. The result depends on the generic component used : finder => filter / inserter => params to insert</li>
    <li> <b>datas_model</b> : define the name of the mongoose schema which maps the data of MongoDB's collections.<br> You can see some examples of schema into the file named "<b>directory_schema.json</b>"   
</ul>

Extract of "<b>directory_schema.json</b>" :
```js
"Accounts": {
        "collection": "accounts",
        "schema": {
                "login": "String",
                "password": "String",
                "profile": []
        }
},(...)
```

To generate a view, OTF² is using the template ["Handlebars"] (http://handlebarsjs.com/). Now we'll see the template which is displaying for the users list
when a click is happening on Users's menu :<br/>
Extract of "**views/user_list.hbs**" :
```js
{{#content "head"}}
    {{> head}}
{{/content}}
{{#content "header"}}
    {{> header}}
{{/content}}
{{#content "body"}}
<div class="container-fluid">
    <div class="row-fluid">
        <div class="col-xs-12 col-sm-12 col-md-12">
            <h3>List Users</h3>
        </div>
    </div>
    <button id="suppr" type="button" class="btn btn-primary btn-lg btn-block">Delete Row</button>
    <script>
        //<![CDATA[
        $(document).ready(function() {
            setDataTable({{{json result}}}, "/updateuser", "/deleteuser");
         });
        //]]>
    </script>
    <div class="row">
        <div class="col-lg-12">
            <div id="monitor" class="panel panel-default"></div>
        </div><!-- /.col-lg-12 -->
    </div>
</div>
    {{#content "footer"}}
        {{> footer}}
    {{/content}}
{{/content}}
```
For convenience we have implemented a javascript function to create dynamically a JQuery DataTable :

```js
setDataTable({{{json result}}}, "/updateuser", "/deleteuser");
```
* The first parameter is an Handlebars expression to get json data from the OTF² module,
* The second parameter is a String which defined the pathname of modification's action,
* The third parameter is a String which defined the pathname of delete's action, it is using the first column to get the Id of the row sent to delete.
 
# Bootstrap's Interface

OTF use bootstrap interface. The default Components are located into /public/

If you want <b>to customise the Front-End</b>, use the "custom_css" directory, and "style.css" file.

For add a new css file's link into "head" document, please use /views/partials/head.hbs file.

(to be continued...)

# Licence

OTF² is under LGPL V3 licence, you can see the licence file into the repository
