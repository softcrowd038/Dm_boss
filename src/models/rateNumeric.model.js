// Numeric rates (equivalent of MySQL `rate`)
import mongoose from "mongoose";

const RateNumericSchema = new mongoose.Schema(
  {
    // keep exactly the columns you have in SQL dump
    single: { type: Number, required: true, default: 9.5 },
    jodi: { type: Number, required: true, default: 95 },
    singlepatti: { type: Number, required: true, default: 150 },
    doublepatti: { type: Number, required: true, default: 300 },
    triplepatti: { type: Number, required: true, default: 900 },
    halfsangam: { type: Number, required: true, default: 1300 },
    fullsangam: { type: Number, required: true, default: 10000 },

    Sp: { type: Number, required: true, default: 15000 },
    Dp: { type: Number, required: true, default: 15000 },
    round: { type: Number, required: true, default: 15000 },
    centerpanna: { type: Number, required: true, default: 15000 },
    aki: { type: Number, required: true, default: 15000 },
    beki: { type: Number, required: true, default: 15000 },
    chart50: { type: Number, required: true, default: 15000 },
    chart60: { type: Number, required: true, default: 15000 },
    chart70: { type: Number, required: true, default: 15000 },
    akibekicut30: { type: Number, required: true, default: 15000 },
    abr30pana: { type: Number, required: true, default: 15000 },
    startend: { type: Number, required: true, default: 15000 },
    cyclepana: { type: Number, required: true, default: 15000 },

    groupjodi: { type: Number, required: true, default: 95 },
    panelgroup: { type: Number, required: true, default: 150 },
    bulkjodi: { type: Number, required: true, default: 95 },
    bulksp: { type: Number, required: true, default: 150 },
    bulkdp: { type: Number, required: true, default: 300 },
    familypannel: { type: Number, required: true, default: 600 },
    familyjodi: { type: Number, required: true, default: 300 },
  },
  { timestamps: true, collection: "rate_numeric" }
);

export default mongoose.model("RateNumeric", RateNumericSchema);
