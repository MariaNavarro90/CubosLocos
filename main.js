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
    ubicarElemento(elemento, posicion);
    parent.appendChild(elemento);
}

function ubicarElemento(elemento, posicion)
{
    elemento.setAttribute("style", "left:" + posicion.x  + "px;top:" + posicion.y + "px");
}

function eliminarCubo(evento)
{
    let cuboDOM = evento.target;
    let posicionX = Number(cuboDOM.getAttribute("posicion-x"));
    let posicionY = Number(cuboDOM.getAttribute("posicion-y"));
    let cubo = juego.tablero.celdas[posicionY][posicionX];
    cubo.eliminar = true;
    juego.tablero.marcarAreaCubos(cubo);
    juego.nuevaRonda();
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
    constructor(posicion,color, id)
    {
        this.posicion = posicion;
        this.color = color;
        this.eliminar = false;
        this.id = id;
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
        var index = 0;
        for(let i = 0; i < this.ancho;i++){
            this.celdas[i] = [];
            for(let j = 0; j < this.alto;j++){
                let idCubo = "cubo-" + index.toString();
                this.celdas[i][j] = new Cubo(new Vector2D(i,j) ,colorRandom(), idCubo);
                index++;
            }
        }
    }

    imprimirCeldas()
    {
        let juegoDOM = document.getElementById("juego");
        juegoDOM.innerHTML = "";
        for(let y = 0; y < this.celdas.length; y++)
        {
            for (let x = 0; x < this.celdas[y].length; x++)
            {
                if (this.celdas[y][x].length != 0)
                {
                    let cuboDOM = document.createElement("div");
                    cuboDOM.classList.add("cubo");
                    cuboDOM.classList.add(this.celdas[y][x].color);
                    let posicion = new Vector2D(y,x);
                    posicion.Multiplicar(40);
                    cuboDOM.setAttribute("posicion-x",x);
                    cuboDOM.setAttribute("posicion-y",y);
                    cuboDOM.setAttribute("id", this.celdas[y][x].id);
                    cuboDOM.onclick = eliminarCubo;
                    instanciarElemento(cuboDOM, juegoDOM, posicion);  
                }
            }
        }
    }

    marcarAreaCubos(cubo)
    {
        let x = cubo.posicion.x;
        let y = cubo.posicion.y;
        let celdas = this.celdas;
        
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
            this.marcarAreaCubos(cubosVecinos[i]);
        }
    }

    eliminarCubos()
    {
        let celdas = this.celdas;
        for (let y = 0; y < celdas.length; y++)
        {
            for(let x = 0; x < celdas[y].length; x++)
            {
                if (celdas[y][x].length != 0 && celdas[y][x].eliminar == true)
                {
                    celdas[y][x] = [];
                    let cuboDOM = document.querySelector('[posicion-x="' + x + '"][posicion-y="' + y + '"]');
                    cuboDOM.remove();
                }
            }
        }
    }

    reordenarCubos()
    {
        let celdas = this.celdas;
        for (let a = 0; a < celdas.length; a++)
        {
            for (let y = celdas.length - 1; y >= 0; y--)
            {
                for (let x = 0; x < celdas[y].length; x++)
                {
                    if (celdas[y][x].length == 0 || typeof celdas[y][x] == 'undefined')
                    {
                        if (y > 0 && typeof celdas[y - 1][x] != 'undefined' && celdas[y - 1][x].length != 0)
                        {
                            celdas[y][x] = celdas[y - 1][x];
                            celdas[y][x].posicion.x = x;
                            celdas[y][x].posicion.y = y;
                            celdas[y - 1][x] = [];
                        }
                    }
                }
            }
        }
    }

    bajarCubos()
    {
        let celdas = this.celdas;
        for (let y = 0; y < celdas.length; y++)
        {
            for (let x = 0; x < celdas[y].length; x++)
            {
                if (celdas[y][x].length != 0)
                {
                    let cubo = celdas[y][x];
                    let cuboDOM = document.getElementById(cubo.id.toString());
                    let yPos = Number(cuboDOM.getAttribute("posicion-y"));
                    if (yPos != cubo.posicion.y)
                    {
                        let nuevaPosicion = new Vector2D(y,x);
                        nuevaPosicion.Multiplicar(40);
                        cuboDOM.setAttribute("posicion-x", cubo.posicion.x);
                        cuboDOM.setAttribute("posicion-y", cubo.posicion.y);
                        ubicarElemento(cuboDOM, nuevaPosicion);
                    }
                }
            }
        }
    }

}
class Jugador
{
    constructor(nombre)
    {
        this.nombre = nombre;
        this.puntaje = 0;
    }  
}
class Juego
{
    constructor()
    {
        this.tablero = new Tablero(10,10);
        this.jugador = document.getElementById("nombreJugador").value;
        this.comenzarJuego();
    }

    comenzarJuego()
    {
        this.tablero.completarCeldas();
    }

    mostrarJuego()
    {
        this.tablero.imprimirCeldas();
    }

    nuevaRonda()
    {
        this.tablero.eliminarCubos();
        this.tablero.reordenarCubos();
        this.tablero.bajarCubos();
    }
}

var juego;

function Iniciar()
{
    juego = new Juego();
    juego.mostrarJuego();
    let puntajesDOM = document.getElementById("mejoresPuntajes");
    let jugador = document.createElement("li");
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