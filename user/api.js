const express = require("express");
const bcrypt = require("bcrypt");

const { s3_upload,s3_delete,createImage, getImageByUserId, deleteImageByUserId, createUser, getUser, checkEmail, updateUser } = require("./controller");
const basicAuth = require("../middleware/auth");
// const {getImageByUserId } = require("../models/imageModel");

const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const router = express.Router();


// Use to Auth middleware to validate user
router.use(basicAuth);

// render the map page
router.get("/", (req, res) => {
	res.status(405);
	res.json({ status: 405, message: 'Method not supported' });
});

router.get("/self", (req, res) => {

	// Since we alreal have the user data in the req using the Auth middleware, 
	// No need to query database 
	user = req.user;
	delete user.password;
	res.status(200);
	res.json(user);


	/*
	var email = req.user.email;
	getUser(email, function(err, response) {
		if(err) throw err;

		console.log(response);
		res.send(response)
	});
	*/

});

// get a image
router.get("/self/pic", (req, res) => {

	// Since we alreal have the user data in the req using the Auth middleware, 
	// No need to query database 
	const base64Credentials = req.headers.authorization.split(' ')[1];
	const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
	const [email, password] = credentials.split(':');
	console.log(email);
	getImageByUserId(email, async function (err, response) {
		if (err) {
			res.status(500);
			return res.json({ status: 500, message: err });
		}
		if (response == null || response.length == 0) {
			return res.status(401).json({ message: 'no pic' });
		}

		image = response[0];
		res.status(200);
		res.json(image);



	});

});

// delete a image
router.delete("/self/pic", (req, res) => {

	// Since we alreal have the user data in the req using the Auth middleware, 
	// No need to query database 
	const base64Credentials = req.headers.authorization.split(' ')[1];
	const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
	const [email, password] = credentials.split(':');
	console.log(email);
	deleteImageByUserId(email, async function (err, response) {
		if (err) {
			res.status(500);
			return res.json({ status: 500, message: err });
		}
		if (response == null || response.length == 0) {
			return res.status(401).json({ message: 'no pic' });
		}

		image = response[0];
		// ?????????filename
		//s3_delete bucketname + filename
		s3_delete('profile.prod.xiao8qusi.xyz','image.png')

		res.status(204);
		res.json("");

	});

});

// null


// Create a image 
router.post("/self/pic", async (req, res) => {


	//????????????????????? ????????????????????????
	// ??????????????????
	let msg = [];
	// ?????????????????????
	req.on('data', (chunk) => {
		if (chunk) {
			msg.push(chunk);
		}
	})
	req.on('end', () => {
		// ???buffer????????????????????????buffer??????????????????Buffer
		let buf = Buffer.concat(msg);
		console.log(buf)//??????Buffer??????
		var path = './image.png';//???app.js????????????--????????????????????????????????????

		fs.writeFile(path, buf, function (err) {//???fs????????????
			if (err) {
				console.log(err);
			} else {
				console.log('???????????????');
			}
		});
	})

	const base64Credentials = req.headers.authorization.split(' ')[1];
	const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
	const [email, password] = credentials.split(':');
	console.log("----------");
	//const process_data = created_field(req.body);
	//const errors = process_data[1];

	// check if the image exist by email
	// if exist delete

	var image = {};
	image["file_name"] = "image.jpg";
	image["id"] = uuidv4();
	image["url"] = "profile.prod.xiao8qusi.xyz/email/image-file.extension";
	var datetime = new Date();
	image["upload_date"] = datetime;
	image["user_id"] = email;

	//console.log(process_data);
	// if(errors.length > 0){
	// 	res.status(400);
	// 	return res.json({status: 400, message: errors});
	// }


	// Create the image 
	createImage(image, function (err, response) {
		if (err) {
			res.status(502);
			return res.json({ status: 502, message: err });

		}

		// s3_upload bucketname + ??????????????????
		s3_upload('profile.prod.xiao8qusi.xyz', 'image.png')
		// console.log("-------")
		// ?????????bucketname
		// ??????upload.js
		// ???????????????????????????????????????
		res.status(201);
		return res.json(image);


	});

	fs.unlinkSync('./image.png');

	



});




