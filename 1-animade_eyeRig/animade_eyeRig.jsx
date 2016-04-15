// ∞
// anmd_eyerig.jsx
// Copyright (c) 2016 animade. All rights reserved.
// www.animade.tv
// 
// Name:  anmd_eyerig
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

var anmd_eyerig_Data = new Object();	// Store globals in an object

// Set the version
anmd_eyerig_Data.scriptName = 'Animade Tools - Eyes';
anmd_eyerig_Data.version = '1.0.0';

writeLn(anmd_eyerig_Data.scriptName + " - " + anmd_eyerig_Data.version);

anmd_eyerig_Data.comp = app.project.activeItem;

// Layer Names
anmd_eyerig_Data.layerName_1 = "Pupil Control";
anmd_eyerig_Data.layerName_2 = "Eye Control";
anmd_eyerig_Data.layerName_3 = "Eye 1";
anmd_eyerig_Data.layerName_4 = "Eye 2";


// Expression Controller Names
anmd_eyerig_Data.ControllerName_1 = "Pupil Limit";
anmd_eyerig_Data.ControllerName_2 = "Pupil Size";
anmd_eyerig_Data.ControllerName_3 = "Stare at Point";
anmd_eyerig_Data.ControllerName_4 = "Focal Distance";
anmd_eyerig_Data.ControllerName_5 = "Eye Control layer";
anmd_eyerig_Data.ControllerName_6 = "Pupil Control layer";

// Layer expressions
anmd_eyerig_Data.ex_1_pupilSize = 	"L = effect('"+anmd_eyerig_Data.ControllerName_6+"')('Layer');"+	
																																			"\n"+ 
																																			"temp = L.effect('"+anmd_eyerig_Data.ControllerName_2+"')('Slider');"+
																																			"\n"+ 
																																			"[temp, temp];"
																																			;

anmd_eyerig_Data.ex_2_pupilPos = 		"followL = effect('"+anmd_eyerig_Data.ControllerName_6+"')('Layer');"+
																																			"\n"+ 
																																			"eyeControl = effect('"+anmd_eyerig_Data.ControllerName_5+"')('Layer');"+
																																			"\n"+ 
																																			"range = linear(followL.effect('"+anmd_eyerig_Data.ControllerName_1+"')('Slider'),0,100,0,100);"+
																																			"\n"+ 
																																			"followPower = linear(followL.effect('"+anmd_eyerig_Data.ControllerName_4+"')('Slider'), 0, 100, 2,1);"+
																																			"\n"+ 
																																			"\n"+ 
																																			"L = thisLayer;"+
																																			"\n"+ 
																																			"eyePosX = L.toWorld(L.anchorPoint)[0];"+
																																			"\n"+ 
																																			"eyePosY = L.toWorld(L.anchorPoint)[1];"+
																																			"\n"+ 
																																			"\n"+ 
																																			"followPosX = followL.toWorld(L.anchorPoint)[0];"+
																																			"\n"+ 
																																			"followPosY = followL.toWorld(L.anchorPoint)[1];"+
																																			"\n"+ 
																																			"\n"+ 
																																			"if(followL.effect('"+anmd_eyerig_Data.ControllerName_3+"')('Checkbox')==true){"+
																																			"\n"+ 
																																			"xDP = (followPosX -eyePosX) /(width);"+
																																			"\n"+ 
																																			"yDP = (followPosY -  eyePosY) /(width);"+
																																			"\n"+ 
																																			"\n"+ 
																																			"if(xDP <= 0){"+
																																			"xDP = (1-0) * (-Math.pow(followPower, -10 * (-xDP-0/(1-0))) + 1) + 0;"+
																																			"\n"+ 
																																			"xDP *= -1;"+
																																			"}else{"+
																																			"xDP = (1-0) * (-Math.pow(followPower, -10 * (xDP-0/(1-0))) + 1) + 0"+
																																			"\n"+ 
																																			"}"+
																																			"\n"+ 
																																			"if(yDP <= 0){"+
																																			"yDP = (1-0) * (-Math.pow(followPower, -10 * (-yDP-0/(1-0))) + 1) + 0;"+
																																			"\n"+ 
																																			"yDP *= -1;"+
																																			"}else{"+
																																			"yDP = (1-0) * (-Math.pow(followPower, -10 * (yDP-0/(1-0))) + 1) + 0;"+
																																			"\n"+ 
																																			"}"+
																																			"tempX = content('Pupil Group').content('Pupil Shape').position[0] + (range*xDP);"+
																																			"\n"+ 
																																			"tempY = content('Pupil Group').content('Pupil Shape').position[1] + (range*yDP);"+
																																			"\n"+ 
																																			"}else{"+
																																			"eyeControlX = eyeControl.toWorld(L.anchorPoint)[0];"+
																																			"\n"+ 
																																			"eyeControlY = eyeControl.toWorld(L.anchorPoint)[1];"+
																																			"\n"+ 
																																			"tempX = linear(followPosX, (eyeControlX)-range,  (eyeControlX)+range, -range, range);"+
																																			"\n"+ 
																																			"tempY = linear(followPosY, (eyeControlY)-range,  (eyeControlY)+range, -range, range);"+
																																			"\n"+ 
																																			"}"+
																																			"\n"+ 
																																			"[tempX, tempY];"
																																			;

