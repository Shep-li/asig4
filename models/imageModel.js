const connection = require("../db");

const ImageModel = function(image) {
    this.file_name = image.file_name;
    this.id = image.id;
    this.url = image.url;
    this.upload_date = image.upload_date;
    this.user_id = image.user_id;
};

ImageModel.createImage = function(image, result) {
    connection.query("INSERT INTO image SET?", image, function(err, response) {
        if(err)
        	result(err, response);
		else
			result(null, response);
    });
}

ImageModel.getImageById = function(id, result) {
    connection.query("SELECT * FROM image WHERE id=?", [id], function(err, response) {
        if(err) throw err;
        return result(null, response);
    });
}

ImageModel.getImageByUserId = function(user_id, result) {
    connection.query("SELECT * FROM image WHERE user_id=?", [user_id], function(err, response) {
        if(err) throw err;
        return result(null, response);
    });
}

ImageModel.updateImage = function(id, image, result) {
    connection.query("UPDATE image SET? WHERE id = ?", [image, id], function(err, response) {
        if(err)
        	result(err, response);
		else
			result(null, response);
    });
}

ImageModel.deleteImageByUserId = function(user_id, result) {
    connection.query("DELETE FROM image WHERE user_id=?", [user_id], function(err, response) {
        if(err) throw err;
        return result(null, response);
    });
}

// UserModel.checkEmail = function(email, result) {
//     connection.query("SELECT * FROM users WHERE email=?", [email], function(err, response) {
//         if(err)
// 			return result(err, response);
// 		else
// 			return result(err, response);
//     });
// }


module.exports = ImageModel;