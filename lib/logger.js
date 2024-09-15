import path from "path";
import fs from "fs";

import {
  createFolder,
  getSystemMonthYear,
  checkIfFolderExists,
  consolePrint,
  generateLogLine,
  generateLogFilePath,
} from "./utils.js";

import { 
  generateRequestInfo,
  generateResponseInfo,
  initializeDB,
  saveLogRequestEntry,
  saveLogRequestToDB,
  saveLogResponseEntry,
  saveLogResponseToDB,
} from "./helpers/index.js";

const logger = function(settings) {
  if ( !settings ) throw new Error(generateLogLine("error","[settings.missing] Please send a configuration as an argument."))
  if ( !settings.projectName ) consolePrint("warn", "[settings.missing] has missing name.")
  
  const basePath = settings.basePath;
  const logFolderName = settings.logFolderName;
  const logFolderPath = path.join(basePath, logFolderName);

  let monthYearString = getSystemMonthYear();
  let monthYearLogFolderPath = path.join(logFolderPath, monthYearString);

  // Handle creating the log folder if not available 
  createFolder(logFolderPath);

  // Create a writable stream for today's log file
  let logStream = fs.createWriteStream(generateLogFilePath(monthYearLogFolderPath, new Date()), {
    flags: "a",
  });

  const logDB = initializeDB(logFolderPath, settings.dbFileName);
    
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
      logStream = fs.createWriteStream(generateLogFilePath(monthYearLogFolderPath, new Date()), {
        flags: "a",
      });
    }
    monthYearString = getSystemMonthYear();
    monthYearLogFolderPath = path.join(logFolderPath, monthYearString);
    if (!checkIfFolderExists(monthYearLogFolderPath)) createFolder(monthYearLogFolderPath);

    const { requestId, requestInfo, requestStart } = generateRequestInfo(req);

    req._requestInfo = requestInfo;

    // Do something with the request info
    saveLogRequestEntry(requestInfo, logStream);
    saveLogRequestToDB(logDB, requestInfo);

    res.on('finish', () => {
      const { responseInfo } = generateResponseInfo(requestId, requestStart, req, res);
      saveLogResponseEntry(responseInfo, logStream);
      saveLogResponseToDB(logDB, responseInfo, requestInfo.requestId);
    })

    next();
  };
}

export default logger;