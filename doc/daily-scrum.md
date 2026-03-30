## Daily Scrum

# Måndag - 09-03-2026
- Sunsanee: Jag planerade user stories och mappstrukturen för applikationen.
- Felicia: Började med att skapa filerna till backenddelen och påbörjat i serverless.yml. 

# Tisdag - 10-03-2026
- Sunsanee: Jag har skapat den grundläggande frontend‑mappen och lagt till de nödvändiga dependencies som projektet behöver. 
- Felicia: Söker upp efter vissa program som finns i Javascript men inte i Python så kollar igenom om det finns någon liknande. Förberedd med utils-mapp som finns bcrypt, jwt och uuid, respons, services-mapp som client, models-mapp om schemana och middlewares-mapp som validate, errorhandler och authenticate.

# Onsdag - 11-03-2026
- Sunsanee: Fortsätter med grundläggande funktioner som vi kan återanvända t.ex. button, interface för user. Utöver börjar jag arbeta med StartPage.
- Felicia: Börjar med auth funktion som registerUser och loginUser.

# Torsdag - 12-03-2026
- Sunsanee: Fortsätter med login page och register page för både TypeScript och CSS.
- Felicia: Färdig med registerUser och loginUser, börja med postBook, getBooks, getBookById, getBookByStatus, putBookById och deleteBookById.

# Fredag - 13-03-2026
- Sunsanee: Jag försöker koppla ihop routes för login och register för att kunna testa att de fungerar medan jag väntar på att backend‑delen för inloggning och registrering blir färdig. 
- Felicia: Färdig med alla funktioner, skulle köra serverless deploy finns problemen med att vissa program finns men går inte att hitta.

# Lördag - 14-03-2026
- Sunsanee: Jag har skapat auth-tabs så att användare kan växla mellan login och register, och jag har lagt till CSS för att styla dem. Jag har också börjat arbeta med home-sidan genom att skriva en enkel kod och route som visar texten "Home page" i webbläsaren, för att säkerställa att allt fungerar och att rätt route är kopplad. 
- Felicia: 

# Söndag - 15-03-2026
- Sunsanee: Jag har testat att koppla API:et från OpenLibrary för att hämta böcker och skapa en book‑list på startsidan. Tanken är att book‑listan ska visa varje bok i ett kort i homepage.
- Felicia: Försöker med docker och fungerar fortfarande inte

# Måndag - 16-03-2026
- Sunsanee: Går gemon vår figma designen och justerar CSS.
- Felicia: Hitta problem är att bcrypt fungera inte

# Tisdag - 17-03-2026
- Sunsanee: Fortsätt med HomePage och lägga till eye ikon i login och register för att toggle med att visa password.
- Felicia: Har bokat tid med Jesper, har tagit bort docker och bcrypt då fungerar det, så loginUser och registerUser fugerar nu.

# Onsdag - 18-03-2026
- Sunsanee: Åtgärder book-api för att slumpa ut 20 böcker. 
- Felicia: Justera funktion getBooks, postBook och getBookById då de fungera efter deploya upp till aws.

# Torsdag - 19-03-2026
- Sunsanee: fortsätter med book API
- Felicia: Justera funktion putBook, deleteBookById och getBookById då de fungera efter deploya upp till aws.

# Fredag - 20-03-2026
- Sunsanee: Same - same, fortsätter med book API. Har hittat hinder att en fetch api funktion inte kunde hämta böckerna i olika ketegori eftersom Open Libary använder "subject" istället för "category". 
- Felicia: Fixar till getBookByStatus så det fungera. Testa om allting fungera.

# Lördag - 21-03-2026
- Sunsanee: Breake
- Felicia: Breake

# Söndag - 22-03-2026
- Sunsanee: Arbetar med ProtectedRoute, Layout, Header och Navbar.
- Felicia: Skapa en getUser funktion. Koppla med funktion i profilePage.

# Måndag - 23-03-2026
- Sunsanee: Arbetar med CSS. 
- Felicia: Börja med detailPage och får ut bok innehåller från openlibrary api.

# Tisdag - 24-03-2026
- Sunsanee: Fortsätter med CSS.
- Felicia: Koppla loginUser api och funktion i frontend. fortsätt med detailPage med css

# Onsdag - 25-03-2026
- Sunsanee: Test applikation och se till att api fukar fel fritt, samt justerar CSS vid behov.
- Felicia: Koppla registerUser api med funktion i frontend. Fixar till shelfpage med getBooks api för att visa alla böckerna som man har sparat.

# Torsdag - 26-03-2026
- Sunsanee: Fixat search resultat så att den ska koppla till både i search-form och search page. Upptäckte att det var fel kopplad.
- Felicia: Fixar till knappfunktion till status. Fixar bugg med status efter handledning.

# Fredag - 27-03-2026
- Sunsanee: Test applikation och åtgärder felet.
- Felicia: Fixar bugg på logout knapp i profilePage.

# Lördag - 28-03-2026
- Sunsanee: Test applikation. åtgärder CSS
- Felicia: Justera i profilePage med info och stylar till lite.

# Söndag - 29-03-2026
- Sunsanee: Har ändrat design för book-detail till pop-up modal.
- Felicia: Skapa updateUser i backend och koppla upp den till funktionen i frontend.

# Måndag - 30-03-2026
- Sunsanee: Fixar css detaljer
- Felicia: Fixar till lite med stylar