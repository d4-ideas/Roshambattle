var nodemailer = require("nodemailer");
var directTransport = require('nodemailer-direct-transport');
var transporter = nodemailer.createTransport(directTransport());

var mailOptions= {
   from: "Anthony Sheetz <asheetz2000@gmail.com>", // sender address.
   to: "Anthony Sheetz <asheetz2000@gmail.com>", // receiver
   subject: "Emailing with nodemailer", // subject
   text: "Email Example with nodemailer" // body
};

transporter.sendMail(mailOptions, function(error, response){  //callback
   if (error) {
       console.log(error);
   } else {
       console.log("Message sent: " + response.message);
   }

   transporter.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
});

