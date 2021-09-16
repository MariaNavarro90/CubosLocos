function colorRandom()
{
    let color = "";
    let numero = Math.floor(Math.random()*3);
    switch(numero){
        case 0:
            color = "rojo";
            break;
        case 1:
            color = "verde";
            break;
        case 2:
            color = "azul";
            break;
        default:
            color ="rojo"; 
            break;
    }
    return color;
}

function instanciarElemento(elemento, parent, posicion)
{
    elemento.setAttribute("style", "left:" + posicion.x  + "px;top:" + posicion.y + "px");
    parent.appendChild(elemento);
}

function eliminarCubo(evento)
{
    let cuboDOM = evento.target;
    let posicionX = Number(cuboDOM.getAttribute("posicion-x"));
    let posicionY = Number(cuboDOM.getAttribute("posicion-y"));
    console.log("posicion-x: " + posicionX + " / posicion-y: " + posicionY);
    console.log(juego.tablero.celdas[posicionY][posicionX].posicion);
    let cubo = juego.tablero.celdas[posicionY][posicionX];
    cubo.eliminar = true;
    marcarCubosAdjacentes(cubo);
    eliminarCubos();
}

function marcarCubosAdjacentes(cubo)
{
    let x = cubo.posicion.x;
    let y = cubo.posicion.y;
    let celdas = juego.tablero.celdas;
    
    let cubosVecinos = [];

    // Cubo superior
    if (y > 0 && typeof celdas[y - 1][x] != 'undefined')
    {
        if (cubo.color == celdas[y - 1][x].color && celdas[y - 1][x].eliminar == false)
        {
            cubosVecinos.push(celdas[y - 1][x]);
            celdas[y - 1][x].eliminar = true;
        }
    }

    // Cubo inferior
    if (y < celdas.length - 1 && typeof celdas[y + 1][x] != 'undefined')
    {
        if (cubo.color == celdas[y + 1][x].color && celdas[y + 1][x].eliminar == false)
        {
            cubosVecinos.push(celdas[y + 1][x]);
            celdas[y + 1][x].eliminar = true;
        }
    }

    // Cubo izquierdo
    if (x > 0 && typeof celdas[y][x - 1] != 'undefined')
    {
        if (cubo.color == celdas[y][x - 1].color && celdas[y][x - 1].eliminar == false)
        {
            cubosVecinos.push(celdas[y][x - 1]);
            celdas[y][x - 1].eliminar = true;
        }
    }

    // Cubo derecho
    if (x < celdas[y].length - 1 && typeof celdas[y][x + 1] != 'undefined')
    {
        if (cubo.color == celdas[y][x + 1].color && celdas[y][x + 1].eliminar == false)
        {
            cubosVecinos.push(celdas[y][x + 1]);
            celdas[y][x + 1].eliminar = true;
        }
    }

    for (let i = 0; i < cubosVecinos.length; i++)
    {
        marcarCubosAdjacentes(cubosVecinos[i]);
    }
}

function eliminarCubos()
{
    let celdas = juego.tablero.celdas;
    for (let y = 0; y < celdas.length; y++)
    {
        for(let x = 0; x < celdas[y].length; x++)
        {
            if (celdas[y][x] != 0 && celdas[y][x].eliminar == true)
            {
                celdas[y][x] = [];
                let cuboDOM = document.querySelector('[posicion-x="' + x + '"][posicion-y="' + y + '"]');
                cuboDOM.remove();
            }
        }
    }
}

class Vector2D
{
    constructor(y,x)
    {
        this.x = x;
        this.y = y;
    }

    Sumar(vector2d)
    {
        this.x += vector2d.x;
        this.y += vector2d.y;
    }

    Multiplicar(f)
    {
        this.x *= f;
        this.y *= f;
    }
}

class Cubo
{
    constructor(posicion,color)
    {
        this.posicion = posicion;
        this.color = color;
        this.eliminar = false;
    }
}
class Tablero
{
    constructor(ancho,alto)
    {
        this.ancho = ancho;
        this.alto = alto;
    }

    celdas = [];

    completarCeldas()
    {
        for(let i = 0; i < this.ancho;i++){
            this.celdas[i] = [];
            for(let j = 0; j < this.alto;j++){
                this.celdas[i][j] = new Cubo(new Vector2D(i,j) ,colorRandom());
            }
        }
    }

    imprimirCeldas()
    {
        let juegoDOM = document.getElementById("juego");
        for(let y = 0; y < this.celdas.length; y++)
        {
            for (let x = 0; x < this.celdas[y].length; x++)
            {
                let cuboDOM = document.createElement("div");
                cuboDOM.classList.add("cubo");
                cuboDOM.classList.add(this.celdas[y][x].color);
                let posicion = new Vector2D(y,x);
                posicion.Multiplicar(50);
                cuboDOM.setAttribute("posicion-x",x);
                cuboDOM.setAttribute("posicion-y",y);
                cuboDOM.onclick = eliminarCubo;
                instanciarElemento(cuboDOM, juegoDOM, posicion);  
            }
        }
    }
}
class Jugador
{
    constructor(nombre){
        this.nombre = nombre;
        this.puntaje = 0;
    }  
}
class Juego
{
    constructor(){
        this.tablero = new Tablero(10,10);
        console.log("clase juego: " + document.getElementById("nombreJugador"));
        this.jugador = document.getElementById("nombreJugador").value;
        this.comenzarJuego();
    }

    comenzarJuego(){
        this.tablero.completarCeldas();
    }

    mostrarJuego(){
        console.log(this.jugador.nombre);
        this.tablero.imprimirCeldas();
    }
}

var juego;

function Iniciar()
{
    juego = new Juego();
    juego.mostrarJuego();
    let puntajesDOM = document.getElementById("mejoresPuntajes");
    let jugador = document.createElement("li");
    console.log("jugador: " + juego.jugador);
    jugador.innerText = juego.jugador;
    puntajesDOM.appendChild(jugador);
    document.getElementById("splash").remove();
}

var botonInicio = document.getElementById("comenzar");
botonInicio.onclick = () => {
    if(document.getElementById("nombreJugador").value != "")
    {
        Iniciar();
    }
}