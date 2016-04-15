// INSTRUCTIONS
// 
// 1 - Find and replace 'animade_pointTracker' with new script name
// 2 - Add additional buttons etc
// 3 - Add functionality 
// 4 - Create settings if needed

// ∞
//
// animade_pointTracker.jsx
// Copyright (c) 2015 animade. All rights reserved.
// www.animade.tv
// 
// Name:  animade_pointTracker
// Version: 1
// 

// Globals

clearOutput(); // Clears the info screen each time the script is run

var animade_pointTracker_Data = new Object();	// Store globals in an object

animade_pointTracker_Data.comp = app.project.activeItem;
animade_pointTracker_Data.ex_1 = "";

animade_pointTracker_Data.pointCTRLName = "PointTracker";
animade_pointTracker_Data.exists = false;
animade_pointTracker_Data.keyInt = 1;
animade_pointTracker_Data.trackerLayers = [];

// Errors
animade_pointTracker_Data.noPathSel = "Select a path to track";
animade_pointTracker_Data.newTracker = "A tracker has been created";
animade_pointTracker_Data.trackerUpdated = "The tracker has been updated";
animade_pointTracker_Data.trackersUpdated = "All trackers updated";


// Load in settings for rotation and vert to track
if (app.settings.haveSetting("animade", "anmd_toolbox_trackPointReverse")){
	animade_pointTracker_Data.getLastVert = app.settings.getSetting("animade", "anmd_toolbox_trackPointReverse");
}
else{
	animade_pointTracker_Data.getLastVert = true;
}

if (app.settings.haveSetting("animade", "anmd_toolbox_trackPointRotate")){
	animade_pointTracker_Data.setRotation = app.settings.getSetting("animade", "anmd_toolbox_trackPointRotate");
}
else{
	animade_pointTracker_Data.setRotation = true;
}
// ---


// Main function
if (animade_pointTracker_Data.comp){
	app.beginUndoGroup("Run Animade Point Tracker");
	
	// 1 - If a path is selected then add a tracking Null - else if it already has one then reconnect it along with any others in the comp
	if (animade_pointTracker_Data.comp.selectedProperties[0]) {

		// Look to see if the selection is a shape with a path
		if(animade_pointTracker_Data.comp.selectedProperties[0].matchName == "ADBE Vector Shape - Group")
		{

			// find the path to track
			var path = animade_pointTracker_Data.comp.selectedProperties[0];
			// grab the path shape
			pathShape = path.property("ADBE Vector Shape").value;
			// grab all the verts of the path
			pathVerts = pathShape.vertices;

			var allLayers = animade_pointTracker_Data.comp.layers;
			var targetLayer = animade_pointTracker_Data.comp.selectedLayers[0];
			var nullName = targetLayer.name + "_" + path.propertyGroup(2).name + "_" + path.name + "_" + animade_pointTracker_Data.pointCTRLName;
			var trackNull;

			// Look for tracking Null 
			for (var i=1; i <= allLayers.length; i++) {
				if (allLayers[i].name == nullName) {
					animade_pointTracker_Data.exists = true;
					trackNull = allLayers[i];
					break;
				}else{
					animade_pointTracker_Data.exists = false;
				}
			}		

			// If no tracking null found then make one
			if (!animade_pointTracker_Data.exists) {
				writeLn(animade_pointTracker_Data.newTracker)
				trackNull = animade_pointTracker_Data.comp.layers.addNull();
				trackNull.name = nullName;
				trackNull.label = 11;
				trackNull.inPoint = targetLayer.inPoint;

				// set the settings
				var rev = false;
				if(animade_pointTracker_Data.getLastVert == 'true') rev = true;
				var rot = false;
				if(animade_pointTracker_Data.setRotation == 'true') rot = true;


				// add start stop tracking markers
				// var startMarker = new MarkerValue("Start Track");
				// trackNull.property("Marker").setValueAtTime(0, startMarker);
				// var endMarker = new MarkerValue("Stop Track");
				// trackNull.property("Marker").setValueAtTime(1, endMarker);

				// add the check boxes for rotation and reverse
				// var startStopTracking = trackNull.property("Effects").addProperty("Checkbox Control"); 
				// startStopTracking.name = "Tracking Enabled";
				// startStopTracking.property("Checkbox").setValue(true);

				var vertSpecify = trackNull.property("Effects").addProperty("Slider Control"); 
				vertSpecify.name = "Vertex to track";
				vertSpecify.property("Slider").setValue(pathVerts.length);

				// add the check boxes for rotation and reverse
				var smartRotationCB = trackNull.property("Effects").addProperty("Checkbox Control"); 
				smartRotationCB.name = "Smart Rotation";
				smartRotationCB.property("Checkbox").setValue(rot);

				// add the check boxes for rotation and reverse
				var smartRotationBackwardsCB = trackNull.property("Effects").addProperty("Checkbox Control"); 
				smartRotationBackwardsCB.name = "Reverse Smart Rotation";
				smartRotationBackwardsCB.property("Checkbox").setValue(rot);



			}

			// move the track to above the target layer
			trackNull.moveBefore(targetLayer);
			// set the trackers pertent to the target layer
			trackNull.setParentWithJump(targetLayer);

			// Run the function to do the tracking 
			// animade_pointTracker_trackPoint(path, trackNull);	

		}

	}	

	// Look for tracking nulls in comp 
	// 1 - tracking Nulls found so reconnect them
	if(animade_pointTracker_findTrackingNulls())
	{

		writeLn(animade_pointTracker_Data.trackersUpdated);

		//for (var i = animade_pointTracker_Data.trackerLayers.length-1; i >= 0; i--) {
		for (var i=0; i <= animade_pointTracker_Data.trackerLayers.length; i++){
			//writeLn(animade_pointTracker_Data.trackerLayers[i].name);

			var trackNull = animade_pointTracker_Data.trackerLayers[i];
			var trackerName = animade_pointTracker_Data.trackerLayers[i].name;
			
			str = trackerName.split("_");

			// get layer
			var targetLayer;
			// Look for target Layer
			var allLayers = animade_pointTracker_Data.comp.layers;
			for (var j=1; j <= allLayers.length; j++) {
				if (allLayers[j].name == str[0]) {
					targetLayer = allLayers[j];
				}
			}

			// get shape
			var shapeLayer;
			// Look for shape Layer

			var s = str[1];
			//var s = "L";

			var path = targetLayer.property("Contents").property(str[1]).property("Contents").property(str[2]);
	  		
  			animade_pointTracker_trackPoint(path, trackNull);	

		}

	}
	// 2 - tracking Nulls not found so alert to select a path to track
	else
	{
		writeLn(animade_pointTracker_Data.noPathSel);
		alert(animade_pointTracker_Data.noPathSel)
	}


}