anmd_eyerig_Data.ex_3_copyMaskPath = "";

// resets
anmd_eyerig_Data.pupilSize = 50;
anmd_eyerig_Data.pupilLimit = 60;

anmd_eyerig_Data.exists = false;

if (anmd_eyerig_Data.comp){
	app.beginUndoGroup("Run Animade Eyes");

	// Is there an onion layer target layer
	var allLayers = anmd_eyerig_Data.comp.layers;
	var steps;

	// Look for eye rig
	for (var i=1; i <= allLayers.length; i++) {
		if (allLayers[i].name == anmd_eyerig_Data.layerName_1) {
			anmd_eyerig_Data.exists = true;
			onionLayer = allLayers[i];
			break;
		}else{
			anmd_eyerig_Data.exists = false;
		}
	}


	// Create if it does not exist
	if(!anmd_eyerig_Data.exists){

		// create nulls
		var eyeNull;
		eyeNull = anmd_eyerig_Data.comp.layers.addNull();
		eyeNull.name = anmd_eyerig_Data.layerName_2;
		eyeNull.label = 2;
		
		var pupilNull;
		pupilNull = anmd_eyerig_Data.comp.layers.addNull();
		pupilNull.name = anmd_eyerig_Data.layerName_1;
		pupilNull.label = 11;
		pupilNull.property("ADBE Transform Group").property("ADBE Scale").setValue([50,50]);
		pupilNull.parent = eyeNull;

		var pupilSize = pupilNull.property("Effects").addProperty("Slider Control"); 
		pupilSize.name = anmd_eyerig_Data.ControllerName_2;
		pupilSize.property("Slider").setValue(anmd_eyerig_Data.pupilSize);

		var pupilRange = pupilNull.property("Effects").addProperty("Slider Control"); 
		pupilRange.name = anmd_eyerig_Data.ControllerName_1;
		pupilRange.property("Slider").setValue(anmd_eyerig_Data.pupilLimit);

		var stareAtPoint = pupilNull.property("Effects").addProperty("Checkbox Control"); 
		stareAtPoint.name = anmd_eyerig_Data.ControllerName_3;
		stareAtPoint.property("Checkbox").setValue(false);

		var focalDistance = pupilNull.property("Effects").addProperty("Slider Control"); 
		focalDistance.name = anmd_eyerig_Data.ControllerName_4;
		focalDistance.property("Slider").setValue(0);

		var eyeLayer = createEyeLayer(	anmd_eyerig_Data.layerName_3, 3, eyeNull, -50, 0, anmd_eyerig_Data.pupilSize);
		var eyeLayer2 = createEyeLayer(	anmd_eyerig_Data.layerName_4, 3, eyeNull, 50, 0, anmd_eyerig_Data.pupilSize);

		var eyeControlSelect = eyeLayer.property("Effects").addProperty("Layer Control"); 
		eyeControlSelect.name = anmd_eyerig_Data.ControllerName_5;
	 eyeControlSelect.property("Layer").setValue(eyeNull.index);
		
		var eyeControlSelect2 = eyeLayer2.property("Effects").addProperty("Layer Control"); 
		eyeControlSelect2.name = anmd_eyerig_Data.ControllerName_5;
	 eyeControlSelect2.property("Layer").setValue(eyeNull.index);
		
		var pupilControlSelect = eyeLayer.property("Effects").addProperty("Layer Control"); 
		pupilControlSelect.name = anmd_eyerig_Data.ControllerName_6;
	 pupilControlSelect.property("Layer").setValue(pupilNull.index);
		
		var pupilControlSelect2 = eyeLayer2.property("Effects").addProperty("Layer Control"); 
		pupilControlSelect2.name = anmd_eyerig_Data.ControllerName_6;
	 pupilControlSelect2.property("Layer").setValue(pupilNull.index);


		allLayers = anmd_eyerig_Data.comp.layers;
		eyeNull.moveBefore(allLayers[1]);
		allLayers = anmd_eyerig_Data.comp.layers;
		pupilNull.moveBefore(allLayers[1]);

	}




}

