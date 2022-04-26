"use strict";

const { logger } = require("../logger");
const { contactCreate } = require("./contact");

const JWT = require("../lib/jwtDecoder.js");

exports.logExecuteData = [];

/**
 * POST Handler for /validate/ route of Activity.
 * Called when Journey Builder wants you to validate the configuration to ensure the configuration is valid.
 *
 * @return {[type]}
 * 200 - Return a 200 iff the configuraiton is valid.
 * 30x - Return if the configuration is invalid (this will block the publish phase)
 * 40x - Return if the configuration is invalid (this will block the publish phase)
 * 50x - Return if the configuration is invalid (this will block the publish phase)
 */
exports.validate = function (req, res) {
  console.log("debug: /validate");
  logData(req);
  return res.status(200).json({
    // can be empty object or with any property
    // action: 'Validate',
    // success: true,
  });
};

// ```````````````````````````````````````````````````````
// BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
//
// CONFIGURATION
// ```````````````````````````````````````````````````````
// Reference:
// https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/interaction-operating-states.htm

/**
 * POST Handler for /publish/ route of Activity.
 * Called when a Journey has been published.
 * This is when a journey is being activiated and eligible for contacts to be processed.
 *
 * @return {[type]}     [description]
 * 200 - Return a 200 iff the configuraiton is valid.
 * 30x - Return if the configuration is invalid (this will block the publish phase)
 * 40x - Return if the configuration is invalid (this will block the publish phase)
 * 50x - Return if the configuration is invalid (this will block the publish phase)
 */
exports.publish = function (req, res) {
  console.log("debug: /publish");
  logData(req);
  return res.status(200).json({
    // action: 'Publish',
  });
};

/**
 * POST Handler for /save/ route of Activity.
 * Called when a journey is saving the activity
 *
 * @return {[type]}     [description]
 * 200 - Return a 200 iff the configuraiton is valid.
 * 30x - Return if the configuration is invalid (this will block the publish phase)
 * 40x - Return if the configuration is invalid (this will block the publish phase)
 * 50x - Return if the configuration is invalid (this will block the publish phase)
 */
exports.save = function (req, res) {
  console.log("debug: /save");
  logData(req);
  return res.status(200).json({
    // action: 'Save',
  });
};

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
  console.log("debug: /edit");
  logData(req);
  return res.status(200).json({
    // action: 'Edit',
  });
};

// ```````````````````````````````````````````````````````
// BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
//
// EXECUTING JOURNEY
// ```````````````````````````````````````````````````````

/**
 * POST Handler for /execute/ route of Activity.
 * Called when a contact is flowing through the Journey.
 *
 * @return {[type]}
 * 200 - Processed OK
 * 3xx - Contact is ejected from the Journey.
 * 4xx - Contact is ejected from the Journey.
 * 5xx - Contact is ejected from the Journey.
 */
exports.execute = function (connection) {
  return async function (req, res) {
    console.log("debug: /execute");
    logData(req);

    // const decoded = req.body; // without JWT

    let decoded;
    try {
      decoded = JWT(req.body, process.env.JWT_SECRET);
      // verification error -> unauthorized request
    } catch (err) {
      console.error("JWT error: ", err);
      logger.error(err);
      return res.status(401).end();
    }

    const errResponse = (err) => {
      // Fail the contact.
      // return res.status(500).json({ branchResult: "invalid_code" });
      logger.error(err);
      // return res.status(400).send(err);
      return res.status(400).json({
        // branchResult: "invalid_code",
        message: err,
      });
    };

    if (
      decoded?.inArguments?.length === 0 ||
      !getInArgument(decoded.inArguments, "RecordTypeId")
    ) {
      const err = new Error("inArguments invalid.");
      console.error(err);
      return errResponse(err);
    }

    try {
      const body = parseArguments(decoded?.inArguments);
      await contactCreate(connection, body);
      return res.status(200).json({
        // action: 'Execute',
      });
      // return res.status(200).json({branchResult: 'no_error'});
    } catch (err) {
      console.error(err);
      return errResponse(err);
    }
  };
};

/**
 * Called when a Journey is stopped.
 *
 * @return {[type]}
 */
exports.stop = function (req, res) {
  console.log("debug: /stop");
  logData(req);
  return res.status(200).json({
    // action: 'Stop',
  });
};

/**
 * Data from the req and put it in an array accessible to the main app
 */
function logData(req) {
  logger.info(req.url);
  const logData = {
    body: req.body,
    headers: req.headers,
    trailers: req.trailers,
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    route: req.route,
    cookies: req.cookies,
    ip: req.ip,
    path: req.path,
    host: req.hostname,
    fresh: req.fresh,
    stale: req.stale,
    protocol: req.protocol,
    secure: req.secure,
    originalUrl: req.originalUrl,
  };
  exports.logExecuteData.push(logData);
  console.log("logData:");
  console.log({
    ...logData,
    // util.inspect(req.body)
    // util.inspect(req.params)
    // util.inspect(req.query)
  });
}

/**
 * Find the in argument
 */
function getInArgument(inArguments, argumentName) {
  if (inArguments) {
    for (let i = 0; i < inArguments.length; i++) {
      let obj = inArguments[i];
      if (argumentName in obj) {
        console.log("Found Argument: ", argumentName, obj[argumentName]);
        return obj[argumentName];
      }
    }
  }
  console.log("Unable To Find In Argument: ", argumentName);
}

/**
 * Convert inArguments into plain object
 */
function parseArguments(inArguments) {
  const output = {};
  if (inArguments) {
    for (let i = 0; i < inArguments.length; i++) {
      let obj = inArguments[i];
      Object.entries(obj).forEach(([key, val]) => {
        console.log("Found Argument: ", key, val);
        output[key] = val;
      });
    }
  }
  return output;
}