// Track Point function
function animade_pointTracker_trackPoint(targetPath, trackNull){
	
	var keyTimes = [];
	var keyPositionValues = [];
	var keyRotationValues = [];

	// get end vert

	var startKey = true;
	var noKey = false;
	var pathShape;
	var pathVerts;
	var vertToTrack;
	var inTan;
	var outTan;
	var numberOfVerts;
	var nextVert;
	var nextInTan;
	var prevVert;
	var prevOutTan;

	// animate the mask

	var numberKeys = path.property("ADBE Vector Shape").numKeys;
	var startKeyTime = path.property("ADBE Vector Shape").keyTime(1);
	var endKeyTime = path.property("ADBE Vector Shape").keyTime(numberKeys);


	
	// start at work area start - limit to work area end - increase by in frame;

	for (var t = Math.max(targetLayer.inPoint,animade_pointTracker_Data.comp.workAreaStart); t < Math.min(targetLayer.outPoint,animade_pointTracker_Data.comp.workAreaStart + animade_pointTracker_Data.comp.workAreaDuration) + 0.001; t += animade_pointTracker_Data.keyInt * animade_pointTracker_Data.comp.frameDuration) 
	{

		// IS TRACKING ENABLED? If not then delete all keys at this time and move to next frame

		if(t > (endKeyTime + animade_pointTracker_Data.comp.frameDuration) || t < startKeyTime - animade_pointTracker_Data.comp.frameDuration){
			noKey = true;
		}else{
			noKey = false;
		}

		//var trackingEnabled = trackNull.property("Effects").property("Tracking Enabled").property("checkbox").valueAtTime(t, false);
		if(noKey == true || (startKey == false &&  numberKeys < 2)){

			var numberKeysPos = trackNull.property("ADBE Transform Group").property("ADBE Position").numKeys;

			if (numberKeysPos > 0) {

				// get the current positon keyframe to delete
				var trackerPos1 = trackNull.property("ADBE Transform Group").property("ADBE Position");
				var positionNearestKeyIndex = trackerPos1.nearestKeyIndex(t);
				var positionNearestKeyTime = trackerPos1.keyTime(positionNearestKeyIndex);
				// round the times to 2 decimals to make match solid
				var t2 = Math.round(t * 100) / 100;
				var p2 = Math.round(positionNearestKeyTime * 100) / 100;
				
				if(p2 == t2){
					trackerPos1.removeKey(positionNearestKeyIndex);
				}
			}


			var numberKeysRot = trackNull.property("ADBE Transform Group").property("ADBE Rotate Z");

			if (numberKeysRot > 0) {
							// get the current rotation keyframe to delete
				var trackerRot1 = trackNull.property("ADBE Transform Group").property("ADBE Rotate Z");
				var rotationNearestKeyIndex = trackerRot1.nearestKeyIndex(t);
				var rotationNearestKeyTime = trackerRot1.keyTime(rotationNearestKeyIndex);

				var r2 = Math.round(rotationNearestKeyTime * 100) / 100;

				// delete the key frame if it is at this time
				if(r2 == t2){
					trackerRot1.removeKey(rotationNearestKeyIndex);
				}
			};
			
			continue;
		}
		
		startKey = false;

		// grab the path shape
		pathShape = path.property("ADBE Vector Shape").valueAtTime(t, false);
		var isClosed = pathShape.closed;

		// grab all the verts of the path
		pathVerts = pathShape.vertices;
		// get number of verts on shape
		numberOfVerts = pathVerts.length;	

		// get checkbox info
		var specifiedVert = trackNull.property("Effects").property("Vertex to track").property("slider").value;
		var isStartVertex = false;
		var isEndVertex = false;
		var rotationToKey = 0;
animade_pointTracker_trackPoint
		// work out specified vertex
		specifiedVert = Math.floor(specifiedVert);
		
		if(specifiedVert <= 0){ 
			specifiedVert = 0;
			if(!isClosed){
				isStartVertex = true;
				trackNull.property("Effects").property("Reverse Smart Rotation").property("checkbox").setValue(false);
			}
		}

		if(specifiedVert >= numberOfVerts - 1){ 
			specifiedVert = numberOfVerts - 1; 
			if(!isClosed){
				isEndVertex = true;
				trackNull.property("Effects").property("Reverse Smart Rotation").property("checkbox").setValue(false);
			}
		}

		trackNull.property("Effects").property("Vertex to track").property("slider").setValue(specifiedVert);

		vertToTrack = pathVerts[specifiedVert];

		var trackerPos2 = trackNull.property("ADBE Transform Group").property("ADBE Position");
		trackerPos2.setValueAtTime(t, vertToTrack);


		// IS SMART ROTATION ENABLED? If not then delete all keys at this time and move to next frame

		var smartRotationEnabled = trackNull.property("Effects").property("Smart Rotation").property("checkbox").valueAtTime(t, false);
		var smartRotationBackwards = trackNull.property("Effects").property("Reverse Smart Rotation").property("checkbox").valueAtTime(t, false);

		if(!smartRotationEnabled){

			// get the current rotation keyframe to delete
			var trackerRot1 = trackNull.property("ADBE Transform Group").property("ADBE Rotate Z");

			if(trackerRot1.numKeys<1){ continue; }

			var rotationNearestKeyIndex = trackerRot1.nearestKeyIndex(t);
			var rotationNearestKeyTime = trackerRot1.keyTime(rotationNearestKeyIndex);

			// round the times to 2 decimals to make match solid
			var t2 = Math.round(t * 100) / 100;
			var r2 = Math.round(rotationNearestKeyTime * 100) / 100;

			// delete the key frame if it is at this time
			if(r2 == t2){
				trackerRot1.removeKey(rotationNearestKeyIndex);
			}
			continue;
		}
		

		inTan = pathShape.inTangents[specifiedVert];
		outTan = pathShape.outTangents[specifiedVert];
		nextVert = pathVerts[specifiedVert+1];
		nextInTan = pathShape.inTangents[specifiedVert+1];
		prevVert = pathVerts[specifiedVert-1];
		prevOutTan = pathShape.outTangents[specifiedVert-1];

		// if start or end then adjust next and prev to be oposites
		if(specifiedVert == 0){
			// if start then prev is end vert
			prevVert = pathVerts[numberOfVerts - 1];
			prevOutTan = pathShape.outTangents[numberOfVerts - 1];
		}else if(specifiedVert == numberOfVerts - 1){ 
			// if end then next is start vert
			nextVert = pathVerts[0];
			nextOutTan = pathShape.outTangents[0];
		}

		var rotType;

		if(isEndVertex){
			if(inTan[0] != 0 || inTan[1] != 0){
				rotType = 1;
			}else if(prevOutTan[0] != 0 || prevOutTan[1] != 0){
				rotType = 3;
			}else{
				rotType = 2;
			}
		}else if(isStartVertex){
			if(outTan[0] != 0 || outTan[1] != 0){
				rotType = 4;
			}else if(nextOutTan[0] != 0 || nextOutTan[1] != 0){
				rotType = 6;
			}else{
				rotType = 5;
			}
		}else if(smartRotationBackwards){
			if(inTan[0] != 0 || inTan[1] != 0){
				rotType = 1;
			}else if(prevOutTan[0] != 0 || prevOutTan[1] != 0){
				rotType = 3;
			}else{
				rotType = 2;
			}
		}else if(!smartRotationBackwards){
			if(outTan[0] != 0 || outTan[1] != 0){
				rotType = 4;
			}else if(nextOutTan[0] != 0 || nextOutTan[1] != 0){
				rotType = 6;
			}else{
				rotType = 5;
			}
		}

		switch (rotType) {
		    case 1: //	1 - rotate around own in tangent || not if start
		        rotationToKey = [ (vertToTrack[0] + inTan[0]) ,  (vertToTrack[1] + inTan[1]) ];
		        break;
		    case 4: //	2 - rotate around own out tangent || not if end
		        rotationToKey = [ (vertToTrack[0] + outTan[0]) ,  (vertToTrack[1] + outTan[1]) ];
		        break;
		    case 2: //	3 - rotate around previouse vert || not is start
		        rotationToKey = [ prevVert[0] ,  prevVert[1] ];
		        break;
		    case 3: //	4 - rotate around previouse vert out tangent || not if start
		        rotationToKey = [ (prevVert[0] + prevOutTan[0]) ,  (prevVert[1] + prevOutTan[1]) ];
		        break;
		    case 5: //	5 - rotate around next verts || not if end
		        rotationToKey = [ nextVert[0] , nextVert[1] ];
		        break;
		  	case 6: //	6 - rotate around next verts in tagent || not if end
		     	rotationToKey = [ (nextVert[0] + nextInTan[0]) ,  (nextVert[1] + nextInTan[1]) ];
		    	break;
		}		

		// work out rotation based on vector between two verts
		var rot = getAngle(vertToTrack, rotationToKey);
			
		var trackerRot2 = trackNull.property("ADBE Transform Group").property("ADBE Rotate Z");
		trackerRot2.setValueAtTime(t, rot);
		
	}

}

