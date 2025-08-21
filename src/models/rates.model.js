// /models/rates.model.js
const mongoose = require('mongoose');

const RatesSchema = new mongoose.Schema({
  sn: { type: Number, index: true },
  single: { type: String, required: true },
  jodi: { type: String, required: true },
  singlepatti: { type: String, required: true },
  doublepatti: { type: String, required: true },
  triplepatti: { type: String, required: true },
  halfsangam: { type: String, required: true },
  fullsangam: { type: String, required: true },
  Sp: { type: String, required: true },
  Dp: { type: String, required: true },
  round: { type: String, required: true },
  centerpanna: { type: String, required: true },
  aki: { type: String, required: true },
  beki: { type: String, required: true },
  chart50: { type: String, required: true },
  chart60: { type: String, required: true },
  chart70: { type: String, required: true },
  akibekicut30: { type: String, required: true },
  abr30pana: { type: String, required: true },
  startend: { type: String, required: true },
  cyclepana: { type: String, required: true },
  groupjodi: { type: String, required: true },
  panelgroup: { type: String, required: true },
  bulkjodi: { type: String, required: true },
  bulksp: { type: String, required: true },
  bulkdp: { type: String, required: true },
  familypannel: { type: String, required: true },
  familyjodi: { type: String, required: true }
}, { timestamps: false, collection: 'rates' });

module.exports = mongoose.model('Rate', RatesSchema);
