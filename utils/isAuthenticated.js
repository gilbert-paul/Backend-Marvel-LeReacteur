const User = require("../models/User.js");
/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise}
 */
const isAuthenticated = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      if (!req.query.token) {
        return res.status(401).json({ message: "You need to be connected" });
      }
    }
    let headersToken = "";
    let queryToken = "";
    if (req.headers.authorization) {
      headersToken = req.headers.authorization.replace("Bearer ", "");
    }
    if (req.query.token) {
      queryToken = req.query.token.replace("Bearer ", "");
    }
    let thisUser = null;
    if (headersToken) {
      thisUser = await User.findOne({ token: headersToken }).select("_id");
    } else if (queryToken) {
      thisUser = await User.findOne({ token: queryToken }).select("_id");
    }
    if (thisUser) {
      req.user = thisUser;
      return next();
    }
    return res.status(401).json({ message: "You need to be connected" });
  } catch (error) {
    return res.status(500).json({ message: "Error BDD" });
  }
};

module.exports = isAuthenticated;
