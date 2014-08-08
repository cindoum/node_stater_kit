module.exports = {
	format: function (err, cb) {
	    //If it isn't a mongoose-validation error, just throw it.
	    if (err.name !== 'ValidationError') return err;
	    var messages = {
	        'required': "%s is required.",
	        'min': "%s below minimum.",
	        'max': "%s above maximum.",
	        'enum': "%s not an allowed value."
	    };
	
	    //A validationerror can contain more than one error.
	    var errors = '';
	
	    //Loop over the errors object of the Validation Error
	    Object.keys(err.errors).forEach(function (field) {
	        var eObj = err.errors[field];
	
			if (eObj.type === 'user defined') errors += eObj.message + '<br />';
	        else if (!messages.hasOwnProperty(eObj.type)) errors += eObj.type + '<br />';
	        else errors += require('util').format(messages[eObj.type], eObj.path) + '<br />';
	    });
	
	    return errors;
	}
}