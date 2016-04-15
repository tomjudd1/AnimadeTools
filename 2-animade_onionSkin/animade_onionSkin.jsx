// ∞
// anmd_onion.jsx
// Copyright (c) 2016 animade. All rights reserved.
// www.animade.tv
// 
// Name:  anmd_onion
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

var anmd_onion_Data = new Object();	// Store globals in an object

// Set the version
anmd_onion_Data.scriptName = 'Animade Tools - Onion Skin';
anmd_onion_Data.version = '1.0.0';

writeLn(anmd_onion_Data.scriptName + " - " + anmd_onion_Data.version);

anmd_onion_Data.comp = app.project.activeItem;
anmd_onion_Data.onOff = true;
anmd_onion_Data.ex_1 = "";
anmd_onion_Data.layerName = "Animade Onion Skin";
anmd_onion_Data.exists = false;

anmd_onion_Data.anmd_onion_stepsForward = 1;
anmd_onion_Data.anmd_onion_stepsForward = 1;

if (anmd_onion_Data.comp){
	app.beginUndoGroup("Run Animade Onion Skin");

	// Is there an onion layer target layer
	var allLayers = anmd_onion_Data.comp.layers;
	var onionLayer;
	var steps;

	// Look for onion Layer
	for (var i=1; i <= allLayers.length; i++) {
		if (allLayers[i].name == anmd_onion_Data.layerName) {
			anmd_onion_Data.exists = true;
			onionLayer = allLayers[i];
			break;
		}else{
			anmd_onion_Data.exists = false;
		}
	}

	// Create if it does not exist
	if(!anmd_onion_Data.exists){
		onionLayer = anmd_onion_Data.comp.layers.addSolid([240,240,90], "Onion Skin", anmd_onion_Data.comp.width, anmd_onion_Data.comp.height,1);;
		onionLayer.name = anmd_onion_Data.layerName;
		onionLayer.startTime = 0;
		onionLayer.adjustmentLayer = true;
		onionLayer.label = 0;	
		onionLayer.shy = true;	
		onionLayer.guideLayer = true;
		onionLayer.property("Effects").addProperty("CC Wide Time");
		allLayers = anmd_onion_Data.comp.layers;
		onionLayer.moveBefore(allLayers[1]);
		onionLayer.locked = true;
	}else{
		onionLayer.locked = false;
		onionLayer.enabled = !onionLayer.enabled;
		onionLayer.moveBefore(allLayers[1]);
		onionLayer.locked = true;
	}

}
