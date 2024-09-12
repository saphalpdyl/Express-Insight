import {
  DEFAULT_LOG_FOLDER,
} from "./constants/index.js";

const logger = function(settings) {
  if ( !settings ) throw new Error("[settings.missing] Please send a configuration as an argument.")
  
  const basePath = settings.basePath || process.cwd();
  const logFolderName = settings.logFolderName || DEFAULT_LOG_FOLDER;
    
  return function(req, res, next) {
    const oldWrite = res.write;
    const oldJson = res.json;
    const oldEnd = res.end;

    const buffers = [];

    res.json = function(body) {
      res.body = body;
      return oldJson.call(this, body);
    }
    
    res.write = function(bufferChunk) {
      buffers.push(Buffer.from(bufferChunk));
      oldWrite.apply(res, arguments);
    }

    res.end = function(bufferChunk) {
      if ( bufferChunk ) {
        buffers.push(Buffer.from(bufferChunk));
      }

      oldEnd.apply(res, arguments);
    }

    const requestInfo = {
      requestId,
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      queryParams: req.query,
      headers: {
        userAgent: req.get('User-Agent'),
        contentType: req.get('Content-Type'),
        authorization: req.get('Authorization') ? '[REDACTED]' : undefined,
        referer: req.get('Referer'),
        xForwardedFor: req.get('X-Forwarded-For'),
      },
      clientIp: req.ip,
      requestBody: req.method === 'GET' ? undefined : JSON.stringify(req.body),
    };

    // Do something with the request info

  };
}

export default logger;