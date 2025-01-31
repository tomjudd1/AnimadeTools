﻿// ∞
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

anmd_taper_Data.comps = app.project.items;
anmd_taper_Data.comp = app.project.activeItem;
anmd_taper_Data.onOff = true;

// Expressions
anmd_taper_Data.ex_1 = "";

// Names
anmd_taper_Data.taperGroupName = "Animade Taper";

anmd_taper_Data.searchTerm = "Taper";
// Errors
anmd_taper_Data.noPathSel = "Select a path to taper";
anmd_taper_Data.tapersOn = "Tapers turned off";
anmd_taper_Data.tapersOff = "Tapers turned on";

anmd_taper_Data.exists = false;

anmd_taper_Data.taperComps = [];
anmd_taper_Data.taperLayers = [];

anmd_taper_Data.anmd_taper_stepsForward = 1;
anmd_taper_Data.anmd_taper_stepsForward = 1;

if (anmd_taper_Data.comp){

	app.beginUndoGroup("Run Animade Taper");
		
	// Look for comps with tapered layers in em!
	var allComps = anmd_taper_Data.comps;

	alert(allComps.length);

	for (var i=1; i <= allComps.length; i++) {

		if (allComps[i].label == 13) {		 

			var thisComp = allComps[i];
			// Look for taper layer and add to taperLayers array
			var allLayers = thisComp.layers;
			for (var j=1; j <= allLayers.length; j++) {
				if (allLayers[j].label == 13) {

					anmd_taper_Data.taperLayers.push(allLayers[j]);
				}
			}	
			
		}
	}	

	// 1 - If a path is selected then add a tracking Null - else if it already has one then reconnect it along with any others in the comp
	if (anmd_taper_Data.taperLayers.length <= 0) {
		writeLn('no tapers found');
	}
	// 2 - Else if no path selected look for taper layers and toggle on / off
	else
	{


			// on or off? Get from first in array - Had
			anmd_taper_Data.onOff = anmd_taper_Data.taperLayers[0].enabled;

			var taperedLayers = anmd_taper_Data.taperLayers;
			for (var i=0; i < taperedLayers.length; i++) {

				// iterate through properties
				taperedLayers[i].property("ADBE Root Vectors Group")

				//var numProps = rootProp.numProperties;
				writeLn(" - "+rootProp);

				// for (var j=0; j <= numProps; j++) {

				// 		//propName = rootProp[j].name;
				// 		results = propName.indexOf(anmd_taper_Data.taperGroupName);
				// 		writeLn(" - " + j);

				// 		if (results > -1) {
							
						
				// 		}

				// }


				// 2.1.1 - If tapers off then turn on
				if(anmd_taper_Data.onOff == true){	
					anmd_taper_Data.taperLayers[i].enabled = false;
					//writeLn("taper layer shown");
				}
				// 2.1.2 - Else if tapers on then turn off
				else{
					anmd_taper_Data.taperLayers[i].enabled = true;
					//writeLn("taper layer hidden");
				}	
			
			}

	}
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
