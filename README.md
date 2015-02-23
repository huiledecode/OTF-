# otf
On The Fly Framework : OTF²

OTF² is a Node.js development Framework which aims to simplify front end application development.  It's designed over a [finite-state machine](http://en.wikipedia.org/wiki/Finite-state_machine) model.
Modules are loaded dynamically by otf.js, they are defined into a "flight plan" named "otf_default.json" for public interfaces and "otf_admin.json" for private interfaces.

Also, OTF² has some generic modules to produce specific actions : writing / reading / deleting / updating  mongoDB collection, files uploading, signup account, demo application.

# Prerequisites

You need to install Node.js, npm and mongoDB to use OTF², on Ubuntu 14.04 you just need to make :

<pre><code>$ sudo apt-get install nodejs npm mongodb</code></pre>

After mongoDB installation, you can restore the database of the demo application by opening a terminal, go into your workspace directory to get source code and type :

<pre><code>$ git clone https://github.com/huiledecode/otf.git</code></pre>

change the current directory to "otf" :

<pre><code>$ cd otf</code></pre>

And go into dump directory :

<pre><code>$ cd dump</code></pre>

Restore database MongoDB like this :

<pre><code>$ mongorestore ./otf_demo</code></pre>

# Quick Start

Open a terminal, go into directory "otf" :

<pre><code>$ cd otf</code></pre>

Get all the dependancies by npm :

<pre><code>$ npm install</code></pre>

Wait a moment for dependancies

Before launching OTF², you need to install mongoDB and start it with a ReplicatSet :
<pre><code>$ mongod --ReplSet otf_demo</code></pre>

Into mongo shell you need to configure replicatSet like this :
<pre><code>>var config = {_id: "otf_demo", members: [{_id: 0, host: "127.0.0.1:27017"}]}</code></pre>
<pre><code>>rs.initiate(config)</code></pre>

Now in the otf directory you can start the demo application :
<pre><code>$ ./start.sh</code></pre>
<pre><code>sudoer password : </code></pre>

Now you can fire up your browser and access your OTF app with the following url : 
<pre><code>http://localhost:3000</code></pre>

You can see authenticaton page of otf_demo application :

<img src="http://www.huile-de-code.fr/otf/img/capture_2015-02-2_login_OTF.png" />

You can access backend by giving the login "admin" and the password "otf" into the authentication page of the demo application. You can now see a menu bar at the top of the index page.

<img src="http://www.huile-de-code.fr/otf/img/capture_2015-02-22_index_OTF.png" />

# How to ?

You can see in demo application the menu "users" which display the list of users authorized to connect to the backend. 

<img src="http://www.huile-de-code.fr/otf/img/capture_2015-02-23_users_OTF.png" />

What happens when you click on "users" link in the top menu :

1- You sent a pathname "<b>/users</b>" from GET HTTP method<br/>
2- You request the server to read into the accounts collection of MongoDB,<br/>
3- You need to display the data into a JQuery DataTable<br/>

How can we do this into OTF² ?
Follow the rabbit ;-) :

You need to set the "<b>routes/otf/profiles/otf_admin.json</b>" file. It defines actions (pathnames) which can be used by the user account :
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

To understand the "<b>Flight Plan</b>", we need to explore all the attributes in the json file "<b>otf_admin.json</b>" :
<ul>
    <li> <b>module</b> : define the name of the module to load (i.e : "<b>finder</b>"),</li>
    <li> <b>methode</b> : define the name of the function which will be called to make the action (i.e. : "<b>list</b>"),</li>
    <li> <b>screen</b> : define the template page which will be displayed once the action is done ("i.e. : "<b>user_list</b>),</li>
    <li> <b>auth</b> : define if the action requires an authentication : (i.e. : "<b>true</b>),</li>
    <li> <b>params_names</b> : define into an array the "params" which can be used to filter the reading into MongoDB. <br>Data can be used to be inserted into a collection. The result depends on the generic component used : finder => filter / inserter => params to insert</li>
    <li> <b>datas_model</b> : define the name of the mongoose schema which map the data of MongoDB's collections.<br> You can see some examples of schema into the file named "<b>directory_schema.json</b>"   
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
* The first parameter is an Handlabars expression to get json data from the OTF² module,
* The second parameter is a String which defined the pathname of modification's action,
* The third parameter is a String which defined the pathname of delete's action, il is using the first column to get the Id of the row sent to delete.
 

(to be continued...)

# Licence

OTF² is under LGPL V3 licence, you can see the licence file into the repository