function animade_pointTracker_findTrackingNulls(){
	
	var allLayers = animade_pointTracker_Data.comp.layers;
	var layerName;
	var results;

	// Look for onion Layer
	for (var i=1; i <= allLayers.length-1; i++) {

		layerName = allLayers[i].name;
		results = layerName.indexOf(animade_pointTracker_Data.pointCTRLName);
		//writeLn(layerName + " - " + i);

		if (results > -1) {
			
			animade_pointTracker_Data.trackerLayers.push(allLayers[i])

		}

	}

	if(animade_pointTracker_Data.trackerLayers.length > 0){
		return true;
	}else{
		return false;
	}

}

// Determines whether the active item is a composition  
function checkActiveItem() 
{
	return !(app.project.activeItem instanceof CompItem);
}

function throwErr(err)
{
	var title = $.fileName.substring($.fileName.lastIndexOf("/")+1, $.fileName.lastIndexOf("."));
	alert(err, title, true);
}

function getAngle(source, target){
	var xDif = target[0] - source[0];
	var yDif = target[1] - source[1];
   	var a = Math.atan2( yDif, xDif );
	a = getDegrees(a) + 90.0;
	if(a < 0) a = 360.0 + a;
	return a;
}

function getDegrees(radians){
	d = radians * (180/Math.PI)
	return d;
}


