import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const UsersSchema = new mongoose.Schema(
  {
    sn: { 
      type: Number, 
      index: true,
      sparse: true 
    },
    
    mobile: { 
      type: String, 
      required: [true, "Mobile number is required"],
      unique: true,
      trim: true,
      maxlength: 20,
      validate: {
        validator: function(v) {
          return /^[0-9]{10,15}$/.test(v);
        },
        message: "Mobile number must be 10-15 digits"
      }
    },
    
    name: { 
      type: String, 
      required: [true, "Name is required"], 
      trim: true, 
      maxlength: 255,
      validate: {
        validator: function(v) {
          return v.length >= 2 && v.length <= 255;
        },
        message: "Name must be between 2-255 characters"
      }
    },
    
    email: { 
      type: String, 
      trim: true, 
      lowercase: true,
      maxlength: 255, 
      default: null,
      sparse: true, 
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format"
      }
    },
    
    wallet: { 
      type: Number, 
      default: 0,
      min: [0, "Wallet balance cannot be negative"],
      get: v => Math.round(v),
      set: v => Math.round(v)
    },
    
    session: { 
      type: String, 
      default: "",
      maxlength: 500
    },
    
    code: { 
      type: String, 
      default: "0",
      maxlength: 10
    },
    
    created_at: { 
      type: String, 
      default: null 
    },
    
    verify: { 
      type: String, 
      default: "1",
      enum: ["0", "1"], 
      maxlength: 1
    },
    
    transfer_points_status: { 
      type: String, 
      default: "0",
      enum: ["0", "1"],
      maxlength: 1
    },
    
    paytm: { 
      type: String, 
      default: "0",
      maxlength: 20
    },
    
    pin: { 
      type: String, 
      default: null,
      minlength: 4,
      maxlength: 6,
      select: false 
    },
    
    password: { 
      type: String, 
      default: null,
      minlength: 6,
      select: false, 
      validate: {
        validator: function(v) {
          return v === null || v.length >= 6;
        },
        message: "Password must be at least 6 characters"
      }
    },
    
    ip_address: { 
  type: String, 
  default: null,
  validate: {
    validator: function(v) {
      return v === null || v === '' || validator.isIP(v);
    },
    message: "Invalid IP address format"
  }
},
    
    created_a: { 
      type: Date, 
      default: Date.now,
      index: -1 
    },
    
    updated_at: { 
      type: Date, 
      default: null 
    },
    passwordChangedAt: {
      type: Date,
      default: null
    },
    
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "pending"],
      default: "active",
      index: true
    },
    
    last_login: {
      type: Date,
      default: null
    },
    
    login_attempts: {
      type: Number,
      default: 0,
      min: 0
    },
    
    lock_until: {
      type: Date,
      default: null
    },
    
    
    mobile_prefix: {
      type: String,
      index: true,
      default: function() {
        return this.mobile ? this.mobile.substring(0, 3) : null;
      }
    }
  },
  { 
    timestamps: false, 
    collection: "users",
    toJSON: { 
      virtuals: true,
      getters: true,
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.pin;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      getters: true
    }
  }
);


UsersSchema.virtual("formatted_mobile").get(function() {
  return this.mobile ? `+${this.mobile}` : null;
});


UsersSchema.virtual("age").get(function() {
  if (!this.created_a) return null;
  const today = new Date();
  const birthDate = new Date(this.created_a);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});


UsersSchema.index({ email: 1 }, { sparse: true });
UsersSchema.index({ status: 1, created_a: -1 });
UsersSchema.index({ wallet: -1 });
UsersSchema.index({ mobile: 1, status: 1 });
UsersSchema.index({ "created_a": 1 }, { expireAfterSeconds: 31536000 }); 


UsersSchema.pre("save", async function(next) {
  if (!this.isModified("password") || this.password === null) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


UsersSchema.pre("save", function(next) {
  this.updated_at = new Date();
  next();
});


UsersSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};


UsersSchema.methods.isLocked = function() {
  return !!(this.lock_until && this.lock_until > Date.now());
};


UsersSchema.statics.findByMobile = function(mobile, includeInactive = false) {
  const query = { mobile };
  if (!includeInactive) {
    query.status = "active";
  }
  return this.findOne(query).select("+password +pin");
};


UsersSchema.statics.updateWallet = function(userId, amount) {
  return this.findByIdAndUpdate(
    userId,
    { 
      $inc: { wallet: amount },
      $set: { updated_at: new Date() }
    },
    { new: true }
  );
};


UsersSchema.query.active = function() {
  return this.where({ status: "active" });
};


UsersSchema.query.minWallet = function(amount) {
  return this.where("wallet").gte(amount);
};

UsersSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

export default mongoose.model("User", UsersSchema);