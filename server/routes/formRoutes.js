const mongoose = require('mongoose');
const Employees = mongoose.model('Employees');
const requireLogin = require('../middlewares/requireLogin');


module.exports = app => {
	app.post('/api/employee',requireLogin,async (req,res)=>{
		console.log(req.body);
		const {name, mobile,place } = req.body;
		console.log("create");
		const employee = await new Employees({
			name,
			mobile,
			place
		}).save();
		const employees = await Employees.find().select();
		res.send({employees});
	});
	
	app.get('/api/employees',requireLogin,async (req,res)=>{
		const employees = await Employees.find().select();
		console.log(employees);
		res.send({employees});
		console.log("sadas");
	});
	app.get('/api/employee/:id',requireLogin,async (req,res)=>{
		const employees = await Employees.findOne({_id:req.params.id}).select();
		console.log(req.params);

		res.send({employees});
		console.log("sadas");
	});
	app.patch('/api/employee/:id',requireLogin,async (req,res)=>{
		const {name, mobile,place } = req.body;
		const id=req.params.id;
		console.log(name);
		console.log("edit");
		const employee = await Employees.findOneAndUpdate({_id:req.params.id},{
			name,
			mobile,
			place
		});
		// const employee = new Employees({
		// 	name,
		// 	mobile,
		// 	place
		// });
		
		const employees = await Employees.find().select();
		res.send({employees});

	});
	app.delete('/api/employee/:id',requireLogin,async (req,res)=>{
		// const {name, mobile,place } = req.body;
		const employee = await Employees.deleteOne({_id:req.params.id});
		const employees = await Employees.find().select();
		res.send({employees});

	});
};