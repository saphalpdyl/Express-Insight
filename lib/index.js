import path from "path";

import express, { Router } from "express";
import hbs from "hbs";
import _ from "lodash";

import logger from "./logger.js";
import { getFileDirName } from "./utils.js";
import { DEFAULT_SETTINGS } from "./defaultSettings.js";

import adminHomeRoute from "./routes/adminHomeRoute.js";

function setupExpressInsight(expressApp, userDefinedSettings) {
  const { __dirName } = getFileDirName(import.meta.url);
  const settings = _.merge(DEFAULT_SETTINGS, userDefinedSettings);
  
  expressApp.use(express.static(path.join(__dirName, "public")));
  expressApp.set('views', path.join(__dirName, "views"));
  expressApp.set('view engine', 'hbs');
  
  const adminRouter = Router();
  
  hbs.registerPartials(path.join(__dirName, "views","partials"));

  adminRouter.get("/admin", adminHomeRoute(settings));
  
  expressApp.use(settings.adminURL || '/express_insight', adminRouter)
  expressApp.use(logger(settings));
}

export default setupExpressInsight;