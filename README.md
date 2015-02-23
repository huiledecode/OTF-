# otf
On The Fly Framework : OTF²

OTF² is a Node.js development Framework to simplify development for front-end developers.  it's constructed over a finished automate's model. Modules are loaded dynamically by otf.js module, they are defined into a "flight plan" named "otf_default.json" for public interfaces and "otf_admin.json" for private interfaces.

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

You can enter into back-office by give the login "admin" and the password "otf" into the athetication page of the demo application. You can see now a menu bar at the top if the index page.

<img src="http://www.huile-de-code.fr/otf/img/capture_2015-02-22_index_OTF.png" />

# How to ?

You can see in demo application the menu "users" which display the list of users autorized to
connect to the back-office. 

<img src="http://www.huile-de-code.fr/otf/img/capture_2015-02-23_users_OTF.png" />

What's happen when you click on "users" link in the top menu :

1- You sent a pathname "/users" from GET HTTP method<br/>
2- You request the server to read into the accounts collection of mongoDB,<br/>
3- You need to display the data into a JQuery datatable<br/>

How can we do this into OTF² ? like this :

You need to see the "<b>otf_admin.json</b>" file that defined actions (pathnames) which can be used by the user account :
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



