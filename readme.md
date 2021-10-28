# User Stories
 Database

A backend application to manage user stories

---
## Requirements

For development, you will  need Node.js and a node global package, NPM which is usually package with nodejs, installed in your environement.
You will also need a database (MySql) installed in your server.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v16.1.0

    $ npm --version
    7.21.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g


---

## Installing this Application / Deployment

    $ git clone https://github.com/YOUR_USERNAME/PROJECT_TITLE
    $ cd PROJECT_TITLE
    $ npm install    (This will install all dependency)



## Import Database 
Create a Database and import the users.sql file which contains the users table.  
----


## Configure app

Create a  '.env' file in project directory, then edit it with your settings, MySql settings and app PORT number. You will need:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=users
PORT=3000

----

## Running the project

    $ node app.js


## API endpoint for testing with postman

####   Create Account
  - method: POST
  - url:   /user
  - content-Type: Application/json
  - Raw body:
	{
   	 "email": "johndoe@gmail.com",
    	"password": "aaaaaa",
    	"first_name": "John",
    	"last_name": "Doe"
	}


####   Update Account
  - method: PUT
  - url:   /user/self
  - content-Type: Application/json
  - Raw body: 
	{
   	"password": "aaaaaa",
    	"first_name": "John",
    	"last_name": "Doe"
	}
  - header: include basic authentication


####   Get Account
  - method: GET
  - url:   /user/self
  - content-Type: Application/json
  - header: include basic authentication
