import logger from "./logger.js";

function setupExpressInsight(expressApp, settings) {
  expressApp.set('views', "views");
  expressApp.set('view engine', 'hbs');

  expressApp.get(settings.adminURL || "/express_insight/admin/", (req, res) => {
    // Render Handle bar page
  });
  
  expressApp.use(logger(settings));
}

export default setupExpressInsight;