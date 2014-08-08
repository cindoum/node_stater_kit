var nodemailer = require('nodemailer'),
    constant =   require('./constants');

module.exports.sendMail = function (to, subject, body) {
    var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
        auth: constant.SMTP_USER
    });

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: constant.EMAIL_FROM, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: body // html body
    }
    
    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
    
        smtpTransport.close(); // shut down the connection pool, no more messages
    });
}