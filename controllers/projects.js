var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var Project = require('../models/Project.js');

router.get('/', function(req, res){
	// Here the user can select an existing project or create a new one.

	// Why are we getting the user again? Because we want the latest info.
	// Req.user is from when they last logged in - it may have changed since then.
	var userProjects = User.findById(req.user._id, function(err, user){
		res.rendr('projects/index', {
			title:'Select a project',
			projects: user.projects
		});	
	});

});

router.get('/new', function(req, res){
	res.rendr('projects/new', {
		title: 'Create a project'
	});
});

router.post('/new', function(req, res){
	var project = new Project({
		project_name: req.body.name,
		url: req.body.url,
	});
	project.members.push(req.user);
	project.save(function(err, project){
		if(err) console.log(err);
		res.redirect('/project/'+project._id);	
	});
});

module.exports = router;
