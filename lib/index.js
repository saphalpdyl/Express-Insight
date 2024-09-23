import path from "path";

import express, { Router } from "express";
import hbs from "hbs";
import _ from "lodash";

import logger from "./logger.js";
import { consolePrint, generateLogLine, getFileDirName } from "./utils.js";
import { DEFAULT_SETTINGS } from "./defaultSettings.js";

import adminHomeRoute from "./routes/adminHomeRoute.js";

class ExpressInsight {
  #errorPluginCalled = false;
  #configuration = {};
  #app = null;
  
  constructor(expressApp, userDefinedSettings) {
    this.#app = expressApp;
    
    const { __dirName } = getFileDirName(import.meta.url);
    const settings = _.merge(DEFAULT_SETTINGS, userDefinedSettings);
    this.#configuration = settings;

    expressApp.use(express.static(path.join(__dirName, "public")));
    expressApp.set('views', path.join(__dirName, "views"));
    expressApp.set('view engine', 'hbs');
    
    const adminRouter = Router();
    
    hbs.registerPartials(path.join(__dirName, "views","partials"));
    
    adminRouter.get("/admin", adminHomeRoute(settings));
    
    expressApp.use((req, res, next) => {
      // throw error if error enabled in settings but the plugin is not setup
      if ( this.#configuration.error.enable && !this.#errorPluginCalled)
        throw new Error(generateLogLine("error", "[expInsight.init] error.enable == true but the error plugin is not setup. \n Maybe you forgot to instance.setupErrorPlugin() ?"))

      next();
    })
    expressApp.use(settings.adminURL || '/express_insight', adminRouter)
    expressApp.use(logger(settings));
  }

  static setupExpressInsight(expressApp, userDefinedSettings = {}) {
    return new ExpressInsight(expressApp, userDefinedSettings);
  } 

  setupErrorPlugin() {
    if ( !this.#configuration.error.enable )
      return consolePrint("warn", "[expInsight.init] .setupErrorPlugin() called, but error logging is disabled in the settings")
    
    this.#errorPluginCalled = true;

    this.#app.use((error, req, res, next) => {
      // Error handling here

      next();
    })
  }
}

export default ExpressInsight;