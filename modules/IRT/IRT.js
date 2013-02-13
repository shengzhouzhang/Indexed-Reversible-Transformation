define([

  // Libs
  "jquery",
],

function($, Backbone) {
	
  var line_count = 0;
  var print = function(content) {
	  $("<li>").addClass("L"+line_count).css("color", "#444").html(content).appendTo("ol.linenums");
	  line_count++;
  }
	
  var IRT = function(inputString) {
	  
	  // store the length of inputString.
	  var S_len = inputString.length;
	  
	  print("----  " + JSON.stringify(inputString) + "  ----");
	  
	  // a list object to store rotates.
	  var temp = [inputString];
	  
	  // get all rotates from inputString.
	  var rotate = function(temp) {
		  
		  var length = temp.length;
		  
		  if(length === 0)
			  return;
		  
		  var retated = temp[length-1].substring(1) + temp[length-1].substring(0, 1);
		  
		  if(retated === temp[0])
			  return;
		  
		  temp.push(retated);
		  
		  rotate(temp);
	  }
	  
	  // sort all rotates.
	  var sort = function(temp) {
		  
		  var first_N = [];
		  var rest = []; 
		  
		  (function(temp, first_N, rest) {
			  for(var i = 0; i < temp.length; i++) {
				  if(temp[i].charAt(S_len-1) === "$")
					  first_N.push(temp[i]);
				  else
					  rest.push(temp[i]);
			  }
		  })(temp, first_N, rest);
		  
		  rest.sort(function(a, b) {
			  
			  var pos = S_len;
			  
			  do {
				  pos--;
				  
				  if(pos < 0)
					  return 0;
				  
				  var ac = a.charAt(pos);
				  var bc = b.charAt(pos);
				  
				  if(ac < bc)
					  return -1;
				  if(ac > bc)
					  return 1;
				  
			  }while(ac === bc)
		  });
		  
		  return first_N.concat(rest);
	  }
	  
	  // get the first column.
	  var IRT_F = function(temp) {
		  
		  var chars = [];
		  
		  for(var i = 0; i < temp.length; i++){
			  chars.push(temp[i].charAt(0));
		  }
		  
		  return chars;
	  }
	  
	  // get the last column.
	  var IRT_L = function(temp) {
		  
		  var chars = [];
		  var pos = S_len - 1;
		  
		  for(var i = 0; i < temp.length; i++){
			  chars.push(temp[i].charAt(pos));
		  }
		  
		  return chars;
	  }
	  
	  
	  
	  rotate(temp);
	  var result = sort(temp);				//all rotates after sort
	  var first_column = IRT_F(result);		//first column
	  var last_column = IRT_L(result);		//last column
	  
	  // get occurrence
	  var getOcc = function(first) {
		  
		  var occ = {count: 0};
		  
		  for(var i = 0; i < first.length; i++) {
			  var char = first[i];
			  if(typeof occ[char] === "undefined") {
				  occ[char] = {count: 0};
				  occ["count"]++;
			  }
			  occ[char]["count"]++;
			  occ[char][i] = occ[char]["count"];
		  }
		  return occ;
	  };
	  
	  // find index on last column by the character and its index on first column
	  var mapping = function(char, index, occurence) {
		  
		  var pos = 0;
		  
		  for(var key in occurence) {
			 if(key !== "count" && key < char) 
				 pos += occurence[key].count;
		  }
		  
		  if(typeof occurence[char][index] === "undefined") {
			  var count = 0;
			  for(var item in occurence[char]) {
				  
				  if(item !== "count"){
					 count++;
					 if(item > index) {
						 pos += occurence[char][item] - 1;
						 break;
					 }
				  }
				  // last one
				  if(count === occurence[char]["count"]) {
					  if(item == index)
						  pos += occurence[char][item] - 1;
					  else
						  pos += occurence[char][item];
					  break;
				  }
				  
				 
			  }  
		  }else
			  pos += occurence[char][index] - 1;
		  
		  return pos;
	  };
	  
	  // search word , return a list of positions
	  var search = function(first, last, keyword, occurence) {
		  
		  var index = -1;
		  var char
		  var track = [];
		  
		  for(var i = 0; i < keyword.length; i++) {
			  
			  char = keyword.charAt(i);
			  
			  
			  if(i === 0) {
				  for(var j = 0; j < first.length; j++) {
					  if(first[j] === char) {
						  if(i === 0 && last[j] !== "$")
							  return track;
						  else {
							  track.push(j);
							  index = mapping(char, j, occurence);
							  track.push(index);
							  break;
						  }
							  
					  }
					  if(j === first.length - 1)
						  return track;
				  }
			  }else {
				  if(char !== first[index])
					  return track;
				  index = mapping(char, index, occurence);
				  track.push(index);
			  }
		  }
		  
		  return track;
	  }
	  
	  // remove a word
	  var remove = function(word, first, last) {
		  
		  var occurence = getOcc(first);	// calculate the occurence
		  
		  var track = search(first, last, word, occurence);	// store all positions in which should remove character
		  var new_first = [];
		  var new_last = [];
		  
		  if(track.length - 1 !== word.length)
			  return;
		  
		  // create a new first and last column without removed word
		  for(var i = 0; i < first.length; i++) {
			  if(track.indexOf(i) < 0) {
				  new_first.push(first[i]);
				  new_last.push(last[i]);
			  }
		  }
		  
		  // deep copy the new columns to the old ones
		  first.splice(0, first.length);
		  last.splice(0, last.length);
		  for(i = 0; i < new_first.length; i++) {	  
			  first.push(new_first[i]);
			  last.push(new_last[i]);
		  }
	  }
	  
	  // add a word
	  var add = function(word, position, first, last) {
		  
		  
		  var occurence = getOcc(first);		// calculate the occurence
		  var track = [];	// store all positions in which should insert character
		  var index;		
		  
		  for(var i = 0; i < word.length; i++) {
			  
			  var char = word.charAt(i);

			  if(i === 0) {
				  index = position - 1; // mapping to index should reduce 1
				  track.push(index);	// store first position
			  }
			
			  if(typeof occurence[char] !== "undefined") {
				  index = mapping(char, index, occurence);
				  track.push(index); 	// store position
			  }else {
				  for(var j = 0; j < last.length; j++) {
					  if(last[j] < char)
						  continue;
					  index = j;
					  track.push(index);	// store position
					  break;
				  }
			  }
		  }
		  
		  // after this, we have find all positions
		  
		  var done  = [];
		  var offset;
		  for(var k = 0; k < track.length; k++){
			  
			  offset = 0;
			  
			  for(var n = 0; n < done.length; n++) {
				  if(done[n] <= track[k])
					  offset++;		// the position should add 1 if any character inserted before it
			  }
			  if(k === track.length - 1)
				  first.splice(track[k] + offset, 0, "$");	// add "$"
			  else
				  first.splice(track[k] + offset, 0, word.charAt(k));
			  if(k === 0)
				  last.splice(track[k] + offset, 0, "$");	// add "$"
			  else
				  last.splice(track[k] + offset, 0, word.charAt(k-1));
			  
			  done.push(track[k]);
		  }
	  }
	  
	  print(JSON.stringify(first_column, null, ""));
	  print(JSON.stringify(last_column, null, ""));
	  
	  // public method of remove a word
	  this.removeWord = function(word) {
		  print("Remove " + JSON.stringify(word));
		  remove(word, first_column, last_column);
		  print(JSON.stringify(first_column, null, ""));
		  print(JSON.stringify(last_column, null, ""));
	  };
	  
	  // public method of add a word
	  this.addWord = function(word, position) {
		  print("Add " + JSON.stringify(word) + " at position " + position);
		  add(word, position, first_column, last_column);
		  print(JSON.stringify(first_column, null, ""));
		  print(JSON.stringify(last_column, null, ""));
	  }  
	  
	  this.end = function(message) {
		  print(message);
	  }
	  
	  
  };
  
  return IRT;
});
