'use strict';

exports.handler = (event) => {
  const request = event.Records[0].cf.request;
  const uri = request.uri;
  if (!uri.includes('.')) {
    request.uri += '.html';
  }
  return request;
};
