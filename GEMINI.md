# Gemini-Projektkontext: time-folders

Dieses Dokument gibt einem KI-Assistenten Kontext über das "time-folders"-Projekt. Dieses Dokument fasst den Projekt-Setup, die wichtigsten Befehle und den Code-Style basierend auf **Svelte 5**, **Runes**

## Über das Projekt

"time-folders" ist eine Webanwendung, die mit SvelteKit erstellt wurde. Dabei handelt es sich um eine Zeiterfassungsanwendung, die Arbeit in "Ordner" oder "Projekte" organisiert. Sie umfasst Funktionen wie Benutzerauthentifizierung (`login`/`logout`-Routen), PDF-Anzeige und eine Registerkarten-Oberfläche.

## Technologie-Stack

- **Framework:** SvelteKit with Svelte 5
- **Sprache:** TypeScript
- **Styling:** Tailwind CSS
- **Linting:** ESLint
- **Formatierung:** Prettier
- **Paketmanager:** bun

## Projektstruktur

- `src/lib`: Enthält wiederverwendbare Svelte-Komponenten wie `Drawer.svelte`, `PdfViewer.svelte` und `Tabs.svelte`.
- `src/lib/stores`: Enthält Svelte-Stores, zum Beispiel `timeTrackingStore.ts`.
- `src/routes`: Definiert die Seiten und API-Routen der Anwendung.
  - `[project]/[tab]`: Eine dynamische Route, um eine bestimmte Registerkarte innerhalb eines Projekts anzuzeigen.
- `static/`: Enthält statische Assets wie Bilder und die `pdfjs`-Bibliothek.

## Umgebungsvariablen

Die Anwendung verwendet die folgenden Umgebungsvariablen, die in einer `.env`-Datei im Projekt-Root konfiguriert werden:

-   `PFAD_WURZEL_ORDNER`: Definiert den absoluten Pfad zum Wurzelverzeichnis, in dem Projektdaten und Zeiterfassungsdateien gespeichert werden.
-   `PUBLIC_LOGO_URL`: Definiert die URL zum Logo, das in der Anwendung angezeigt wird.

## 📦 Paketmanager

- **Bun**: Alle Befehle laufen über `bun` (statt `npm`/`yarn`).

  ```bash
  # Abhängigkeiten installieren
  bun install

  # Entwicklungsserver starten
  bun run dev

  # Produktion bauen
  bun run build

  # Production-Build testen
  bun run preview

  # Typüberprüfung
  bun run check

  # Windows-Executable erstellen
  bun run exe
  ```

---

## 🧹 Code-Konventionen

- **Svelte 5 Syntax** überall im Projekt.
- **Runes** verwenden für Reaktivität:
  - `$state(...)` für lokale Stores
  - `$derived(...)` für abgeleitete Werte
  - `$effect(...)` für Seiteneffekte
  - `$memo(...)` für teurere Berechnungen

- **Event-Handler** mit der neuen `onevent`-Syntax anstelle der veralteten `on:event`-Direktive (z. B. `onclick`, `oninput`, `onchange`, …):

  ```svelte
  <button onclick={() => doSomething()}>Click me</button>
  ```

- **TypeScript** in `<script lang="ts">` bevorzugt.
- **Einrückung**: 2 Leerzeichen, **Zeilenlänge**: max. 100 Zeichen.

---

## 🎨 Styles & Design-System

- **Zentrale Stylesheet-Verwaltung:** Alle globalen Styles werden ausschließlich in einer zentralen app.css verwaltet.
- **CSS-Variablen:** Nutze vordefinierte CSS-Variablen (z. B. --color-primary, --spacing-base, --font-size-md) für Farben, Abstände, Schriftgrößen, etc., um ein einheitliches Look & Feel sicherzustellen.
- **Theming & CI-Anpassung:** Durch Anpassung der CSS-Variablen in app.css lässt sich die App problemlos an das eigene Corporate Design anpassen.
- **Scoped Styles:** Komponentenspezifische Styles erfolgen nur in Ausnahmefällen; wenn möglich, sollten Utility-Klassen und CSS-Variablen genutzt werden.
- **Responsive Grundlagen:** Definiere Grid-, Flex- und Breakpoint-Utilities zentral in app.css für konsistente Reaktionsfähigkeit.

