import hbs from "hbs";

export default function adminHomeRoute(settings) {

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
    
    res.render("admin_home.hbs", {
      config: settings,
    });
  }
}