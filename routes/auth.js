const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const randomuniqID = Math.random().toString(36).substring(2,10);
        var nodemailer = require("nodemailer");

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            isTeacher: req.body.isTeacher,
            isAdmin: req.body.isAdmin,
            uniqID: randomuniqID,
        });
         console.log(randomuniqID);
        var nodemailer = require("nodemailer");

        // mail the unique id
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.email,
              pass: process.env.email_pass
            }
          });

        var mailOptions = {
            from: 'kteam1127@gmail.com',
            to: req.body.email,
            subject: 'Your Unique ID for KClassroom',
            text: `Unique ID: ${randomuniqID}.\n Please Keep This ID safe You can't reset it later`
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if(error) {
                console.log(error);
            } else {
                console.log('Unique ID sent: ' + info.response);
            }
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch(err) {
        console.log(err)
    }
});

router.post("/login", async (req, res) => {
    try {

        const user = await User.findOne({
            uniqID: req.body.uniqID,
        });
        !user && res.status(404).json("user not found");

        const validpassword = await bcrypt.compare(req.body.password, user.password);
        !validpassword && res.status(400).json("password invalid");

        res.status(200).json(user);

    } catch (err) {
        console.log(err);
    }
})

module.exports = router;