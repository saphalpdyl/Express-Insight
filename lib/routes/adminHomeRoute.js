import path from "path";
import fs from "fs";

import hbs from "hbs";

import { 
  createFolder,
  getSystemMonthYear
} from "../utils.js";

import {
  initializeDB,
  getAllLogsFromDB,
} from "../helpers/index.js";

export default function adminHomeRoute(settings) {
  const basePath = settings.basePath;
  const logFolderName = settings.logFolderName;
  const logFolderPath = path.join(basePath, logFolderName);

  let monthYearString = getSystemMonthYear();
  let monthYearLogFolderPath = path.join(logFolderPath, monthYearString);

  // Handle creating the log folder if not available 
  createFolder(logFolderPath);

  // Create a writable stream for today's log file
  let _ = fs.createWriteStream(path.join(monthYearLogFolderPath,`${(new Date()).toLocaleDateString().split("/").join("_")}.log`), {
    flags: "a",
  });

  const logDB = initializeDB(logFolderPath, settings.dbFileName);

  return (req, res) => {
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
    const todayData = getAllLogsFromDB(logDB);
    
    res.render("admin_home.hbs", {
      config: settings,
    });
  }
}