const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const Counter = require('./Counter');

const userSchema = new mongoose.Schema({
  userNumber: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return !v || validator.isMobilePhone(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Auto-increment userNumber
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'user' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    user.userNumber = counter.seq;
  }

  // Hash password if modified
  if (!user.isModified('password')) return next();

  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    user.password = await bcrypt.hash(user.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
