// ∞
// anmd_taper.jsx
// Copyright (c) 2016 animade. All rights reserved.
// www.animade.tv
// 
// Name:  anmd_taper
// Version: See Var
// 
// Description:
// This is the starting block for the animade tool popups
// 

// anmd_scriptName()
// 
// Description:
// This function contains the main logic for this script.
// 
// Parameters:
// thisObj - "this" object.
// 
// Returns:
// Nothing.
//

// Globals

var anmd_taper_Data = new Object();	// Store globals in an object

// Set the version
anmd_taper_Data.scriptName = 'Animade Tools - Taper';
anmd_taper_Data.version = '1.0.0';

writeLn(anmd_taper_Data.scriptName + " - " + anmd_taper_Data.version);

anmd_taper_Data.comp = app.project.activeItem;
anmd_taper_Data.onOff = true;

// Expressions
anmd_taper_Data.ex_1 = "";

// Names
anmd_taper_Data.taperGroupName = "Animade Taper";

// Errors
anmd_taper_Data.noPathSel = "Select a path to taper";
anmd_taper_Data.tapersOn = "Tapers turned off";
anmd_taper_Data.tapersOff = "Tapers turned on";

anmd_taper_Data.exists = false;

anmd_taper_Data.taperLayers = [];

anmd_taper_Data.anmd_taper_stepsForward = 1;
anmd_taper_Data.anmd_taper_stepsForward = 1;

if (anmd_taper_Data.comp){

	app.beginUndoGroup("Run Animade Taper");
		


	// 1 - If a path is selected then add a tracking Null - else if it already has one then reconnect it along with any others in the comp
	if (anmd_taper_Data.comp.selectedProperties[0]) {

	}
	// 2 - Else if no path selected look for taper layers and toggle on / off
	else
	{
	
		// Look for taper layer and add to taperLayers array
		var allLayers = anmd_taper_Data.comp.layers;
		for (var i=1; i <= allLayers.length; i++) {
			if (allLayers[i].comment == 'taper') {
				anmd_taper_Data.taperLayers.push(allLayers[i]);
			}
		}		
		
		if(anmd_taper_Data.taperLayers.length > 0){
			anmd_taper_Data.exists = true;
		}else{
			anmd_taper_Data.exists = false;
		}

		// 2.1 if taper layer found
		if(anmd_taper_Data.exists == true){
			
			// on or off? Get from first in array
			anmd_taper_Data.onOff = anmd_taper_Data.taperLayers[0].enabled;

			var taperedLayers = anmd_taper_Data.taperLayers;
			for (var i=0; i < taperedLayers.length; i++) {

				// 2.1.1 - If tapers off then turn on
				if(anmd_taper_Data.onOff == true){	
					anmd_taper_Data.taperLayers[i].enabled = false;
					writeLn(anmd_taper_Data.tapersOn);
				}
				// 2.1.2 - Else if tapers on then turn off
				else{
					anmd_taper_Data.taperLayers[i].enabled = true;
					writeLn(anmd_taper_Data.tapersOff);
				}	
			
			}

		}
		// 2.2 else if no taper layer found
		else
		{
			writeLn(anmd_taper_Data.noPathSel);
		}
	}
}

function lookforPropertyAndReturnInArray(arrayToSearch, searchTerm){

	var a = [1,1];
	
	for (var i=1; i <= arrayToSearch.length; i++) {
		propertyName = arrayToSearch[i].name;
		results = propertyName.indexOf(searchTerm);
		//writeLn(layerName + " - " + i);

		if (results > -1) {
			
			a.push(arrayToSearch[i])

		}
	}	

	return a;

}

// function anmd_taper_findTrackingNulls(){
	
// 	var allLayers = anmd_taper_Data.comp.layers;
// 	var layerName;
// 	var results;

// 	// Look for shape Layer
// 	for (var i=1; i <= allLayers.length-1; i++) {

// 		// continue if this is not a shape layer
// 		if (allLayers[i].type) {}

// 		layerName = allLayers[i].name;
// 		results = layerName.indexOf(anmd_taper_Data.taperGroupName);
// 		//writeLn(layerName + " - " + i);

// 		if (results > -1) {
			
// 			anmd_taper_Data.taperLayers.push(allLayers[i])

// 		}

// 	}

// 	if(anmd_taper_Data.trackerLayers.length > 0){
// 		return true;
// 	}else{
// 		return false;
// 	}

// }
