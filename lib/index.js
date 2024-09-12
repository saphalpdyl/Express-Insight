import logger from "./logger.js";
import express, { Router } from "express";
import { getFileDirName } from "./utils.js";
import path from "path";

function setupExpressInsight(expressApp, settings) {
  const { __dirName } = getFileDirName(import.meta.url);
  
  expressApp.use(express.static(path.join(__dirName, "public")));
  expressApp.set('views', path.join(__dirName, "views"));
  expressApp.set('view engine', 'hbs');

  const adminRouter = Router();
  
  adminRouter.get("/admin", (req, res) => {
    // Render Handle bar page
    res.render("admin_home.hbs");
  });
  
  expressApp.use(settings.adminURL || '/express_insight', adminRouter)
  expressApp.use(logger(settings));
}

export default setupExpressInsight;