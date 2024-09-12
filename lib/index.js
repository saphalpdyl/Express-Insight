import logger from "./logger.js";
import { Router } from "express";

function setupExpressInsight(expressApp, settings) {
  expressApp.set('views', "views");
  expressApp.set('view engine', 'hbs');

  const adminRouter = Router();
  
  adminRouter.get("/admin", (req, res) => {
    // Render Handle bar page
  });
  
  expressApp.use(settings.adminURL || '/express_insight', adminRouter)
  expressApp.use(logger(settings));
}

export default setupExpressInsight;