const connection = require("../db");

const UserModel = function(user) {
    this.email = user.email;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.password = user.password;
    this.account_created = user.account_created;
    this.account_updated = user.account_updated;
};

UserModel.createUser = function(user, result) {
    connection.query("INSERT INTO users SET?", user, function(err, response) {
        if(err)
        	result(err, response);
		else
			result(null, response);
    });
}

UserModel.getUser = function(email, result) {
    connection.query("SELECT * FROM users WHERE email=?", [email], function(err, response) {
        if(err) throw err;
        return result(null, response);
    });
}

UserModel.updateUser = function(email, user, result) {
    connection.query("UPDATE users SET? WHERE email = ?", [user, email], function(err, response) {
        if(err)
        	result(err, response);
		else
			result(null, response);
    });
}

UserModel.checkEmail = function(email, result) {
    connection.query("SELECT * FROM users WHERE email=?", [email], function(err, response) {
        if(err)
			return result(err, response);
		else
			return result(err, response);
    });
}


module.exports = UserModel;
