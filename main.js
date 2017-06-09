$(function() {
	$(".bg").on({
		touchstart: function(e) {
			touchstart(e);
		},
		touchmove: function(e) {
			touchmove(e);
		},
		touchend: function(e) {
			touchend(e);
		},
		gesturestart: function(e) {
			gesturestart(e);
		},
		gesturechange: function(e) {
			gesturechange(e);
		},
		gestureend: function(e) {
			gestureend(e);
		}
	});

	var contentX = 0;
	var contentY = 0;
	var originX = $(".content").width()/2;
	var originY = $(".content").height()/2;
	var transformOffsetX = transform_value($(".content"))['transform-x'];
	var transformOffsetY = transform_value($(".content"))['transform-y'];
	var isDrag = false;
	function touchstart(e){
		event.preventDefault();
		$(".content").css("transition", "0")

		transformOffsetX = transform_value($(".content"))['transform-x'];
		transformOffsetY = transform_value($(".content"))['transform-y'];

		if(e.touches.length == 1) {
			$(".event").html("drag start");
			// $(".content").css("background-color", "#999");
			contentX = event.touches[0].pageX;
			contentY = event.touches[0].pageY;
			inertiaXArray = [0,0,0];
			inertiaYArray = [0,0,0];
			isDrag = true;
		}
		if(e.touches.length == 2) {
			var touchX1 = (event.touches[0].pageX - $(".content").offset().left) / scale;
			var touchY1 = (event.touches[0].pageY - $(".content").offset().top ) / scale;
			var touchX2 = (event.touches[1].pageX - $(".content").offset().left) / scale;
			var touchY2 = (event.touches[1].pageY - $(".content").offset().top ) / scale;
			originX = (touchX1 + touchX2)/2;
			originY = (touchY1 + touchY2)/2;
			$("#PV").css('left', originX +'px');
			$("#PH").css('top', originY +'px');
			$(".xPoint").html(originX);
			$(".yPoint").html(originY);

			contentX = (event.touches[0].pageX + event.touches[1].pageX) / 2;
			contentY = (event.touches[0].pageY + event.touches[1].pageY) / 2;
		}
	}

	function touchmove(e){
		event.preventDefault();

		x = transformOffsetX;
		y = transformOffsetY;

		if(e.touches.length == 1) {
			$(".event").html("drag");
			lastX = event.touches[0].pageX;
			lastY = event.touches[0].pageY;
			x += event.touches[0].pageX - contentX;
			y += event.touches[0].pageY - contentY;
		}
		if(e.touches.length == 2) {

			x += (event.touches[0].pageX + event.touches[1].pageX) / 2 - contentX;
			y += (event.touches[0].pageY + event.touches[1].pageY) / 2 - contentY;

			var touch2CenterX = $(".content").width() /2 - originX;
			var touch2CenterY = $(".content").height()/2 - originY;
			x += touch2CenterX * (scale - beforScale);
			y += touch2CenterY * (scale - beforScale);
		}

		var inner = {
			left  :   Math.round(($(".content").width() *scale - $(".bg").width() )/2),
			right : - Math.round(($(".content").width() *scale - $(".bg").width() )/2),
			top   :   Math.round(($(".content").height()*scale - $(".bg").height())/2),
			bottom: - Math.round(($(".content").height()*scale - $(".bg").height())/2),
		}

		var xOrg = x;
		var yOrg = y;
		if(x > inner['left']){
			x = inner['left'] + (xOrg - inner['left']) / 3 / scale;
		}
		if(x < inner['right']){
			x = inner['right'] + (xOrg - inner['right']) / 3 / scale;
		}
		if(y > inner['top']){
			y = inner['top'] + (yOrg - inner['top']) / 3 / scale;
		}
		if(y < inner['bottom']){
			y = inner['bottom'] + (yOrg - inner['bottom']) / 3 / scale;
		}
		if($('.content').height() * scale < $('.bg').height()){
			y = yOrg / 3;
		}
		if($('.content').width() * scale < $('.bg').width()){
			x = xOrg / 3;
		}

		xPos = x;
		yPos = y;

	}

	function touchend(e){
		event.preventDefault();
		$(".event").html("drag end");
		$(".content").css("background-color", "#666");
		if(e.touches.length == 0) {
			isDrag = false;
		}else{
			transformOffsetX = transform_value($(".content"))['transform-x'];
			transformOffsetY = transform_value($(".content"))['transform-y'];
			contentX = event.touches[0].pageX;
			contentY = event.touches[0].pageY;
		}
	}

	var beforScale = 1;
	function gesturestart(e){
		event.preventDefault();
		$(".event").html("Pinch start");
		beforScale = scale;
	}

	var scale = 1;
	function gesturechange(e){
		event.preventDefault();
		$(".event").html("Pinch");
		scale = beforScale * event.scale;
		$(".scale").html(scale);
	}
	function gestureend(e){
		event.preventDefault();
	}

	var inertiaX = 0;
	var inertiaY = 0;
	var lastX = 0;
	var lastY = 0;
	var diffLastX = 0;
	var diffLastY = 0;
	var inertiaXArray = [0,0,0];
	var inertiaYArray = [0,0,0];
	xPos = 0;
	yPos = 0;

	function inertiaLoop(){
		if(isDrag){
			if(diffLastX != 0 || diffLastY != 0){
				diffLastX = lastX - diffLastX;
				diffLastY = lastY - diffLastY;
				inertiaXArray.unshift(diffLastX);
				inertiaYArray.unshift(diffLastY);
				inertiaXArray.pop();
				inertiaYArray.pop();
				inertiaX = average(inertiaXArray);
				inertiaY = average(inertiaYArray);
			}
			diffLastX = lastX;
			diffLastY = lastY;
		}else{
			lastX = 0;
			lastY = 0;
			diffLastX = 0;
			diffLastY = 0;
			if(Math.abs(inertiaX) > 0.5 || Math.abs(inertiaY) > 0.5){
				var content = {
					x: transform_value($(".content"))['transform-x'],
					y: transform_value($(".content"))['transform-y'],
				}
				inertiaX *= 0.9;
				inertiaY *= 0.9;
				xPos = content['x'] + inertiaX * scale;
				yPos = content['y'] + inertiaY * scale;

			}else{
				inertiaX = 0;
				inertiaY = 0;
			}
		}
	}


	function centerLoop(){
		if(!isDrag){
			var content = {
				x: transform_value($(".content"))['transform-x'],
				y: transform_value($(".content"))['transform-y'],
			}
			var inner = {
				left  :   Math.round(($(".content").width() *scale - $(".bg").width() )/2),
				right : - Math.round(($(".content").width() *scale - $(".bg").width() )/2),
				top   :   Math.round(($(".content").height()*scale - $(".bg").height())/2),
				bottom: - Math.round(($(".content").height()*scale - $(".bg").height())/2),
			}

			var xPosOrg = xPos;
			var yPosOrg = yPos;
			if(xPos > inner['left']){
				xPos = xPosOrg - (xPosOrg - inner['left']) / 3;
			}
			if(xPos < inner['right']){
				xPos = xPosOrg - (xPosOrg - inner['right']) / 3;
			}
			if(yPos > inner['top']){
				yPos = yPosOrg - (yPosOrg - inner['top']) / 3;
			}
			if(yPos < inner['bottom']){
				yPos = yPosOrg - (yPosOrg - inner['bottom']) / 3;
			}

			if($('.content').height() * scale < $('.bg').height()){
				yPos = yPosOrg - yPosOrg / 3;
			}
			if($('.content').width() * scale < $('.bg').width()){
				xPos = xPosOrg - xPosOrg / 3;
			}
			if(scale <= 1){
				scale += (1 - scale)/6;
			}
		}
	}

	transformLoop();
	function transformLoop(){
		inertiaLoop();
		centerLoop();
		$(".content").css("transform", "translate("+ xPos +"px,"+ yPos +"px) scale("+ scale +")");
		setTimeout(transformLoop, 16);
	}

	function sum(arr) {
		return arr.reduce(function(prev, current, i, arr) {
			return prev + current;
		});
	};
	function average(arr) {
			return sum(arr) / arr.length;
	};

	function transform_value(obj){
		var e = obj.css('transform');
		var values = e.split('(')[1];
		values = values.split(')')[0];
		values = values.split(', ');
		var matrix = {
			'scale-x': Number(values[0]),
			'rotate-p': Number(values[1]),
			'rotate-m': Number(values[2]),
			'scale-y': Number(values[3]),
			'transform-x': Number(values[4]),
			'transform-y': Number(values[5])
		};
		return matrix;
	}

});