## Befehle

- **Entwicklungsserver starten:** `bun run dev`
- **Produktions-Build erstellen:** `bun run build`
- **Produktions-Build ansehen:** `bun run preview`
- **Code auf Typfehler prüfen:** `bun run check`
- **Code linten:** `bun run lint`
- **Code formatieren:** `bun run format`

## Verlauf der Zusammenarbeit (August 2025)

In dieser Sitzung wurden folgende Anpassungen und Erweiterungen am "time-folders"-Projekt vorgenommen:

### 1. Anpassung der Projektstruktur für "Zeitwirtschaft"

-   **Anforderung:** Der feste Zwischenordner "Zeitwirtschaft" soll in der Backend-Logik berücksichtigt werden, ohne in der URL aufzutauchen.
-   **Umsetzung:**
    -   Die Ladefunktion in `src/routes/[project]/+layout.server.ts` wurde angepasst, um den `Zeitwirtschaft`-Ordner im Pfad zu berücksichtigen.
    -   Eine Hinweismeldung wird angezeigt, falls der `Zeitwirtschaft`-Ordner nicht existiert.
    -   Die `+page.server.ts` für `[project]/[tab]` wurde aktualisiert, um Daten aus dem `Zeitwirtschaft`-Unterordner zu laden.
    -   Die Weiterleitungslogik in `src/routes/[project]/+page.server.ts` wurde korrigiert, um sicherzustellen, dass die URL-Struktur `/[project]/[tab]` beibehalten wird, während intern auf den ersten Tab im `Zeitwirtschaft`-Ordner umgeleitet wird.

### 2. Speicherung der Zeiteinträge pro Projekt

-   **Anforderung:** Zeiteinträge sollen nicht mehr zentral, sondern pro Projekt im Ordner `[project]/Zeitwirtschaft/stundenzettel.csv` gespeichert werden.
-   **Umsetzung:**
    -   Die `trackTime`-Aktion in `src/routes/[project]/[tab]/+page.server.ts` wurde geändert, um die `stundenzettel.csv` im `Zeitwirtschaft`-Ordner des jeweiligen Projekts zu speichern.
    -   Die Ladefunktion der Hauptseite (`src/routes/+page.server.ts`) wurde angepasst, um alle `stundenzettel.csv`-Dateien in den `Zeitwirtschaft`-Ordnern der Projekte zu durchsuchen und die Einträge des angemeldeten Benutzers zusammenzuführen.

### 3. Anzeige der Anwesenheitszeiten auf der Hauptseite

-   **Anforderung:** Die Hauptseite (`/`) soll die Anwesenheitszeiten des Nutzers anzeigen, die beim Login und Logout erfasst werden.
-   **Umsetzung:**
    -   Die Login-Aktion in `src/routes/login/+page.server.ts` wurde erweitert, um die "Kommt"-Zeit des Benutzers in einer monatlichen Datei `anwesenheitszeiten-[MM]-[YYYY].csv` zu speichern.
    -   Die Logout-Aktion in `src/routes/logout/+page.server.ts` wurde erweitert, um die "Geht"-Zeit und die Dauer zu erfassen und in dieselbe Datei zu schreiben.
    -   Die Ladefunktion der Hauptseite (`src/routes/+page.server.ts`) wurde angepasst, um die Anwesenheitszeiten aus der monatlichen Datei zu lesen und zu sortieren (neuester Eintrag zuerst).
    -   Die `+page.svelte` der Hauptseite wurde aktualisiert, um die Anwesenheitszeiten in einer Tabelle anzuzeigen und das Datumsformat anzupassen.

### 4. Behebung des Timer-Problems beim Logout

-   **Anforderung:** Der aktive Timer soll beim Logout korrekt beendet und der Zeiteintrag gespeichert werden, ohne dass der Timer nach erneutem Login weiterläuft.
-   **Umsetzung:**
    -   Die `Drawer.svelte`-Komponente wurde angepasst, um SvelteKits `enhance`-Funktion für das Logout-Formular zu nutzen. Dies stellt sicher, dass die Timer-Daten an den Server gesendet werden, bevor der `localStorage`-Eintrag des Timers geleert wird.

### 5. Verbesserung der Tab-Leiste

