
const Counter = require("../models/Counter/Counter");

const updateNextSequence = async (name) => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq;
};

module.exports = { updateNextSequence };
