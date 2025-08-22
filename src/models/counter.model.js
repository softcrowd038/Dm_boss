import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, 
    seq: { type: Number, default: 0 }
  },
  { collection: "counters" }
);

export default mongoose.model("Counter", CounterSchema);