-   **Anforderung:** Die Tab-Leiste soll bei vielen Tabs scrollbar sein und Navigationsindikatoren (Pfeile) anzeigen. Tabs mit Leerzeichen im Namen sollen korrekt als aktiv markiert werden.
-   **Umsetzung:**
    -   Die `Tabs.svelte`-Komponente wurde mit einem Wrapper-`div` und Navigations-Buttons versehen, die bei Bedarf erscheinen.
    -   Die Buttons wurden farblich an die Primärfarbe des Designs angepasst.
    -   `overflow-y-hidden` wurde zum Scroll-Container hinzugefüht, um vertikales Scrollen zu verhindern.
    -   Die `+layout.server.ts` für `[project]` wurde angepasst, um den Tab-Namen aus der URL korrekt zu dekodieren, wodurch Tabs mit Leerzeichen nun richtig als aktiv markiert werden.
    -   Die Event-Handler-Syntax in `Tabs.svelte` wurde auf die Svelte 5 `onscroll`-Syntax aktualisiert.

### 6. Verbesserte Fehlersuche durch Konsolenausgaben

-   **Anforderung:** Alle geschriebenen Zeiteinträge (Kommt-, Geht- und Projektzeiten) sollen in der Konsole ausgegeben werden, um zukünftige Fehlerbehebungen zu erleichtern.
-   **Umsetzung:**
    -   `console.log`-Anweisungen wurden in `src/routes/login/+page.server.ts` (für "Kommt"-Zeiten), `src/routes/logout/+page.server.ts` (für "Geht"-Zeiten und Projektzeiten beim Logout) und `src/routes/[project]/[tab]/+page.server.ts` (für Projektzeiten beim Starten/Stoppen des Timers) hinzugefügt.
    -   Fehlerbehandlung in `src/routes/logout/+page.server.ts` wurde verbessert, um Fehler beim Schreiben der Anwesenheitszeiten zu protokollieren.

### 7. UI-Optimierung für mobile Geräte

-   **Anforderung:** Die Anwendung soll für mobile Geräte optimiert werden, um eine bessere Benutzerfreundlichkeit zu gewährleisten, während das bestehende Look & Feel beibehalten wird.
-   **Umsetzung:**
    -   **Navigation (Drawer):**
        -   `src/routes/+layout.svelte`: Ein `isDrawerOpen`-Zustand und ein Toggle-Button für mobile Ansichten wurden hinzugefügt. Der `main`-Inhaltsbereich wurde so angepasst, dass sein linker Rand auf mobilen Geräten bedingt durch `isDrawerOpen` verschoben wird.
        -   `src/lib/Drawer.svelte`: Die `isDrawerOpen`-Eigenschaft wurde als bindbar (`$bindable()`) deklariert. Die Positionierung und Sichtbarkeit des Drawers wurden responsiv gestaltet (`fixed`, `md:relative`, `transform`, `translate-x-full`, `md:translate-x-0`, `transition-transform`), gesteuert durch `isDrawerOpen`. Ein Schließen-Button für mobile Ansichten wurde hinzugefügt.
    -   **Inhaltsbereich (PDF & Kostenstellen):**
        -   `src/routes/[project]/[tab]/+page.svelte`: Das Layout des Hauptcontainers wurde auf `flex flex-col md:flex-row h-full` umgestellt. Die Container für den PDF-Viewer und die Kostenstellenliste wurden so angepasst, dass sie `w-full` auf mobilen Geräten und `md:w-2/3` bzw. `md:w-1/3` auf Desktops verwenden. `min-h-0` wurde hinzugefügt, um eine korrekte Höhenverteilung zu gewährleisten. Die `flex-1`-Klassen wurden von den inneren Containern entfernt, um die Breitensteuerung durch `w-X/Y`-Klassen zu ermöglichen.
        -   `src/app.css`: Die `width`-Eigenschaften wurden aus der `.kostenstellen-container`-Definition entfernt, um die Breitensteuerung durch Tailwind-Klassen in der Svelte-Komponente zu ermöglichen.
    -   **Allgemeine Anpassungen:**
        -   `src/lib/Tabs.svelte`: `pl-16` wurde zur `nav`-Klasse hinzugefügt, um den Tabs in der mobilen Ansicht einen linken Abstand zu geben.