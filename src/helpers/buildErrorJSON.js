/**
 * Build a error message and send.
 * @param { Express.Response } res The Response object.
 * @param { Number } statusCode The status code.
 * @param { String } message Error message.
 */
function buildErrorJSON(res, statusCode, message) {
  res.status(statusCode).json({
    statusCode,
    message,
  });
}

module.exports = buildErrorJSON;
