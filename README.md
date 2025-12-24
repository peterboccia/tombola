# Tombola App

Una semplice web app (HTML + JavaScript puro) per gestire il tabellone della Tombola: con estrazione dei numeri 1–90, evidenziazione sul tabellone e visualizzazione dell'ultimo e di tutti i precedenti numeri in ordine di chiamata.

## Funzionalità
- Nuova partita: azzera le estrazioni e ripulisce il tabellone.
- Estrai numero: estrae casualmente un numero tra 1 e 90 non ancora chiamato, evidenziandolo in verde. Il tutto reso più naturale con un'attesa con animazione e rendere il gioco più divertente. Aggiunta infine shortcut per velocizzare e facilitare l'operazione (SPAZIO).
- Ultimo numero chiamato: mostra l'ultima estrazione.
- Numeri precedenti: mostra in un pannello dal penultimo numero estratto fino all'inizio (in ordine dal penultimo estratto).
- Coming Soon: Calcola premi: pulsante segnaposto (per calcolare i premi servono le cartelle dei giocatori, non incluse in questa app).
- FullScreen: possibilità di mostrare a tutto schermo dall'apposito pulsante (alternativa al semplice F11 del browser).

## Layout
- Riga superiore con menu.
- Landscape: tabellone a sinistra (≈80%), pannello a destra (≈20%) con pulsante "Estrai numero" e le due box una sotto l’altra.
- Portrait: in alto le due box affiancate con a lato "Estrai numero"; sotto, il tabellone.

## Come usare online
Per utilizzarlo per le tue feste basta accedere alla pagina demo dedicata: [Tombola App](https://peterboccia.github.io/tombola/)

## Come usarlo in locale
1. Scarica il repo
2. Apri il file `index.html` con un browser moderno (Chrome, Edge, Firefox, Safari).

## Struttura del progetto
- `index.html`: markup della pagina.
- `style.css`: stili globali dell'app
- `tombola.js`: logica dell’app (stato, estrazioni, aggiornamento UI) e molto importante **costanti** (Tra cui la costante di animazione dell'estrazione qualora si voglia ridurla o allungarla in durata.
- `README.md`: questo file.

## ***Buone feste***
Questo progetto è stato ideato e sviluppato per gioco da Pietro Boccia utilizzando semplicemente HTML, CSS e Javascript per rendere più facili le tombolate tra amici specie in associazioni, oratori e altri centri di incontro in cui la gestione del tabellone a schermo possa essere facilitata.

- Quando tutti i numeri sono estratti, il pulsante "Estrai numero" viene disabilitato.

