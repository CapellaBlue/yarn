var express = require('express');
var router = express.Router();
var Story = require('../models/stories.js');
var User = require('../models/users.js');
var session = require('express-session');
// var bcrypt = require('bcrypt');

router.get('/', function(req, res){
	Story.find({}, function(err, foundStories){
        User.find({}, function(err, foundUsers){
        console.log(foundStories);
		      res.render('stories/index.ejs', {
                users: foundUsers,
			    stories: foundStories,
                currentUser: req.session.currentuser
		    });
        });
	});
});

router.get('/new', function(req, res){
    User.findById(req.session.currentuser, function(err, foundUser){
        if(req.session.currentuser !== undefined){
            res.render('stories/new.ejs', {
                draft:['Rough Draft', 'First Draft', 'Second Draft', 'Millionth Draft', 'Final'],
                user:foundUser,
                currentUser: req.session.currentuser
            });
        } else {
            res.redirect('/sessions/new');
		};
    });
});

router.get('/:id/edit', function(req, res){

	Story.findById(req.params.id, function(err, foundStory){
		res.render('stories/edit.ejs', {
            draft:['Rough Draft', 'First Draft', 'Second Draft', 'Millionth Draft', 'Final'],
			story: foundStory,

            currentUser: req.session.currentuser
		});
	});
});

router.get('/:id', function(req, res){
    Story.findById(req.params.id, function(err, foundStory){
        User.findOne({'stories._id':req.params.id}, function(err, foundUser){
    		res.render('stories/show.ejs', {
                user: foundUser,
    			story: foundStory,
                currentUser: req.session.currentuser
    		});
    	});
    });
});

router.post('/', function(req, res){
    User.findOne({username: req.body.username}, function(err, foundUser){
    	Story.create(req.body, function(err, createdStory){
            foundUser.stories.push(createdStory);
            foundUser.save(function(err, savedUser){
                res.redirect('/stories');
            });
    	});
    });
});

router.delete('/:id', function(req, res){
	Story.findByIdAndRemove(req.params.id, function(){
        User.findOne({'stories._id':req.params.id}, function(err, foundUser){
            foundUser.stories.id(req.params.id).remove();
            foundUser.save(function(err, savedUser){
                 res.redirect('/stories');
            });
        });
	});
});


router.put('/:id', function(req, res){
	Story.findByIdAndUpdate(req.params.id, req.body, {new:true}, function(err, updatedStory){
        console.log(req.body);
        User.findOne({ 'stories._id' : req.params.id }, function(err, foundUser){
            foundUser.stories.id(req.params.id).remove();
            foundUser.stories.push(updatedStory);
            foundUser.save(function(err, data){
                res.redirect('/stories');
            });
        });
	});
});

module.exports = router;
