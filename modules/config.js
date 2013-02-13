require.config({

  deps: ["main"],

  paths: {

    // Libraries
    jquery: "../libs/jquery.min",
    underscore: "../libs/underscore.min",
    bootstrap: "../libs/bootstrap/js/bootstrap.min",
    
    //Modules
    IRT: "IRT/IRT",

  },

	shim: {
		  'bootstrap': {
			  deps: ["jquery"],
			  exports: '$'
		  }
	}
});
