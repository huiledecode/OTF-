# otf
On The Fly Framework : OTF²

OTF² is a Node.js development Framework to simplify development for front-end developers.  it's constructed over a finished automate's model. Modules are loaded dynamically by otf.js module, they are defined into a "flight plan" named "otf_default.json" for public interfaces and "otf_admin.json" for private interfaces.

Also, OTF² has some generic modules which make actions :  writing, reading, deleting and updating of the  collection into a mongoDB database; files uploading, signup account, demo application.

# Prerequisites

You need to install mongoDB to use OTF² and restore the database of the demo application :

<code>$ cd dump</code><br />
<code>$ mongorestore ./otf_demo</code>

# Quick Start

Open a terminal, go into your workspace directory and type :

<code>$ git clone https://github.com/huiledecode/otf.git</code>

change directory to "otf" :

<code>$ cd otf</code>

get all the dependancies by npm :

<code>$ npm install</code>

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

You can see authenticaton page ogf otf_demo application :

<img src="http://www.huile-de-code.fr/otf/img/capture_2015-02-2_accueil_OTF.png" />
