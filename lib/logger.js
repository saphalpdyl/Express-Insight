import path from "path";
import fs from "fs";

import { v4 as uuidv4 } from "uuid";

import {
  DEFAULT_LOG_FOLDER,
} from "./constants/index.js";

import {
  saveLogRequestEntry,
  saveLogResponseEntry,
} from "./helpers.js";

import {
  createFolder,
  getSystemMonthYear,
  checkIfFolderExists,
} from "./utils.js";

const logger = function(settings) {
  if ( !settings ) throw new Error("[settings.missing] Please send a configuration as an argument.")
  
  const basePath = settings.basePath || process.cwd();
  const logFolderName = settings.logFolderName || DEFAULT_LOG_FOLDER;
  const logFolderPath = path.join(basePath, logFolderName);

  let monthYearString = getSystemMonthYear();
  let monthYearLogFolderPath = path.join(logFolderPath, monthYearString);

  // Handle creating the log folder if not available 
  createFolder(logFolderPath);

  // Create a writable stream for today's log file
  let requestLogStream = fs.createWriteStream(path.join(monthYearLogFolderPath,`${(new Date()).toLocaleDateString().split("/").join("_")}.log`), {
    flags: "a",
  });
    
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

    // Creating the respective monthly log folder if it does not exists
    if ( monthYearString != getSystemMonthYear() ) {
      // Reopning the file since the date changed
      requestLogStream = fs.createWriteStream(path.join(monthYearLogFolderPath,`${(new Date()).toLocaleDateString().split("/").join("_")}.log`), {
        flags: "a",
      });
    }
    monthYearString = getSystemMonthYear();
    monthYearLogFolderPath = path.join(logFolderPath, monthYearString);
    if (!checkIfFolderExists(monthYearLogFolderPath)) createFolder(monthYearLogFolderPath);

    const requestId = uuidv4();

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

    const requestStart = Date.now();
    
    req._requestInfo = requestInfo;

    // Do something with the request info
    saveLogRequestEntry(requestInfo, requestLogStream);

    res.on('finish', () => {
      const responseId = uuidv4();
      
      const responseInfo = {
        requestId,
        responseId,
        timestamp: new Date().toISOString(),
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: Date.now() - requestStart,
        responseBody: JSON.stringify(res.body),
        responseHeaders: res.getHeaders(),
        headers: {
          userAgent: req.get('User-Agent'),
          contentType: req.get('Content-Type'),
          authorization: req.get('Authorization') ? '[REDACTED]' : undefined,
          referer: req.get('Referer'),
          xForwardedFor: req.get('X-Forwarded-For'),
        },
      }

      saveLogResponseEntry(responseInfo, requestLogStream);
    })

    next();
  };
}

export default logger;