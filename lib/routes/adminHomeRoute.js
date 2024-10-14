import path from "path";
import fs from "fs";

import hbs from "hbs";

import { 
  createFolder,
  getSystemMonthYear,
  generateLogFilePath,
} from "../utils.js";

import {
  initializeDB,
  getAllLogsFromDB,
  readLogFile,
  generateRecentAPIActivityChartData,
  getAverageResponseTime,
  getRequestLogsRowsFromDB,
  getAverageRequestPerDay,
  getAverageResponseSize,
  } from "../features/logging/index.js";

export default function adminHomeRoute(settings, isErrorPluginEnabled) {
  const basePath = settings.basePath;
  const logFolderName = settings.logFolderName;
  const logFolderPath = path.join(basePath, logFolderName);

  let monthYearString = getSystemMonthYear();
  let monthYearLogFolderPath = path.join(logFolderPath, monthYearString);

  // Handle creating the log folder if not available 
  createFolder(logFolderPath);
  createFolder(monthYearLogFolderPath)

  // Create a writable stream for today's log file
  let _ = fs.createWriteStream(generateLogFilePath(monthYearLogFolderPath, new Date()), {
    flags: "a",
  });

  const logDB = initializeDB(logFolderPath, settings.dbFileName);

  return (req, res) => {
    // Extracting query
    const {
      datetime_from: datetimeFrom,
      datetime_to: datetimeTo,
      error,
    } = req.query;

    // Render Handle bar page
    hbs.registerHelper('isObject', function(value) {
      return typeof value === 'object' && value !== null && !Array.isArray(value);
    });
    
    hbs.registerHelper('eachProperty', function(context, options) {
      var ret = "";
      for(var prop in context)
      {
          ret = ret + options.fn({property:prop,value:context[prop]});
      }
      return ret;
    });

    // Getting all logs from today from DB
    const [requestLogs, responseLogs] = getAllLogsFromDB(logDB);

    const latestRequestLog = requestLogs[requestLogs.length - 1]
    const latestResponseLog = responseLogs[responseLogs.length - 1]

    const logFileResponse = readLogFile(generateLogFilePath(monthYearLogFolderPath, new Date()));

    // Charts data
    const activityData = generateRecentAPIActivityChartData(logDB);
    const avgResponseTime = getAverageResponseTime(logDB, datetimeFrom, datetimeTo);
    const avgRequestsPerDay = getAverageRequestPerDay(logDB);
    const avgResponseSize = getAverageResponseSize(logDB);

    const requestRows = getRequestLogsRowsFromDB(logDB, datetimeFrom, datetimeTo);
    
    res.render("admin_home.hbs", {
      config: settings,
      requestLogs,
      responseLogs,
      latestRequestLog,
      latestResponseLog,
      logFile: logFileResponse,
      activityData: encodeURIComponent(JSON.stringify(activityData)),
      avgResponseTime,
      requestRows: encodeURIComponent(JSON.stringify(requestRows)),
      avgRequestsPerDay,
      avgResponseSize,
      isErrorPluginEnabled,
      error: req.query.error,
      query_datetimefrom: datetimeFrom,
      query_datetimeto: datetimeTo,
    });
  }
}