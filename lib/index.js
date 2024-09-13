import path from "path";

import express, { Router } from "express";
import hbs from "hbs";

import logger from "./logger.js";
import { getFileDirName } from "./utils.js";
import { DEFAULT_SETTINGS } from "./defaultSettings.js";

function setupExpressInsight(expressApp, userDefinedSettings) {
  const { __dirName } = getFileDirName(import.meta.url);
  const settings = {...DEFAULT_SETTINGS, ...userDefinedSettings};
  
  expressApp.use(express.static(path.join(__dirName, "public")));
  expressApp.set('views', path.join(__dirName, "views"));
  expressApp.set('view engine', 'hbs');
  
  const adminRouter = Router();
  
  adminRouter.get("/admin", (req, res) => {
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
    
    hbs.registerPartials(path.join(__dirName, "views","partials"));

    
    res.render("admin_home.hbs", {
      configurationJson: settings,
    });
  });
  
  expressApp.use(settings.adminURL || '/express_insight', adminRouter)
  expressApp.use(logger(settings));
}

export default setupExpressInsight;