import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema(
  {
    sn: { type: Number, index: true }, // legacy pk
    mobile: { type: String, required: true, unique: true, trim: true, maxlength: 20 },
    name: { type: String, required: true, trim: true, maxlength: 255 },
    email: { type: String, trim: true, maxlength: 255, default: null },
    wallet: { type: Number, default: 0 },                  // int in SQL
    session: { type: String, default: "" },
    code: { type: String, default: "0" },
    created_at: { type: String, default: null },           // legacy string date
    active: { type: Number, default: 1, enum: [0, 1] },    // int(1)
    verify: { type: String, default: "1" },                // varchar(1)
    transfer_points_status: { type: String, default: "0" },
    paytm: { type: String, default: "0" },
    pin: { type: String, default: null },
    refcode: { type: String, default: null },
    ref_id: { type: String, default: null },
    password: { type: String, default: null },             // hashed
    ip_address: { type: String, default: null },
    created_a: { type: Date, default: Date.now },          // SQL timestamp
    updated_at: { type: Date, default: null }
  },
  { timestamps: false, collection: "users" }
);

UsersSchema.index({ created_a: -1 });

export default mongoose.model("User", UsersSchema);
