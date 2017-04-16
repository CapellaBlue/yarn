var express = require('express');
var router = express.Router();
var Story = require('../models/stories.js');
var Author = require('../models/authors.js');
// var bcrypt = require('bcrypt');

router.get('/', function(req, res){
	Story.find({}, function(err, foundStories){
		res.render('stories/index.ejs', {
			stories: foundStories
		});
	});
});

router.get('/new', function(req, res){
    User.find({}, function(err, foundUsers){
        res.render('stories/new.ejs', {
            users:foundUsers
        });
    });
});

router.post('/', function(req, res){
    User.findById(req.body.userId, function(err, foundUser){
        console.log(foundUser);
    	Story.create(req.body, function(err, createdStory){
            foundUser.stories.push(createdStory);
            foundUser.save(function(err, savedUser){
                res.redirect('/stories');
            });
    	});
    });
});

router.get('/:id', function(req, res){
    Story.findById(req.params.id, function(err, foundStory){
        User.findOne({'stories._id':req.params.id}, function(err, foundUser){
    		res.render('stories/show.ejs', {
                user: foundUser,
    			story: foundStory
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

router.get('/:id/edit', function(req, res){
	Story.findById(req.params.id, function(err, foundStory){
		res.render('stories/edit.ejs', {
			story: foundStory
		});
	});
});

router.put('/:id', function(req, res){
	Story.findByIdAndUpdate(req.params.id, req.body, {new:true}, function(err, updatedStory){
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