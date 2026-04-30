const sky = document.querySelector('#sky');
const hotspots = document.querySelector('#hotspots');

/* COLORES */
const colorAula = "#00A8A8";     
const colorPasillo = "#AE874C";  
const colorHover = "#EDE5D6";

/* ESCENAS */
const escenas = {

pasillo1:{
hotspots:[
{tipo:"aula", destino:"aula1", posicion:"-3 1.5 -4", icono:"#icon3D"},
{tipo:"aula", destino:"aula2", posicion:"3 1.5 -4", icono:"#iconRobo"},
{tipo:"pasillo", destino:"pasillo2", posicion:"0 1.2 -5"}
]
},

pasillo2:{
hotspots:[
{tipo:"aula", destino:"aula3", posicion:"-3 1.5 -4", icono:"#iconSMT"},
{tipo:"aula", destino:"aula4", posicion:"0 1.5 -4", icono:"#iconManu", tamIcono:0.9},
{tipo:"aula", destino:"aula5", posicion:"3 1.5 -4", icono:"#iconRoco", tamIcono:0.9},
{tipo:"pasillo", destino:"pasillo1", posicion:"0 1.2 5"}
]
},

aula1:{ nombre:"Sala 3D", hotspots:[{tipo:"pasillo", destino:"pasillo1", posicion:"0 1.6 -3"}]},
aula2:{ nombre:"Laboratorio de Robotica Movil", hotspots:[{tipo:"pasillo", destino:"pasillo1", posicion:"0 1.6 -3"}]},
aula3:{ nombre:"Laboratorio SMT", hotspots:[{tipo:"pasillo", destino:"pasillo2", posicion:"0 1.6 -3"}]},
aula4:{ nombre:"Laboratorio de Manufactura", hotspots:[{tipo:"pasillo", destino:"pasillo2", posicion:"0 1.6 -3"}]},
aula5:{ nombre:"Laboratorio de Robotica Colaborativa", hotspots:[{tipo:"pasillo", destino:"pasillo2", posicion:"0 1.6 -3"}]}

};

/* TEXTO HOVER */
function crearTextoHover(nombre, grupo){

const texto = document.createElement('a-text');

texto.setAttribute('value', nombre);
texto.setAttribute('align', 'center');
texto.setAttribute('color', '#FFFFFF');
texto.setAttribute('position', '0 0.8 0');
texto.setAttribute('scale', '1 1 1');
texto.setAttribute('look-at','[camera]');
texto.setAttribute('class','no-click');

grupo.appendChild(texto);

return texto;
}

/* SONIDO */
function reproducirSonido(){
const sonido = document.querySelector('#clickSoundEntity');

if(sonido && sonido.components.sound){
sonido.components.sound.stopSound();
sonido.components.sound.playSound();
}
}

/* CLICK */
function clickEscena(objeto,destino){
objeto.addEventListener('click',()=>{
reproducirSonido();
cambiarEscena(destino);
});
}

/* ANIMACION FLOTANTE */
function animarFlotante(elemento, posicion){
const [x,y,z] = posicion.split(" ").map(Number);

elemento.setAttribute('animation__float', {
property: 'position',
dir: 'alternate',
dur: 1500,
loop: true,
to: `${x} ${y + 0.15} ${z}`
});
}

/* CREAR AULA */
function crearAula(destino,posicion,icono,tamIcono=0.5){

const grupo = document.createElement('a-entity');
grupo.setAttribute('position',posicion);
grupo.setAttribute('class','clickable');
grupo.setAttribute('look-at','[camera]');

animarFlotante(grupo, posicion);

const circulo = document.createElement('a-circle');
circulo.setAttribute('radius','0.45');
circulo.setAttribute('material',`color:${colorAula}; shader:flat`);
circulo.setAttribute('class','clickable');

grupo.appendChild(circulo);

if(icono){
const imagen = document.createElement('a-image');

imagen.setAttribute('src',icono);
imagen.setAttribute('width', tamIcono);
imagen.setAttribute('height', tamIcono);
imagen.setAttribute('position','0 0 0.02');
imagen.setAttribute('class','clickable');

grupo.appendChild(imagen);
clickEscena(imagen,destino);
}

/* HOVER */
let textoHover = null;

grupo.addEventListener('mouseenter',()=>{
circulo.setAttribute('material',`color:${colorHover}`);
grupo.setAttribute('scale','1.2 1.2 1.2');

const nombre = escenas[destino]?.nombre;
if(nombre){
textoHover = crearTextoHover(nombre, grupo);
}
});

grupo.addEventListener('mouseleave',()=>{
circulo.setAttribute('material',`color:${colorAula}`);
grupo.setAttribute('scale','1 1 1');

if(textoHover){
grupo.removeChild(textoHover);
textoHover = null;
}
});

clickEscena(grupo,destino);
hotspots.appendChild(grupo);
}

/* CREAR PASILLO */
function crearPasillo(destino,posicion){

const rombo = document.createElement('a-box');

rombo.setAttribute('depth','0.15');
rombo.setAttribute('height','0.7');
rombo.setAttribute('width','0.7');
rombo.setAttribute('rotation','0 45 0');
rombo.setAttribute('material',`color:${colorPasillo}`);
rombo.setAttribute('class','clickable');
rombo.setAttribute('position',posicion);
rombo.setAttribute('look-at','[camera]');

animarFlotante(rombo, posicion);

rombo.addEventListener('mouseenter',()=>{
rombo.setAttribute('material',`color:${colorHover}`);
rombo.setAttribute('scale','1.2 1.2 1.2');
});

rombo.addEventListener('mouseleave',()=>{
rombo.setAttribute('material',`color:${colorPasillo}`);
rombo.setAttribute('scale','1 1 1');
});

clickEscena(rombo,destino);
hotspots.appendChild(rombo);
}

/* BOTON SALIR */
function crearSalir(){

const boton = document.createElement('a-circle');

boton.setAttribute('radius','0.12');
boton.setAttribute('material','color:#FF0000; shader:flat');
boton.setAttribute('class','clickable');
boton.setAttribute('position','0 0.05 -1.5');
boton.setAttribute('look-at','[camera]');

boton.addEventListener('mouseenter',()=>{
boton.setAttribute('scale','1.2 1.2 1.2');
});

boton.addEventListener('mouseleave',()=>{
boton.setAttribute('scale','1 1 1');
});

boton.addEventListener('click',()=>{
reproducirSonido();
window.location.href = "index.html";
});

hotspots.appendChild(boton);
}

/* CAMBIAR ESCENA */
function cambiarEscena(destino){

if(!escenas[destino]) return;

sky.setAttribute('animation__fadeout',{
property:'material.opacity',
to:0,
dur:500
});

setTimeout(()=>{

sky.setAttribute('src','#'+destino);

sky.setAttribute('animation__fadein',{
property:'material.opacity',
to:1,
dur:500
});

hotspots.innerHTML="";
actualizarHotspots(destino);

},500);
}

/* ACTUALIZAR */
function actualizarHotspots(escena){

const data = escenas[escena];
if(!data) return;

data.hotspots.forEach(h=>{
if(h.tipo==="aula") crearAula(h.destino,h.posicion,h.icono,h.tamIcono);
if(h.tipo==="pasillo") crearPasillo(h.destino,h.posicion);
});

crearSalir();
}

/* INICIO */
actualizarHotspots("pasillo1");
