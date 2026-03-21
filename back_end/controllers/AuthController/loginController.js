export const signUp = (req, res) => {
  try {
  
    console.log(req.body);
    return res.status(200).json({message:"Data Saved"});
  } catch (error) {
    res.status(500).json({ message: "SignUp Failed" });
  }
};
