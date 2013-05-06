require([

  // Libs
  "jquery",
  
  //modules
  "IRT",
],

function($, IRT) {
	
	var S = "$ab$raca$dabra";
	var irt = new IRT(S);
	
	irt.removeWord("raca");
	irt.addWord("raca", 2);
	irt.end("");
	
//	var S2 = "$This$is$the$first$demo$.";
//	var irt2 = new IRT(S2);
	
//	irt2.removeWord("first");
//	irt2.addWord("second", 4);
//	irt2.end("");
	
//	var S3 = "$This$is$the$second$demo$.";
//	var irt3 = new IRT(S3);
//	irt3.end("Should be the same as the previous one after add word \"second\".");
});
