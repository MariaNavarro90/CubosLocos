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

class Vector2D
{
    constructor(x,y)
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
    constructor(vector2d,color)
    {
        this.vector2d = vector2d;
        this.color = color;
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
                let posicion = new Vector2D(x,y);
                posicion.Multiplicar(50);
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
        this.jugador = new Jugador(prompt("Ingrese su nombre de usuario"));
        this.tablero = new Tablero(10,10);
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

var juego = new Juego();
juego.mostrarJuego();