function createEyeLayer(layerName, labelColour, parentLayer, xPos, yPos, pupilSize){

	var tempLayer;

	// tempLayer = anmd_eyerig_Data.comp.layers.addSolid([240,240,90], layerName, anmd_eyerig_Data.comp.width, anmd_eyerig_Data.comp.height,1);;
	// tempLayer.name = layerName;
	// tempLayer.startTime = 0;
	// tempLayer.adjustmentLayer = true;
	// tempLayer.locked = false;	
	// tempLayer.label = labelColour;	
	// tempLayer.shy = false;	
	// tempLayer.property("Effects").addProperty("CC Wide Time");
	// allLayers = anmd_eyerig_Data.comp.layers;
	// tempLayer.moveBefore(allLayers[1]);

	tempLayer = anmd_eyerig_Data.comp.layers.addShape();
	tempLayer.name = layerName;
	tempLayer.startTime = 0;
	tempLayer.locked = false;	
	tempLayer.label = 8;
	tempLayer.shy = false;
	tempLayer.parent = parentLayer;
	tempLayer.property("ADBE Transform Group").property("ADBE Position").setValue([xPos,yPos]);

	
	// Make a circle shape to use as the eyeball
	var circleShape = new Shape();
	circleShape.vertices = [[0,-50],[-50,0],[0,50],[50,0]]; 
	circleShape.inTangents = [[(50 * 0.5523),0],[0,-(50 * 0.5523)],[-(50 * 0.5523),0],[0,(50 * 0.5523)]]; 
	circleShape.outTangents = [[-(50 * 0.5523),0],[0,(50 * 0.5523)],[(50 * 0.5523),0],[0,-(50 * 0.5523)]]; 
	circleShape.closed = true;
		
	var eyeContents = tempLayer.property("ADBE Root Vectors Group");

	// create the pupil 
	var pupilGroup = eyeContents.addProperty("ADBE Vector Group");
	pupilGroup.name = "Pupil Group";

	var pupilShape = pupilGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Ellipse");
	pupilShape.name = "Pupil Shape";

	pupilShape.property("ADBE Vector Ellipse Size").setValue([pupilSize, pupilSize]);

 var targetProp = pupilShape.property("ADBE Vector Ellipse Size");
 targetProp.expression = anmd_eyerig_Data.ex_1_pupilSize;

 targetProp = pupilShape.property("ADBE Vector Ellipse Position");
 targetProp.expression = anmd_eyerig_Data.ex_2_pupilPos;


	var pupilMask = pupilGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Group");
	pupilMask.name = "Pupil Mask";
	
	var pupilMaskPath = pupilMask.property("ADBE Vector Shape");
	pupilMaskPath.setValue(circleShape);

	var pupilMerge = pupilGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Filter - Merge");
	pupilMerge.property("ADBE Vector Merge Type").setValue(4);

	pupilGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
	var pupilFillColour = pupilGroup.property("ADBE Vectors Group").property("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color");
	pupilFillColour.setValue([0,0,0,1]);

	// create the eyeball 

	var eyballGroup = eyeContents.addProperty("ADBE Vector Group");
	eyballGroup.name = "Eyeball Group";
	
	var eyeballShape = eyballGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Ellipse");
	eyeballShape.name = "Eyeball Shape";

	eyballGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
	var eyeFillColour = eyballGroup.property("ADBE Vectors Group").property("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color");
	eyeFillColour.setValue([1,1,1,1]);

	return tempLayer;


}



