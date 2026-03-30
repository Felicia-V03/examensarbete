# TEST INSTRUKTIONER – Bookory

## HOW IT WORKS

## Förutsättningar
- Öppen upp koden med VScode och in i frontend mappen med (cd bookory-frontend)
- Förberedd koden med install allting med (npm i)
- Appen körs lokalt (`npm run dev`)
- Backenden är igång och åtkomlig
- Du har tillgång till en testanvändare (eller skapar en under testet)
- Öppna upp AWS och logga in med denna loggning uppgifter:
ID : 747901701476
Username : IAMtester
Lösenord : Teast1234

---

## 1. Startsida (`/`)

| # | Teststeg | Förväntat resultat |
|---|----------|--------------------|
| 1 | Öppna appen i webbläsaren | Startsidan visas med logo och två knappar: "Log in" och "Register" |
| 2 | Klicka på "Log in" | Navigeras till `/login` |
| 3 | Klicka på "Register" | Navigeras till `/register` |

---

## 2. Registrering (`/register`)

| # | Teststeg | Förväntat resultat |
|---|----------|--------------------|
| 1 | Öppna `/register` | Registreringsformulär visas |
| 2 | Fyll i alla fält korrekt (namn, e-post, lösenord, bekräfta lösenord) | "Registrera"-knappen aktiveras |
| 3 | Ange lösenord som inte matchar bekräftelsen | Knappen förblir inaktiv |
| 4 | Lämna ett fält tomt | Knappen förblir inaktiv |
| 5 | Skicka in korrekt ifyllt formulär | Omdirigeras till `/login` |

---

## 3. Inloggning (`/login`)

| # | Teststeg | Förväntat resultat |
|---|----------|--------------------|
| 1 | Öppna `/login` | Inloggningsformulär visas |
| 2 | Lämna e-post eller lösenord tomt | "Logga in"-knappen är inaktiv |
| 3 | Ange felaktiga uppgifter och skicka | Felmeddelande visas, ingen omdirigering |
| 4 | Ange korrekta uppgifter och skicka | Omdirigeras till `/home`, token sparas i localStorage |

---

## 4. Skyddade routes (ej inloggad)

| # | Teststeg | Förväntat resultat |
|---|----------|--------------------|
| 1 | Navigera direkt till `/home` utan att vara inloggad | Omdirigeras till `/` |
| 2 | Navigera direkt till `/shelf` utan att vara inloggad | Omdirigeras till `/` |
| 3 | Navigera direkt till `/profile` utan att vara inloggad | Omdirigeras till `/login` |

---

## 5. Hem (`/home`)

| # | Teststeg | Förväntat resultat |
|---|----------|--------------------|
| 1 | Logga in och navigera till `/home` | Böcker laddas och visas en viss random av böckerna |
| 2 | Vänta på laddning | En laddningsindikator visas under hämtning |
| 3 | Klicka på en bok | Navigeras till `/detail/:bookId` |
| 4 | Kontrollera navbar | Home, Explore, Library, Profile visas – Home är aktiv |

---

## 6. Söksida (`/search`)

| # | Teststeg | Förväntat resultat |
|---|----------|--------------------|
| 1 | Navigera till `/search` | Sökfält visas, inga resultat ännu |
| 2 | Skriv en söksträng och skicka formuläret | Böcker från Open Library visas |
| 3 | Navigera till `/search?q=harry+potter` | Sökning körs automatiskt med den frasen |
| 4 | Söka efter något som inte finns | "Inga resultat" eller tom lista visas |
| 5 | Klicka "More details" på ett sökresultat | Navigeras till `/detail/:bookId` |

---

## 7. Bokinformation (`/detail/:bookId`)

| # | Teststeg | Förväntat resultat |
|---|----------|--------------------|
| 1 | Öppna en bok från hem- eller söksidan | Titel, författare och bokinfo visas |
| 2 | Välj en lässtatus (t.ex. "Läser") och spara | Boken sparas i backend |
| 3 | Ändra lässtatus på en redan sparad bok | Status uppdateras |
| 4 | Ta bort en sparad bok | Boken tas bort från hyllan |

---

## 8. Hylla (`/shelf`)

| # | Teststeg | Förväntat resultat |
|---|----------|--------------------|
| 1 | Navigera till `/shelf` | Alla sparade böcker visas med omslag och status |
| 2 | Kontrollera att en nyss sparad bok finns med | Boken syns i listan |
| 3 | Klicka på en bok | Navigeras till `/detail/:bookId` |
| 4 | Verifiera tom hylla (ny användare) | Tomt tillstånd visas (ingen krasch) |

---

## 9. Profil (`/profile`)

| # | Teststeg | Förväntat resultat |
|---|----------|--------------------|
| 1 | Navigera till `/profile` | Profilinformation visas (namn, e-post, trtelefonnummer och addressen) |
| 2 | Klicka "Edit Profile" | Redigeringsformulär visas |
| 3 | Ändra e-post/telefon/address och spara | Framgångsmeddelande visas, ny data syns |
| 4 | Avbryt redigering utan att spara | Ursprunglig data visas oförändrad |

---

## 10. Utloggning

| # | Teststeg | Förväntat resultat |
|---|----------|--------------------|
| 1 | Logga ut (via profilsidan eller navbar) | Token tas bort från localStorage |
| 2 | Försök nå `/home` efter utloggning | Omdirigeras till `/` |