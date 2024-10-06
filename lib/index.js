import path from "path";

import express, { Router } from "express";
import hbs from "hbs";
import _ from "lodash";

import logger from "./logger.js";
import { checkIfFolderExists, consolePrint, generateLogFileStream, getFileDirName, getSystemMonthYear } from "./utils.js";
import { DEFAULT_SETTINGS } from "./defaultSettings.js";

import adminHomeRoute from "./routes/adminHomeRoute.js";
import { saveLogErrorEntry, saveLogErrorToDB, initializeDB } from "./features/logging/index.js";
import { mkdirSync } from "fs";

class ExpressInsight {
  #errorPluginCalled = false;
  #configuration = {};
  #app = null;
  #dbconn = null;
  #logFolderPath = null;
  #basePath = null;

  // File stream is not instaniated because the time which the filename is dependent on
  // might change mid process

  setupDirectoryandDatabase() {
    const basePath = this.#configuration.basePath;
    const logFolderName = this.#configuration.logFolderName;
    const logFolderPath = path.join(basePath, logFolderName);
    
    this.#basePath = basePath;
    this.#logFolderPath = logFolderPath;

    // Check for log directory
    if(!checkIfFolderExists(logFolderPath)) {
      // Create directory
      mkdirSync(logFolderPath);
    }

    this.#dbconn = initializeDB(logFolderPath, this.#configuration.dbFileName);
  }
  
  constructor(expressApp, userDefinedSettings) {
    this.#app = expressApp;
    
    const { __dirName } = getFileDirName(import.meta.url);
    const settings = _.merge(DEFAULT_SETTINGS, userDefinedSettings);
    this.#configuration = settings;

    expressApp.use(express.static(path.join(__dirName, "public")));
    expressApp.set('views', path.join(__dirName, "views"));
    expressApp.set('view engine', 'hbs');
    
    // Initialize folders and database to encourage Dependency injection
    this.setupDirectoryandDatabase();
    
    const adminRouter = Router();
    
    hbs.registerPartials(path.join(__dirName, "views","partials"));
    
    expressApp.use((_, __, next) => {
      // throw error if error enabled in settings but the plugin is not setup
      if ( this.#configuration.error.enable && !this.#errorPluginCalled)
        throw new Error("[expInsight.init] error.enable == true but the error plugin is not setup. \n Maybe you forgot to instance.setupErrorPlugin() ?")

      next();
    });

    adminRouter.get("/admin", adminHomeRoute(settings, this.#errorPluginCalled && this.#configuration.error.enable ));
    
    expressApp.use(settings.adminURL || '/express_insight', adminRouter);
    expressApp.use(logger(settings, this.#dbconn));
  }

  static setupExpressInsight(expressApp, userDefinedSettings = {}) {
    return new ExpressInsight(expressApp, userDefinedSettings);
  } 

  setupErrorPlugin() {
    if ( !this.#configuration.error.enable )
      return consolePrint("warn", "[expInsight.init] .setupErrorPlugin() called, but error logging is disabled in the settings")

    if ( !["boolean","function"].includes(typeof this.#configuration.error.overrideErrorPage) ) {
      throw new Error("[expInsight.init] overrideErrorPage is neither a boolean nor a function");
    }
    
    this.#errorPluginCalled = true;

    this.#app.use((error, req, res, next) => {
      const overrideErrorPage = this.#configuration.error.overrideErrorPage;
      if ( typeof overrideErrorPage == "boolean" && overrideErrorPage == true ) {
        // Show default error page here
      } else if ( typeof overrideErrorPage == "boolean" && overrideErrorPage == false ) {
        next();
        return;
      } else {
        if ( typeof overrideErrorPage == "function" ) {
          this.#configuration.error.overrideErrorPage();
          return;
        }
      }
      
      // Error handling here
      const relatedRequestId = req._requestInfo.requestId;

      // Log into the log file
      const { errorInfo } = generateErrorInfo(error, relatedRequestId, "");

      let monthYearString = getSystemMonthYear();
      let monthYearLogFolderPath = path.join(this.#logFolderPath, monthYearString);

      const logStream = generateLogFileStream(monthYearLogFolderPath, new Date());

      saveLogErrorEntry(errorInfo, req._requestInfo, logStream);

      if ( this.#configuration.error.logError )
        consolePrint("error", `${error} \n ${error.stack}` );
      
      saveLogErrorToDB(this.#dbconn, errorInfo);
    })
  }
}

export default ExpressInsight;