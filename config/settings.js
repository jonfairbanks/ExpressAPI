if(!process.env.SESSION_SECRET){ console.warn("SESSION_SECRET not passed. Using a default value."); }
const	secret = process.env.SESSION_SECRET || "MySessionSecret";

module.exports = {
  'secret': secret
};