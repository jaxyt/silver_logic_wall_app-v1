'use strict';

const express = require('express');
const { check, validationResult } = require('express-validator/check');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

// Use mailjet's api to send emails to user on signup, just replace the sender key values with your account info and youre good to go
const mailjetConfig = require('./my-config.json');
const sender = {
    name: mailjetConfig.name,
    emailAddress: mailjetConfig.emailAddress,
    apiKey: mailjetConfig.apiKey,
    secretKey: mailjetConfig.secretKey,
};
const mailjet = require ('node-mailjet')
    .connect(sender.apiKey, sender.secretKey);

const { models } = require('./db');
const { User, Post } = models;

const router = express.Router();

const authenticateUser = async (req, res, next) => {
    try {
        let message = null;
        let user;
        const credentials = auth(req);
        if (credentials) {
            user = await User.findOne({ where: { emailAddress: credentials.name } });
            if (user) {
                const authenticated = await bcryptjs.compare(credentials.pass, user.password);
                if (authenticated) {
                    console.log(`Authentication successful for user: ${user.username}`);
                    req.currentUser = user;
                } else {
                    message = `Authentication failure for user: ${user.emailAddress}`;
                }
            } else {
                message = `User ${user.emailAddress} not found`;
            }
        } else {
            message = "Auth header not found";
        }
        if (message) {
            console.warn(message);
            res.status(401).json({ message: "Access Denied"});
        } else {
            next();
        }
    } catch (error) {
        next(error);
    }
}

const validate = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg);
            res.status(400).json({ errors: errorMessages });
        } else {
            next();
        }
    } catch (error) {
        next(error);
    }
}

const sendEmail = (newUser) => {
    mailjet
        .post("send", {'version': 'v3.1'})
        .request({
        "Messages":[
            {
            "From": {
                "Email": `${sender.emailAddress}`,
                "Name": `${sender.name}`
            },
            "To": [
                {
                "Email": `${newUser.emailAddress}`,
                "Name": `${newUser.username}`
                }
            ],
            "Subject": "Greetings from SilverWall.",
            "TextPart": "New User Sign Up",
            "HTMLPart": `<h3>Dear ${newUser.username}, welcome!</h3>`,
            "CustomID": "NewUserSignUp"
            }
        ]
        });
} 

// Returns the currently authenticated user
router.get('/users', authenticateUser, async (req, res, next) => {
    try {
        const credentials = auth(req);
        const user = await User.findOne({where: { emailAddress: credentials.name }, attributes: ['id','username','emailAddress']});
        res.json(user); 
    } catch (err) {
        next(err)
    }
});

// Route that creates a new user.
router.post('/users', [
    check('username')
        .exists()
        .withMessage('Please provide a value for "username"'),
    check('emailAddress')
      .exists()
      .withMessage('Please provide a value for "emailAddress"'),
    check('password')
      .exists()
      .withMessage('Please provide a value for "password"'),
  ], validate, (req, res, next) => {
      try {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.emailAddress)) {
            next();
        } else {
            res.status(400).json({error: "This email address is not valid"});
        } 
      } catch (err) {
         next(err) 
      }

  }, async (req, res, next) => {
      try {
        const existingUser = await User.findOne({where: {emailAddress: req.body.emailAddress}});
        if (existingUser) {
            res.status(400).json({error: "This email address is already in use"});
        } else {
            next();
        }
      } catch (err) {
          next(err);
      }
  }, async (req, res, next) => {
      try {
        const result = await sendEmail(req.body);
        console.log(result);
        next();
      } catch (error) {
        console.log(error.statusCode);
        res.status(400).json({err: "Sorry, but an error occured and we're unable to complete your request"});
      }
  }, async (req, res) => {
    try {
        const hashed = await  bcryptjs.hash(req.body.password, 10); 
        const newUser = await User.create({username: req.body.username, emailAddress: req.body.emailAddress, password: hashed});
        
        // Set the location to '/', the status to 201 Created, and end the response.
        return res.status(201).location(`/`).end();
    } catch (error) {
        console.log(error);
        res.json({error: `${error}`})
    }
    
});

router.get('/posts', async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            attributes: ['id', 'postContent'],
            include: [{
                model: User,
                attributes: ['id', 'username']
            }]
        });

        res.json(posts);
    } catch (error) {
        next(error);
    }
});

/**
 * creates a new course and assigns it to either the current user or a user specified in the body
 */
router.post('/posts', authenticateUser,  [
    check('postContent')
        .exists()
        .withMessage('Please provide content for this post'),
  ], validate, async (req, res, next) => {
    try {
        const credentials = auth(req);
        const currentUser = await User.findOne({where: {emailAddress: credentials.name}})
        const newPost = await Post.create({postContent: req.body.postContent, userId: currentUser.id});
        
        // Set the location to '/courses/id', the status to 201 Created, and end the response.
        return res.status(201).location(`/courses/${newPost.id}`).end();
    } catch (error) {
        console.log(error);
        res.json({error: `${error}`});
    }
})

router.get('/posts/:id', async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.id },
            attributes: ['id', 'postContent'],
            include: [{
                model: User,
                attributes: ['id', 'username']
            }]
        });

        res.json(post);
    } catch (error) {
        next(error);
    }
});

router.put('/posts/:id', [
    check('postContent')
        .exists()
        .withMessage('Please provide content for this post'),
  ], validate, authenticateUser, async (req, res, next) => {
    try {
        const credentials = auth(req);
        const user = await User.findOne({where: {emailAddress: credentials.name}});
        const post = await Post.findOne({where: {id: req.params.id}});
        if (user.id === post.userId) {
            next();
        } else {
            res.status(403).json({errors: ["The post you are attempting to modify is owned by a different user"]})
        }    
    } catch (err) {
        next(err)
    }
  }, async (req, res, next) => {
    try {
        const updates = req.body;
        const updatedPost = await Post.update({postContent: updates.postContent}, {where: {id: req.params.id}});
        return res.status(204).end();
    } catch (err) {
        next(err)
    }
  });

router.delete('/posts/:id', authenticateUser, async (req, res, next) => {
    try {
        const credentials = auth(req);
        const user = await User.findOne({where: {emailAddress: credentials.name}});
        const post = await Post.findOne({where: {id: req.params.id}});
        if (user.id === post.userId) {
            next();
        } else {
            res.status(403).json({errors: ["The post you are attempting to modify is owned by a different user"]})
        }    
    } catch (err) {
        next(err)
    }
  }, async (req, res, next) => {
    try {
        const deletedPost = await Post.destroy({where: {id: req.params.id}});
        res.status(204).end();  
    } catch (err) {
        next(err);
    }
  });

module.exports = router;
// {"postContent":"A dummy test post"}
// {"username":"testuser","emailAddress":"test@user.com","password":"password"}