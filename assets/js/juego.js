(() => {
  'use strict'


  let deck = [];

const tipos = ["C", "D", "H", "S"];
const especiales = ["A", "J", "Q", "K"];

let puntosJugador = 0;
let puntosComputadora = 0;

let puntos;

// Referencias del HTML

const btnPedir = document.querySelector("#btnPedir");
const btnNuevo = document.querySelector("#btnNuevo");
const btnDetener = document.querySelector("#btnDetener");

const divCartasJugador = document.querySelector("#jugador-cartas");
const divCartasComputadora = document.querySelector("#computadora-cartas");

const sumaPuntosSmall = document.querySelectorAll("small");

//creacion de la baraja
const crearDeck = () => {
  for (let i = 2; i <= 10; i++) {
    for (let tipo of tipos) {
      deck.push(i + tipo);
    }
  }

  for (let especial of especiales) {
    for (let tipo of tipos) {
      deck.push(especial + tipo);
    }
  }

  deck = _.shuffle(deck);
};
crearDeck();

//la funcion que deja pedir carta
const pedirCarta = () => {
  if (deck.length === 0) {
    throw "No hay mas cartas en el deck";
  }

  const carta = deck.pop();

  return carta;
};

const valorCarta = (carta) => {
  const valor = carta.substring(0, carta.length - 1);

  isNaN(valor) ? (puntos = valor === "A" ? 11 : 10) : (puntos = valor * 1);

  return puntos;
};

// turno de la computadora

const turnoComputadora = (puntosMinimos) => {
  do {
    const carta = pedirCarta();

    puntosComputadora = puntosComputadora + valorCarta(carta);
    console.log(carta);
    console.log(puntosComputadora);
    sumaPuntosSmall[1].innerHTML = puntosComputadora;

    const imgCarta = document.createElement("img");

    imgCarta.src = `assets/cartas/${carta}.png`;
    imgCarta.classList.add("carta");

    divCartasComputadora.append(imgCarta);

    if (puntosMinimos > 21) {
      break;
    }
  } while (puntosMinimos > puntosComputadora && puntosMinimos <= 21);

  
  setTimeout(() => {
    if (puntosComputadora > 21) {
      alert("Ganaste");
    } else if (puntosComputadora > puntosJugador) {
      alert("Perdiste");
    } else if (puntosComputadora === puntosJugador) {
      alert("No gano nadie");
    } else {
      alert('Perdiste (te pasaste de 21)')
    }
  }, 100);

};

btnPedir.addEventListener("click", () => {
  const carta = pedirCarta();

  puntosJugador = puntosJugador + valorCarta(carta);
  console.log(carta);
  console.log(puntosJugador);
  sumaPuntosSmall[0].innerHTML = puntosJugador;

  const imgCarta = document.createElement("img");

  imgCarta.src = `assets/cartas/${carta}.png`;
  imgCarta.classList.add("carta");

  divCartasJugador.append(imgCarta);

  if (puntosJugador > 21) {
    // setTimeout(() => {
    //   alert("Perdiste");
    // }, 100);
console.log('Perdiste');
btnPedir.disabled = true;
btnDetener.disabled = true;

turnoComputadora(puntosJugador);
} else if (puntosJugador === 21) {
    console.log('Gozaste');
    btnPedir.disabled = true;
    btnDetener.disabled = true;
    turnoComputadora(puntosJugador);
  }
});

btnDetener.addEventListener("click", () => {
  btnPedir.disabled = true;
  btnDetener.disabled = true;
  turnoComputadora(puntosJugador);

});


btnNuevo.addEventListener("click", () => {
  divCartasComputadora.innerHTML = " ";
  divCartasJugador.innerHTML = " ";

  btnPedir.disabled = false;
  btnDetener.disabled = false;

  puntosJugador = 0;
  puntosComputadora = 0;
  sumaPuntosSmall[0].innerHTML = puntosJugador;
  sumaPuntosSmall[1].innerHTML = puntosComputadora;

  deck = [];
  crearDeck();
});







})();

