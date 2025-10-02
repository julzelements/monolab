const { decodeMonologueParameters } = require("./dist/lib/sysex/decoder.js");
const dump1 = require("./src/lib/sysex/tests/data/dumps/dump1.json");
const dump4 = require("./src/lib/sysex/tests/data/dumps/dump4.json");

console.log("=== DUMP1 ANALYSIS ===");
const decoded1 = decodeMonologueParameters(dump1.rawData);
console.log("isValid:", decoded1.isValid);
console.log("drive:", decoded1.drive);
console.log("oscillators:", !!decoded1.oscillators);
console.log("filter:", !!decoded1.filter);
console.log("envelope:", !!decoded1.envelope);
console.log("lfo:", !!decoded1.lfo);
console.log("misc:", !!decoded1.misc);
console.log("Error:", decoded1.error);

console.log("\n=== DUMP4 ANALYSIS ===");
const decoded4 = decodeMonologueParameters(dump4.rawData);
console.log("isValid:", decoded4.isValid);
console.log("drive:", decoded4.drive);
console.log("oscillators:", !!decoded4.oscillators);
console.log("filter:", !!decoded4.filter);
console.log("envelope:", !!decoded4.envelope);
console.log("lfo:", !!decoded4.lfo);
console.log("misc:", !!decoded4.misc);
console.log("Error:", decoded4.error);

console.log("\n=== COMPARISON WITH WORKING DUMP2 ===");
const dump2 = require("./src/lib/sysex/tests/data/dumps/dump2.json");
const decoded2 = decodeMonologueParameters(dump2.rawData);
console.log("Dump2 isValid:", decoded2.isValid);
console.log(
  "Dump2 has all sections:",
  !!decoded2.drive &&
    !!decoded2.oscillators &&
    !!decoded2.filter &&
    !!decoded2.envelope &&
    !!decoded2.lfo &&
    !!decoded2.misc
);