// Create a User
router.post("/", async (req, res) => {

	const process_data = created_field(req.body);
	const errors = process_data[1];
	let user = process_data[0];

	//console.log(process_data);
	if (errors.length > 0) {
		res.status(400);
		return res.json({ status: 400, message: errors });
	}

	const salt = await bcrypt.genSalt(10);
	// now we set user password to hashed password
	user.password = await bcrypt.hash(user.password, salt);

	var datetime = new Date();
	console.log(datetime);


	user.account_created = datetime;
	user.account_updated = datetime;

	//Check if this Email already exits
	checkEmail(user.email, function (err, response) {
		if (err) {
			res.status(500);
			res.json({ status: 500, message: err });
			return;
		}
		if (response.length > 0) {  // If email exist
			res.status(400);
			res.json({ status: 400, message: 'Email address already in use' });
			return;
		}

		// Create the user account
		createUser(user, function (err, response) {
			if (err) {
				res.status(500);
				return res.json({ status: 500, message: err });

			}
			delete user.password;
			res.status(201);
			return res.json(user);


		});




	});




});


// Update User Account
router.put("/self", async (req, res) => {

	const process_data = updated_field(req.body);
	const errors = process_data[1];
	let user = process_data[0];

	//console.log(process_data);
	if (errors.length > 0) {
		res.status(400);
		return res.json({ status: 400, message: errors });
	}

	if (Object.keys(user).length == 0) {
		res.status(400);
		return res.json({ status: 400, message: 'No field to update' });
	}

	if (user.password) {
		const salt = await bcrypt.genSalt(10);
		// now we set user password to hashed password
		user.password = await bcrypt.hash(user.password, salt);
	}

	var datetime = new Date();
	user.account_updated = datetime;

	// Create the user account
	updateUser(req.user.email, user, function (err, response) {
		if (err) {
			res.status(500);
			return res.json({ status: 500, message: err });
		}

		user.password = undefined;
		delete user.password;

		res.status(200);
		return res.json(user);


	});





});


function created_image_field(req) {
	var fields = ['file_name', 'id', 'url', 'user_id'];
	var field_length = [0, 0, 0, 0];
	var image = {};
	var errors = [];
	var index = 0;
	for (const fd of fields) {
		if (fd in req) {
			if (req[fd].trim().length < field_length[index])
				errors.push({ field: fd, message: 'length too small' });
			if (fd == 'email') {
				// Check if email is valid
				if (!isEmailValid(req[fd].trim())) {
					errors.push({ field: fd, message: 'Email address is not valid' });
				}
			}
			image[fd] = req[fd].trim();

		}
		else {

			errors.push({ field: fd, message: fd + ' is required' });

		}

		index++;
	}

	return [image, errors];

}

function created_field(req) {
	var fields = ['email', 'first_name', 'last_name', 'password'];
	var field_length = [7, 2, 2, 6];
	var user = {};
	var errors = [];
	var index = 0;
	for (const fd of fields) {
		if (fd in req) {
			if (req[fd].trim().length < field_length[index])
				errors.push({ field: fd, message: 'length too small' });
			if (fd == 'email') {
				// Check if email is valid
				if (!isEmailValid(req[fd].trim())) {
					errors.push({ field: fd, message: 'Email address is not valid' });
				}
			}
			user[fd] = req[fd].trim();

		}
		else {

			errors.push({ field: fd, message: fd + ' is required' });

		}

		index++;
	}

	return [user, errors];

}



function updated_field(req) {
	var fields = ['first_name', 'last_name', 'password'];
	var field_length = [2, 2, 6];
	var user = {};
	var errors = [];
	var index = 0;
	for (const fd of fields) {
		if (fd in req) {
			if (req[fd].trim().length < field_length[index])
				errors.push({ field: fd, message: 'length too small' });
			user[fd] = req[fd].trim();
		}
		index++;
	}
	for (const fd in req) {
		if (!(fields.includes(fd))) {
			errors.push({ field: fd, message: fd + ' can not be updated' });
		}
	}
	return [user, errors];

}



function isEmailValid(email) {
	var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

	if (!email)
		return false;

	if (email.length > 254)
		return false;

	var valid = emailRegex.test(email);
	if (!valid)
		return false;

	// Further checking of some things regex can't handle
	var parts = email.split("@");
	if (parts[0].length > 64)
		return false;

	var domainParts = parts[1].split(".");
	if (domainParts.some(function (part) { return part.length > 63; }))
		return false;

	return true;
}




module.exports = router;