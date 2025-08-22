// Display rates (equivalent of MySQL `rates`), keep the "10/<value>" strings
import mongoose from "mongoose";

const RateDisplaySchema = new mongoose.Schema(
  {
    single: { type: String, required: true, default: "10/95" },
    jodi: { type: String, required: true, default: "10/950" },
    singlepatti: { type: String, required: true, default: "10/1500" },
    doublepatti: { type: String, required: true, default: "10/3000" },
    triplepatti: { type: String, required: true, default: "10/9000" },
    halfsangam: { type: String, required: true, default: "10/13000" },
    fullsangam: { type: String, required: true, default: "10/100000" },

    Sp: { type: String, required: true, default: "10/150000" },
    Dp: { type: String, required: true, default: "10/150000" },
    round: { type: String, required: true, default: "10/150000" },
    centerpanna: { type: String, required: true, default: "10/150000" },
    aki: { type: String, required: true, default: "10/150000" },
    beki: { type: String, required: true, default: "10/150000" },
    chart50: { type: String, required: true, default: "10/150000" },
    chart60: { type: String, required: true, default: "10/150000" },
    chart70: { type: String, required: true, default: "10/150000" },
    akibekicut30: { type: String, required: true, default: "10/150000" },
    abr30pana: { type: String, required: true, default: "10/150000" },
    startend: { type: String, required: true, default: "10/150000" },
    cyclepana: { type: String, required: true, default: "10/150000" },

    groupjodi: { type: String, required: true, default: "10/950" },
    panelgroup: { type: String, required: true, default: "10/1500" },
    bulkjodi: { type: String, required: true, default: "10/950" },
    bulksp: { type: String, required: true, default: "10/1500" },
    bulkdp: { type: String, required: true, default: "10/3000" },
    familypannel: { type: String, required: true, default: "10/6000" },
    familyjodi: { type: String, required: true, default: "10/3000" },
  },
  { timestamps: true, collection: "rate_display" }
);

export default mongoose.model("RateDisplay", RateDisplaySchema);
