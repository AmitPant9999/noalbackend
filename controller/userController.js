const User = require("../models/User");

// GET User by Email
exports.getUser = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase(); // Normalize email

    if (!email) {
      return res.status(400).json({ status: "fail", message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: { user }
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

// UPDATE User by Email
exports.updateUser = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase(); // Normalize email
    const updateData = req.body;

    const user = await User.findOneAndUpdate(
      { email }, 
      updateData,
      { new: true, }
    );

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      message: "User updated successfully!",
      data: { user }
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error"
    });
  }
};

exports.deleteUser=async(req,res)=>{
  try{
    const email=req.params.email;
    await User.deleteOne({email})
    

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch(err){
    console.error("Database error:", err);
    res.status(500).json({ status: "fail", message: "Internal Server Error" });

  }
}