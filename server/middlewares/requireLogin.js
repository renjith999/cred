module.exports = (req,res,next) => {
		console.log(req.user);
		console.log("userlogin");
	if(!req.user)
	{
		return res.status(401).send({error:"u must login"});
	}

	next();

}