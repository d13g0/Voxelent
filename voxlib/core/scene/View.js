/*-------------------------------------------------------------------------
    This file is part of Voxelent's Nucleo

    Nucleo is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation version 3.

    Nucleo is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Nucleo.  If not, see <http://www.gnu.org/licenses/>.
---------------------------------------------------------------------------*/  

/**
* Each HTML5 canvas is assigned a view object (vxlView) in Voxelent's Nucleo.
* 
* A vxlView provides the code to handle cameras, interaction and rendering capabilities, plus actor handling on the 
* HTML5 canvas that otherwise would need to be written over and over for each application
* if you were writing a WebGL app from scratch.
* Luckily this is not the case. You have the awesome vxlView who takes care of all these little details for you.
* @class
* @constructor
* @param {String} canvasID id of the canvas in the DOM tree. That's all we need to setup a vxlView for you
* @param {vxlScene} scene if this view is sharing a scene, this parameter corresponds to the scene being shared.
* @author Diego Cantor
*/

function vxlView(canvasID, scene){
	//View Identification
	//this.id = 0; //@TODO: Who handles this? Maybe one Scene has several Views?
	this.name = canvasID;
	this.canvas = document.getElementById(this.name);
	if (this.canvas == null){
		alert('The canvas ' + canvasID+ ' does not exist.');
		throw('The canvas ' + canvasID+ ' does not exist.');
	}
	
	
		
	//View properties
	this.ready = false;
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.clearDepth = 10000;
	this.zNear = 0.1;
	this.zFar = 10000;
	this.fovy = 10;
	this.backgroundColor = vxl.def.color.background.slice(0);
	this.ambientColor = vxl.def.color.ambient.slice(0);

	//Create Renderer
	this.renderer = new vxlRenderer(this);
	this.setBackgroundColor(this.backgroundColor);
	this.setClearDepth(this.clearDepth);
	
	//Create Camera Manager
	this.cameraman = new vxlCameraManager(this);
	
	//Create View Listener
	this.listener = new vxlViewListener(this);
	
	//Create Scene
	if (scene != null && scene instanceof vxlScene){
		this.scene = scene;
	}
	else if (vxl.c.scene){
		this.scene = vxl.c.scene;
	}
	else{
		this.scene = new vxlScene();
	
	}
	//Add this view to the scene;
	this.scene.views.push(this);
	
	//Register events to listen to
	vxl.go.notifier.addTarget(vxl.events.SCENE_UPDATED, this);
	vxl.go.notifier.addTarget(vxl.events.DEFAULT_LUT_LOADED,this);
	
	 this.ready = true;
	 vxl.go.console('vxlView: the view '+ this.name+' has been created');
};


/**
 * Handles the events to which a view is subscribed in Voxelent's Nucleo
 * @param {String} event the name of the event
 * @param {Object} source the origin of the event. Useful to do callbacks if necessary
 */
vxlView.prototype.handleEvent = function(event, source){
	vxl.go.console('vxlView: receiving event '+event);
	if (event == vxl.events.DEFAULT_LUT_LOADED){
		this.scene.setLookupTable(vxl.def.lut.main);
	}
	if (event == vxl.events.SCENE_UPDATED){
		this.cameraman.getActiveCamera().longShot();	
	}
};

/**
 * Clears the scene. Delegates this task to the renderer.
 */
vxlView.prototype.clear = function(){
	this.renderer.clear();
};

/**
 * Update the width and height of this view with the width and height of the canvas.
 * @TODO: review the JQuery binding that calls this function
 */
vxlView.prototype.resize = function(){
	this.width = this.canvas.width;
	this.height = this.canvas.height;
};

/** 
* Prepares the view for rendering
* @TODO: Frown :-/ This method is a callback from the Renderer
*/
vxlView.prototype.prepareForRendering = function(){
	if (!this.ready) return; //not ready yet?
	this.resize();
	this.clear();
};

/**
 * Starts the view
 */
vxlView.prototype.start = function(){
	this.renderer.start();
	this.refresh();
};

/**
 * Stops the view
 */
vxlView.prototype.stop = function(){
	this.renderer.stop();
};

/**
 * Resets the view
 */
vxlView.prototype.reset = function(){
	this.stop();
	this.scene.reset();
	this.cameraman.reset();
	this.start();
}

/**
 * Sets the background color. Delegated to the renderer
 * @param {Array} v the new color given as an array of three numbers
 * @see vxlRenderer#clearColor
 */
vxlView.prototype.setBackgroundColor = function(v){
	this.backgroundColor = v.slice(0);
	this.renderer.clearColor(this.backgroundColor);
};

/**
 * Sets the ambient color
 * @param {Array} v the new ambient color given as an array of three numbers
 * 
 */
vxlView.prototype.setAmbientColor = function(v){
	this.ambientColor = v.slice(0);
	this.renderer.prg.setUniform("uAmbientColor", this.ambientColor);
};

/**
 * Sets the clear depth
 * @param {Number} d the new depth
 * @see vxlRenderer#clearDepth
 */
vxlView.prototype.setClearDepth = function(d){
	this.renderer.clearDepth(d)
};

/**
 * Refresh the view by invoking the rendering method on the renderer
 * @see vxlRenderer#render
 */
vxlView.prototype.refresh = function(){
	this.renderer.render();
};

