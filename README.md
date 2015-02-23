# otf
On The Fly Framework : OTF²

OTF² is a Node.js development Framework to simplify development for front-end developers.  It's constructed over a finished automate's model. Modules are loaded dynamically by otf.js module, they are defined into a "flight plan" named "otf_default.json" for public interfaces and "otf_admin.json" for private interfaces.

Also, OTF² has some generic modules which make actions :  writing, reading, deleting and updating of the  collection into a mongoDB database; files uploading, signup account, demo application.

# Prerequisites

You need to install mongoDB to use OTF², on Ubuntu 14.04 you just need to make :

<code>$ sudo apt-get install mongodb</code>

After mongoDB installation, you can restore the database of the demo application by opening a terminal, go into your workspace directory to get source code and type :

<code>$ git clone https://github.com/huiledecode/otf.git</code>

change the current directory to "otf" :

<code>$ cd otf</code>

And go into dump directory :

<code>$ cd dump</code><br />

Restore database MongoDB like this :

<code>$ mongorestore ./otf_demo</code>

# Quick Start

Open a terminal, go into directory "otf" :

<code>$ cd otf</code>

get all the dependancies by npm :

<code>$ npm install</code>

Wait a moment for dependancies

Before to start "otf2", you need to install mongoDB and start it with a ReplicatSet

<code>$ mongod --ReplSet otf_demo</code>

Into un mongo shell you need to configure replicatSet like this :

<code>>var config = {_id: "otf_demo", members: [{_id: 0, host: "127.0.0.1:27017"}]}</code><br/>
<code>>rs.initiate(config)</code>

Now in the otf directory you can start the demo application by the shell script :

<code>$ ./start.sh</code><br/>
<code>sudoer password : </code><br/>

Now you can start your browser and type this url : 
<code>http://localhost:3000</code>

You can see authenticaton page of otf_demo application :

<img src="http://www.huile-de-code.fr/otf/img/capture_2015-02-2_login_OTF.png" />

You can enter into back-office by giving the login "admin" and the password "otf" into the authentication page of the demo application. You can now see a menu bar at the top of the index page.

<img src="http://www.huile-de-code.fr/otf/img/capture_2015-02-22_index_OTF.png" />

# How to ?

You can see in demo application the menu "users" which display the list of users authorized to
connect to the back-office. 

<img src="http://www.huile-de-code.fr/otf/img/capture_2015-02-23_users_OTF.png" />

What's happen when you click on "users" link in the top menu :

1- You sent a pathname "<b>/users</b>" from GET HTTP method<br/>
2- You request the server to read into the accounts collection of MongoDB,<br/>
3- You need to display the data into a JQuery DataTable<br/>

How can we do this into OTF² ? like this :

You need to see the "<b>routes/otf/profiles/otf_admin.json</b>" file that defined actions (pathnames) which can be used by the user account :
<code><pre>(...)<br/>
   "<b>GET/users</b>": {<br/>
    &nbsp;&nbsp;"module": "<b>finder</b>",<br/>
    &nbsp;&nbsp;"methode": "<b>list</b>",<br/>
    &nbsp;&nbsp;"screen": "<b>user_list</b>",<br/>
    &nbsp;&nbsp;"auth": <b>true</b>,<br/>
    &nbsp;&nbsp;"params_names": <b>[]</b>,<br/>
    &nbsp;&nbsp;"data_model": "<b>Accounts</b>"<br/>
   },<br/>(...)
</pre></code>          

To explain the "<b>Flight Plan</b>", we need to explain all the attributes in the json file "<b>otf_admin.json</b>" :
<ul>
    <li> <b>module</b> : defined the name of the module to load (i.e : "<b>finder</b>"),</li>
    <li> <b>methode</b> : defined the name of the function will be called to make the action (i.e. : "<b>list</b>"),</li>
    <li> <b>screen</b> : defined the template page which will be displaying after the action is done ("i.e. : "<b>user_list></b>),</li>
    <li> <b>auth</b> : defined if the action requires an authentication : (i.e. : "<b>true</b>),</li>
    <li> <b>params_names</b> : defined into an array the "params" can be used to filtering the reading into the MongoDB. <br>The datas can be used to be inserted into a collection. The finality depends of the generic component used : finder => filter / inserter => params to insert</li>
    <li> <b>datas_model</b> : defined the name of the mongoose schema which mapped the datas of the MongoDB's collections. <br> You can see some examples of schema into the file named "<b>directory_schema.json</b>"   
</ul>

Extract of "<b>directory_schema.json</b>" :
<code><pre>
"<b>Accounts</b>": {<br/>
 &nbsp;&nbsp;"collection": "<b>accounts</b>",<br/>
 &nbsp;&nbsp;"schema": {<br/>
 &nbsp;&nbsp;&nbsp;&nbsp;"login": "<b>String</b>",<br/>
 &nbsp;&nbsp;&nbsp;&nbsp;"password": "<b>String</b>",<br/>
 &nbsp;&nbsp;&nbsp;&nbsp;"profile": <b>[]</b><br/>
 &nbsp;&nbsp;}<br/>
 &nbsp;&nbsp;},<br/>(...)
</pre></code>


