// ∞
//
// anmd_loopKeys.jsx
// Copyright (c) 2016 animade. All rights reserved.
// www.animade.tv
// 
// Name:  anmd_loopKeys
// Version: 1.0.0
// 
// Description:
// Loop out keyframe animation with a click of a button
// 

// Globals

var anmd_loopKeys_Data = new Object();	// Store globals in an object

anmd_loopKeys_Data.comp = app.project.activeItem;

// Expressions
anmd_loopKeys_Data.ex_1 = 
	"// get time of first key\n"+
	"firstKeyTime = key(1).time;\n"+
	"\n"+
	"// get time of last frame\n"+
	"lastKeyTime = key(numKeys).time;\n"+
	"\n"+
	"// get duration of movment\n"+
	"durationOfMovment = lastKeyTime  - firstKeyTime;\n"+
	"\n"+
	"// set value\n"+
	"valueAtTime( ((time - firstKeyTime) % durationOfMovment) + firstKeyTime );\n"+
	"\n"
	;

// Alerts
anmd_loopKeys_Data.alertNoPropertySelected = "Please selected a property to loop. eg 'Path'";
anmd_loopKeys_Data.alertNoKeys = "You need more than 1 keyframe to loop";
anmd_loopKeys_Data.alertAlreadyHasExpression = "I don't want to overwrite the current expression on this property";

if (anmd_loopKeys_Data.comp){

		// Set target layer
		var targetLayer = anmd_loopKeys_Data.comp.selectedLayers[0];

		// Set target property
		var targetProp = targetLayer.selectedProperties[0];

		// Dont allow multiple properties. Just pick the first one
		if(targetLayer.selectedProperties.length>1){
			targetProp = targetLayer.selectedProperties[1];
		}else if(targetLayer.selectedProperties.length<=0){
			alert(anmd_loopKeys_Data.alertNoPropertySelected);
		}

		if(!targetProp.expression){
			if(targetProp.numKeys > 1){
				targetProp.expression = anmd_loopKeys_Data.ex_1;
			}else{
				alert(anmd_loopKeys_Data.alertNoKeys);
			}
		}else{
			alert(anmd_loopKeys_Data.alertAlreadyHasExpression);
		}

}



