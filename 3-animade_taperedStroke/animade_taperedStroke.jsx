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
anmd_taper_Data.scriptName = 'Animade Tools - Onion Skin';
anmd_taper_Data.version = '1.0.0';

writeLn(anmd_taper_Data.scriptName + " - " + anmd_taper_Data.version);

anmd_taper_Data.comp = app.project.activeItem;
anmd_taper_Data.onOff = true;
anmd_taper_Data.ex_1 = "";
anmd_taper_Data.layerName = "Onion Skin";
anmd_taper_Data.exists = false;

anmd_taper_Data.anmd_taper_stepsForward = 1;
anmd_taper_Data.anmd_taper_stepsForward = 1;

if (anmd_taper_Data.comp){

	// Is there an onion layer target layer
	var allLayers = anmd_taper_Data.comp.layers;
	var onionLayer;
	var steps;

	// Look for onion Layer
	for (var i=1; i <= allLayers.length; i++) {
		if (allLayers[i].name == anmd_taper_Data.layerName) {
			anmd_taper_Data.exists = true;
			onionLayer = allLayers[i];
			break;
		}else{
			anmd_taper_Data.exists = false;
		}
	}

	// Create if it does not exist
	if(!anmd_taper_Data.exists){
		onionLayer = anmd_taper_Data.comp.layers.addSolid([240,240,90], "Onion Skin", anmd_taper_Data.comp.width, anmd_taper_Data.comp.height,1);;
		onionLayer.name = anmd_taper_Data.layerName;
		onionLayer.startTime = 0;
		onionLayer.adjustmentLayer = true;
		onionLayer.locked = false;	
		onionLayer.label = 2;	
		onionLayer.shy = true;	
		onionLayer.property("Effects").addProperty("CC Wide Time");
		allLayers = anmd_taper_Data.comp.layers;
		onionLayer.moveBefore(allLayers[1]);
	}else{
		onionLayer.enabled = !onionLayer.enabled;
		onionLayer.moveBefore(allLayers[1]);
	}

}
