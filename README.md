# Tombola App

Una semplice web app (HTML + JavaScript puro) per gestire il tabellone della Tombola: con estrazione dei numeri 1–90, evidenziazione sul tabellone e visualizzazione dell'ultimo e di tutti i precedenti numeri in ordine di chiamata.

## Funzionalità
- Nuova partita: azzera le estrazioni e ripulisce il tabellone.
- Estrai numero: estrae casualmente un numero tra 1 e 90 non ancora chiamato, evidenziandolo in verde. Shortcut per velocizzare e facilitare l'operazione (SPAZIO).
- **Chiamata vocale del numero**: ad ogni estrazione, il numero e la sua descrizione vengono letti ad alta voce tramite sintesi vocale (Speech Synthesis). Questa funzione è abilitata di default e può essere disabilitata/riabilitata dal menu delle impostazioni (icona ingranaggio).
- La funzione di chiamata vocale utilizza la tecnologia [Web Speech API - SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) integrata nei browser moderni. La lingua utilizzata è l'italiano (it-IT). Se il browser non supporta la sintesi vocale, la funzione viene ignorata automaticamente.

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

- `index.html`: markup della pagina.
- `style.css`: stili globali dell'app
- `tombola.js`: logica dell’app (stato, estrazioni, aggiornamento UI, sintesi vocale, costanti tra cui la durata animazione estrazione).
- `README.md`: questo file.

## Ultime considerazioni
In rete esistono numerosi strumenti dedicati alla gestione della tombola.  
Questo progetto non nasce con l’obiettivo di competere con soluzioni più avanzate, ma di rispondere a esigenze pratiche emerse durante partite reali: la mancanza di tutti i numeri nel *ruoto* (o molti scheggiati) del tabellone completo, la gestione del gioco in contesti con molte persone e la necessità di rendere i numeri estratti ben visibili a tutta la platea.
Da qui infatti la scelta di renderlo il più semplice solo HTML e Javascript così da poterlo renderlo anche "standalone" (e cioè: scarichi lo zip e lo porti dove vuoi e lo lanci anche senza connessione).

Per questo motivo il layout è stato progettato per occupare il 100% dello schermo, sia in altezza che in larghezza, così da poter essere mostrato su monitor o proiettori senza necessità di scrolling.

Sarebbe possibile integrare anche la gestione delle cartelle, con marcatura automatica dei numeri - funzionalità già presente in diverse soluzioni open‑source facilmente reperibili online - ma non era questo il mio obiettivo. Preferisco mantenere il piacere del segnare manualmente, con scorze di mandarini magari. Infine le cartelle in formato PDF sono comunque facilmente scaricabili e stampabili, così da poter avere la tombola ovunque disponibile home-made!

Il tabellone tradizionale è sempre stato molto apprezzato: ricordo che chi lo prendeva giocava con sei cartelle contemporaneamente, e non tutti erano disposti a sostenerne il costo o il compito.  
Con questo progetto, invece, chiunque può gestire la tombola in autonomia.

## ***Buone feste***
Questo progetto è stato ideato e sviluppato per gioco da Pietro Boccia utilizzando semplicemente HTML, CSS e Javascript per rendere più facili le tombolate tra amici specie in associazioni, oratori e altri centri di incontro in cui la gestione del tabellone a schermo possa essere facilitata.

- Quando tutti i numeri sono estratti, il pulsante "Estrai numero" viene disabilitato.


