const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      minlength: 5,
      maxlength: 50,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    apiKey: {
        type: String,
        maxlength: 100
    }
    
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.log(error);
  }
}

userSchema.pre("save", async function (next) {
  if (!this.isModified('password')) {
    next();
  } 

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt);
})

module.exports = mongoose.model("User", userSchema);
