# otf
On The Fly Framework : OTF²

"OTF²" is a Node.js development Framework to simplify development for front-end developers.  it's constructed over a finished automate's model. Modules are loaded dynamically by otf.js module, they are defined into a "flight plan" named "otf_default.json" for public interfaces and "otf_admin.json" for private interfaces.

Also, "OTF²" has some generic modules which make actions :  writing, reading, deleting and updating of the  collection into a mongoDB database; files uploading, signup account, demo application.

# Quick Start

Open a terminal, go into your workspace directory and type :

<code>$ git clone https://github.com/huiledecode/otf.git</code>

change directory to "otf" :

<code>$ cd otf</code>

get all the dependancies by npm :

<code>$ npm install</code>

Before to start "otf2", you need to install mongoDB and start it with a ReplicatSet

<code>$ mongod --ReplSet otf_demo</code>

