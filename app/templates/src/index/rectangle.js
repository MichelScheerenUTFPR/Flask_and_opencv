const htmlXY = {
	x1: document.getElementById("x1"),
    y1: document.getElementById("y1"),
    x2: document.getElementById("x2"),
    y2: document.getElementById("y2"),
}
const rect = {};
let drag = false;

(function initRectangle() {
	var desenho = document.getElementById('desenho');
	desenho.addEventListener('mousedown', mouseDown, false);
	desenho.addEventListener('mouseup', mouseUp, false);
	desenho.addEventListener('mousemove', mouseMove, false);
	desenho.addEventListener('mouseleave', mouseLeave, false);
	document.getElementById("refresh_button").setAttribute("onclick", "refresh_rectangle()");
	document.getElementById("clear_button").setAttribute("onclick", "clear_rectangle()");
}) ();

function mouseDown(e) {
	drag = true;
	rect.startX = e.pageX - this.offsetLeft;
	rect.startY = e.pageY - this.offsetTop;
	htmlXY.x1.value = rect.startX;
	htmlXY.y1.value = rect.startY;
}

function mouseMove(e) {
	if (drag) {
		rect.w = (e.pageX - this.offsetLeft) - rect.startX;
		rect.h = (e.pageY - this.offsetTop) - rect.startY;
		htmlXY.x2.value = rect.startX + rect.w;
		htmlXY.y2.value = rect.startY + rect.h;
	}
}

function mouseUp() {
	if(drag) {
		drag = false;
		draw();
		clear_aux_values();
	}
}

function mouseLeave(e) {
	drag = false;
	clear_aux_values();
}

function clear_aux_values() {
	rect.startX = 0;
	rect.startY = 0;
	rect.w = 0;
	rect.h = 0;
}

function draw() {
	let invalid_x = rect.startX == undefined || rect.startX == NaN || rect.w == undefined || rect.w == NaN;
	let invalid_y = rect.startY == undefined || rect.startY == NaN || rect.h == undefined || rect.h == NaN;
	let invalid_width = (rect.startX - (rect.startX + rect.w)) == 0
	let invalid_height = (rect.startY - (rect.startY + rect.h)) == 0
	if(invalid_x || invalid_y || invalid_width || invalid_height) {
		let title = "Retângulo inválido &#128533;";
		let body = "Por favor, tente selecionar novamente...";
		show_message(title, body, undefined, true)
		return;
	}

	axios.post(`{{url_for("get_measures")}}/${rect.startX}/${rect.startY}/
	${(rect.startX + rect.w)}/${(rect.startY + rect.h)}`);
}

function clear_rectangle(){
	axios.post("{{ url_for('clear_rectangle') }}");
	document.getElementById("labelUploadImage").innerHTML = "Escolher imagem local"
    htmlXY.x1.value = 0;
	htmlXY.x2.value = 0;
	htmlXY.y1.value = 0;
	htmlXY.y2.value = 0;
}

function refresh_rectangle(){
	let x1 = htmlXY.x1.value;
	let y1 = htmlXY.y1.value;
	let x2 = htmlXY.x2.value;
	let y2 = htmlXY.y2.value;
	let not_empty_points = x1.length>=1 && y1.length>=1 && x2.length>=1 && y1.length>=1;
	let is_int = parseInt(x1)==x1 && parseInt(y1)==y1 && parseInt(x2)==x2 && parseInt(y2)==y2
	let not_empty_area = ((parseInt(x1) - parseInt(x2)) != 0) && ((parseInt(y1) - parseInt(y2)) != 0);
	let gretter_than_zero = parseInt(x1)>=0 && parseInt(y1)>=0 && parseInt(x2)>=0 && parseInt(y2)>=0
	if(not_empty_points && is_int && not_empty_area && gretter_than_zero){
		axios.post(`{{url_for("get_measures")}}/${parseInt(x1)}/${parseInt(y1)}/${parseInt(x2)}/${parseInt(y2)}`);
	} else {
		invalid_refresh();
	}
}

function invalid_refresh() {
	let title = "Retângulo inválido &#128533;" 
	let body = "Verifique os valores inseridos e tente novamente..."
	show_message(title, body, undefined, true)
}
