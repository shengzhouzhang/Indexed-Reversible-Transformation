require.config({

  deps: ["main"],

  paths: {

    // Libraries
    jquery: "../libs/jquery",
    underscore: "../libs/underscore-min",
    backbone: "../libs/backbone-min",
    bootstrap: "../libs/bootstrap/js/bootstrap.min",
    
    //Modules
    
    
    // Plugins
    ace: "../libs/ace/ace",

    // Shim Plugin
    use: "../libs/use",

  },
  
  bootstrap: {
	  deps: ["jquery"],
      attach: "$"
  },

  use: {
    backbone: {
      deps: ["use!underscore", "jquery"],
      attach: "Backbone"
    },

    underscore: {
      attach: "_"
    }
  }
});
