# Minesweeper

Aplikacja Sapera przygotowana w React + TypeScript. Plansze nie są generowane losowo — aplikacja korzysta z poziomów dostarczonych w pliku JSON.

## 1. Jak uruchomić

Projekt wymaga zainstalowanego Node.js i npm.

Instalacja zależności:

```bash
npm install
```

Uruchomienie projektu:

```bash
npm run dev
```

Uruchomienie testów:

```bash
npm test
```

Build produkcyjny:

```bash
npm run build
```

## 2. Co zrobiłam, a czego nie i dlaczego

Zaimplementowałam logikę Sapera zgodnie z wymaganiami zadania: wczytywanie gotowych plansz, odkrywanie pól, flagowanie, kaskadę, bezpieczne pierwsze odkrycie, warunki wygranej i przegranej oraz chording.

Interfejs pozwala wybrać poziom, zrestartować aktualną planszę, stawiać flagi prawym przyciskiem myszy oraz pokazuje licznik pozostałych min i wynik gry. Po przegranej widoczne są wszystkie miny, a mina, która została wcześniej poprawnie oflagowana, jest oznaczona zarówno flagą, jak i miną.

Nie rozdzielałam liczby min i liczby postawionych flag na dwa osobne liczniki oraz nie ograniczałam liczby flag, ponieważ specyfikacja definiuje licznik jako liczbę min na planszy pomniejszoną o liczbę postawionych flag. W efekcie możliwe jest postawienie większej liczby flag niż faktycznie istniejących min i uzyskanie ujemnej wartości licznika, mimo że miny nadal znajdują się na planszy.

W pełniejszej wersji rozdzieliłabym te informacje: liczba min pozostałaby informacją o planszy, flagi miałyby własny licznik i określony limit. W ramach tego zadania pozostawiłam jednak zachowanie wynikające bezpośrednio z wytycznych.

Nie dodawałam również dodatkowych funkcji typowych dla Sapera, takich jak timer czy zapisywanie najlepszego czasu, ponieważ nie były częścią wymaganego zakresu.

## 3. Co znalazłam w danych

W danych znalazłam kilka przypadków, których nie można obsłużyć zakładając, że `mineCount` i `mines` są zawsze zgodne.

Poziom „Pomyłka rachmistrza” zawiera więcej współrzędnych min niż wskazuje `mineCount`. „Bliźnięta” zawierają powtórzoną pozycję miny, natomiast „Za płotem” zawiera współrzędną znajdującą się poza planszą.

Podczas tworzenia planszy ignoruję współrzędne znajdujące się poza jej zakresem oraz duplikaty. Faktyczny układ planszy wynika więc z poprawnych, unikalnych współrzędnych z `mines`, a nie z wartości `mineCount`.

Uwzględniłam również poziom bez min oraz planszę całkowicie wypełnioną minami. W drugim przypadku pierwszej miny nie można przenieść na inne pole, dlatego jej odkrycie kończy się przegraną zgodnie z regułami zadania.

## 4. Co było najtrudniejsze

Najwięcej uwagi wymagała obsługa pierwszego bezpiecznego odkrycia. Jeżeli pierwsze wybrane pole zawiera minę, trzeba znaleźć pierwsze dostępne pole, przenieść na nie minę, a następnie ponownie obliczyć liczbę sąsiednich min na planszy.

Drugim bardziej złożonym przypadkiem był chording. Trzeba było rozróżnić sytuację, w której liczba flag wokół odkrytego pola nie zgadza się z jego wartością, od sytuacji, w której liczba flag jest poprawna, ale przynajmniej jedna została postawiona w niewłaściwym miejscu.

Kaskadę zaimplementowałam iteracyjnie. Dzięki temu logika pozostaje prosta i nie jest zależna od głębokości wywołań rekurencyjnych.

## 5. Jakich bibliotek użyłam i po co

* **React** — do zbudowania interfejsu oraz przechowywania aktualnego stanu gry.
* **Sass** — do stylowania aplikacji zgodnie z wymaganiem użycia SCSS.
* **Vitest** — do testowania czystej logiki z `board.ts`; wybrałam go ze względu na prostą integrację z projektem opartym na Vite.

Poza tym nie korzystałam z dodatkowych bibliotek aplikacyjnych ani bibliotek UI.

## 6. Co zrobiłabym dalej

Gdyby aplikacja miała być dalej rozwijana, rozdzieliłabym licznik min i licznik flag oraz określiła maksymalną liczbę flag możliwych do postawienia na planszy.

Rozbudowałabym również dostępność interfejsu, przede wszystkim o pełną obsługę planszy z klawiatury oraz dokładniejsze komunikaty dla czytników ekranu.

Przy znacznie większych planszach rozważyłabym też ograniczenie liczby kopiowanych komórek podczas aktualizacji stanu. W obecnym zakresie priorytetem była prosta i czytelna implementacja logiki, a nie optymalizacja pod rozmiary plansz niewystępujące w dostarczonych danych.

## 7. Gdzie korzystałam z AI

Korzystałam z AI podczas analizy wymagań i przypadków brzegowych.
