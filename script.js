	var canvas;
	var context;
	var height;
	var width;
	var imageData;
	var globals = {};
	var ZOOM_BOX_FACTOR = 0.25;
	var g;
function run(){
	canvas = document.getElementById("canvas");
	context = canvas.getContext('2d');
	height = parseInt(canvas.getAttribute("height"));
	width = parseInt(canvas.getAttribute("width"));
	canvas.addEventListener('mousedown', mouseOnClick, false);
	globals.staticZoomBoxWidth = ZOOM_BOX_FACTOR * width; 
    globals.staticZoomBoxHeight = ZOOM_BOX_FACTOR * height;
	FractalType();
	StartAxis();
	init();
}
function FractalType(){
	if(document.forms[0].ChoseFill[0].checked==true)
		globals.Fractal = "Classic";
	if(document.forms[0].ChoseFill[1].checked==true)
		globals.Fractal = "Level";
	if(document.forms[0].ChoseFill[2].checked==true)
		globals.Fractal = "Zebra";
}	
function init(){	
	var constComplex = {
		x: 0,
		y: 0
	};
	var n = parseInt(document.getElementById("Iterations").value);
	var newZ = {
		x: 0,
		y: 0
	};
	imageData = context.createImageData(width, height);
	for (var i = 0; i < width; i++) {

		constComplex.x = xToRe(i);
		for (var j = 0; j < height; j++) {

            constComplex.y = yToIm(j);
			newZ.x = 0;
			newZ.y = 0;
			for (g = 0; g < n; g++){
				
				if(modulus(newZ.x, newZ.y) > 2 ){
					globals.infinity = true;
					break;
				}
				var a = newZ.x;
				var b = newZ.y;
				newZ.x = a*a - b*b + constComplex.x;
				newZ.y = 2*a*b + constComplex.y;
			}
			if (g == n) 
				globals.infinity = false;
			colorType(i,j);
		}
	}
	context.putImageData(imageData, 0, 0);
}

function modulus(x1, y1){
	return Math.sqrt(x1*x1 + y1*y1);
}
function colorType(i, j){
	if(globals.Fractal == "Classic"){
		if (!globals.infinity){
			imageData.data[4*(i + width*j) + 0] = 0;
			imageData.data[4*(i + width*j) + 1] = 0;
			imageData.data[4*(i + width*j) + 2] = 0;
			imageData.data[4*(i + width*j) + 3] = 255;	
		}
		else{
			imageData.data[4*(i + width*j) + 0] = 255;
			imageData.data[4*(i + width*j) + 1] = 255;
			imageData.data[4*(i + width*j) + 2] = 255;
			imageData.data[4*(i + width*j) + 3] = 255;	
		}
	}
	
	if(globals.Fractal == "Level"){
			imageData.data[4*(i + width*j) + 0] = 0;
			imageData.data[4*(i + width*j) + 1] = 0;
			imageData.data[4*(i + width*j) + 2] = 0;
		if (!globals.infinity)
			imageData.data[4*(i + width*j) + 3] = 255;	
		else
			imageData.data[4*(i + width*j) + 3] = 255 - g * 5;
	}
	if(globals.Fractal == "Zebra"){
		if(!globals.infinity){
            imageData.data[4*(i + width*j) + 0]=0;
            imageData.data[4*(i + width*j) + 1]=0;
            imageData.data[4*(i + width*j) + 2]=0;
            imageData.data[4*(i + width*j) + 3]=255;
        }
		else{
			if (g%2 == 0){
				imageData.data[4*(i + width*j) + 0] = 0;
				imageData.data[4*(i + width*j) + 1] = 0;
				imageData.data[4*(i + width*j) + 2] = 0;
				imageData.data[4*(i + width*j) + 3] = 255;	
			}
			else{
				imageData.data[4*(i + width*j) + 0] = 255;
				imageData.data[4*(i + width*j) + 1] = 255;
				imageData.data[4*(i + width*j) + 2] = 255;
				imageData.data[4*(i + width*j) + 3] = 255;	
			}
		}
	}
}
function GloobalAXis(ImMin, ReMax, ReMin, ImMax){
	globals.ReMin = ReMin;
	globals.ReMax = ReMax;
	globals.ImMax = ImMax;
	globals.ImMin = ImMin;
}
function StartAxis(){
	globals.ReMin = -2.5;
	globals.ImMax = 1.2;
	globals.ImMin = -1.2;
	globals.ReMax = width * ( (globals.ImMax - globals.ImMin) / height ) + globals.ReMin;
}
function xToRe(x) {
      return (x * (globals.ReMax - globals.ReMin) / width) + globals.ReMin; 
}
	
function yToIm(y) {     
    return (y * (globals.ImMin - globals.ImMax) / height) + globals.ImMax; 
}
	
function mouseOnClick(evt) {
	var canvasX;
	var canvasY;

	var ReMin= globals.ReMin;
	var ImMax = globals.ImMax;
	var ReMax = globals.ReMax;
	var ImMin = globals.ImMin;
	
	if (evt.offsetX && evt.offsetY) {
        canvasX = evt.offsetX; 
        canvasY = evt.offsetY; 
    } else {
        canvasX = evt.clientX - evt.target.offsetLeft; 
        canvasY = evt.clientY - evt.target.offsetTop; 
    } 
	var halfStaticZoomBoxWidth = globals.staticZoomBoxWidth / 2;
	var halfStaticZoomBoxHeight = globals.staticZoomBoxHeight / 2;

	ReMin = xToRe(canvasX - halfStaticZoomBoxWidth);
	ImMax = yToIm(canvasY - halfStaticZoomBoxHeight);
	ReMax = xToRe(canvasX + halfStaticZoomBoxWidth);
	ImMin = yToIm(canvasY + halfStaticZoomBoxHeight);
	
	GloobalAXis(ImMin, ReMax, ReMin, ImMax)
	init();
}

