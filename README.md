# Tombola (Tabellone 1–90)

Una semplice web app (HTML + JavaScript puro) per gestire il tabellone della Tombola: estrazione numeri 1–90, evidenziazione sul tabellone e visualizzazione dell'ultimo e del precedente numero chiamato.

## Funzionalità
- Nuova partita: azzera le estrazioni e ripulisce il tabellone.
- Estrai numero: estrae casualmente un numero tra 1 e 90 non ancora chiamato, evidenziandolo in verde.
- Ultimo numero chiamato: mostra l'ultima estrazione.
- Numero precedente: mostra la penultima estrazione.
- Calcola premi: pulsante segnaposto (per calcolare i premi servono le cartelle dei giocatori, non incluse in questa app).

## Layout
- Riga superiore con menu: "Nuova partita", "Calcola premi", "Informazioni".
- Landscape: tabellone a sinistra (≈70%), pannello a destra (≈30%) con pulsante "Estrai numero" e le due box una sotto l’altra.
- Portrait: in alto le due box affiancate ("Ultimo numero chiamato" e "Numero precedente") con a lato "Estrai numero"; sotto, il tabellone.

## Come usare
1. Apri il file `index.html` con un browser moderno (Chrome, Edge, Firefox, Safari).
2. Clicca "Estrai numero" per estrarre un numero non ancora chiamato.
3. "Nuova partita" per ricominciare da zero.
4. "Calcola premi" mostra un avviso: è un segnaposto.

## Struttura del progetto
- `index.html`: markup e stili della pagina.
- `tombola.js`: logica dell’app (stato, estrazioni, aggiornamento UI).
- `README.md`: questo file.

## Note
- Tutto è implementato in HTML/JS puro, senza dipendenze esterne.
- Il tabellone è 10×9, numeri 1–90.
- Quando tutti i numeri sono estratti, il pulsante "Estrai numero" viene disabilitato.
