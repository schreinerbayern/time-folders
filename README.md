# time-folders

`time-folders` ist eine Webanwendung zur Zeiterfassung, die mit SvelteKit und Svelte 5 entwickelt wurde. Sie ermöglicht es Benutzern, ihre Arbeitszeiten in organisierten "Ordnern" oder "Projekten" zu verfolgen. Die Anwendung bietet Funktionen wie Benutzerauthentifizierung, PDF-Anzeige und eine intuitive Registerkarten-Oberfläche.

## Funktionen

- **Zeiterfassung:**
  - [x] Komm- und Gehzeiten
  - [x] Arbeitszeiten auf Kostenstellen pro Projekt.
  - [ ] Pausenzeiten
- **Projektorganisation:** Organisieren Sie Ihre Arbeit in logischen Ordnerstrukturen.
  - [x] Dynamische Konfiguration des Wurzelverzeichnisses {PFAD_WURZEL_ORDNER}
  - [x] Unterordner, die einen Ordner "Zeiterfassung" enthalten, stellen Projekte dar
  - [x] Unterordner innerhalb von "Zeiterfassung" stellen Arbeitspakete dar
  - [x] Arbeitspakete enthalten:
    - eine PDF mit Stücklisten und Arbeitshinweisen
    - eine "kostenstellen.csv" mit einer Liste an Kostenstellennummern und Titel
  - [x] Komm- und Gehzeiten werden monatsweise im Wurzelverzeichnis abgelegt
  - [x] Arbeitszeiten werden in jeweiligen Projektordner abgelegt
- **Benutzerauthentifizierung:** Sichere Anmeldung und Abmeldung.
  - [x] Nuter können in der Datei "nutzerliste.csv" im Wurzelverzeichnis konfiguriert werden
- **PDF-Dokument:** Integrierter PDF-Viewer für Dokumente.
  - [x] Eingebettete Anzeige für PDF-Dokumente
  - [x] Bearbeiten und Speichern der PDF-Dokumente
- **Registerkarten-Oberfläche:** Einfache Navigation zwischen verschiedenen Ansichten innerhalb eines Projekts.
  - [x] Projekte werden in der linken Navigation angezeigt
  - [x] Arbeitspakete werden als Tabs innerhalb eines Projekts angezeigt
- **Mobile Optimierung:** Responsives Design für eine nahtlose Nutzung auf verschiedenen Geräten.
- **Sicherung:**
  - [ ] Die erfassten Komm- und Gehzeiten werden in Intervallen automatisch an eine definierte Mail-Adresse gesendet, um dort archiviert werden zu können.

## Technologie-Stack

- **Framework:** SvelteKit mit Svelte 5 (Runes)
- **Sprache:** TypeScript
- **Styling:** Tailwind CSS
- **Paketmanager:** [Bun](https://bun.sh/)

## Erste Schritte

Um das Projekt lokal einzurichten und auszuführen, folgen Sie diesen Schritten:

### 1. Voraussetzungen

Stellen Sie sicher, dass Sie [Bun](https://bun.sh/docs/installation) installiert haben. Bun ist ein schneller JavaScript-Runtime, Bundler, Transpiler und Paketmanager, der für dieses Projekt verwendet wird.

**Installation unter Windows:**

Am einfachsten installieren Sie Bun unter Windows über PowerShell:

```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

### 2. Installation

1.  **Projekt als ZIP herunterladen:**
    - Besuchen Sie die GitHub-Seite des Projekts.
    - Klicken Sie auf den grünen Button `<> Code` (oder `Code`).
    - Wählen Sie `Download ZIP`.
    - Speichern Sie die ZIP-Datei auf Ihrem Computer und entpacken Sie sie in ein Verzeichnis Ihrer Wahl.

2.  **Terminal im Projektverzeichnis öffnen (Windows):**
    - Navigieren Sie im Datei-Explorer zu dem entpackten Projektverzeichnis auf die Ebene wo sich auch die Ordner `src` und `static` befinden.
    - Klicken Sie mit der rechten Maustaste in einen leeren Bereich des Ordners (nicht auf eine Datei oder einen Unterordner).
    - Wählen Sie im Kontextmenü "Im Terminal öffnen" oder "Open in Terminal" (oder "PowerShell hier öffnen").

3.  **Abhängigkeiten installieren:**
    Installieren Sie anschließend die Abhängigkeiten:

    ```bash
    bun install
    ```

### 3. Optional: Visual Studio Code einrichten

Es wird empfohlen, Visual Studio Code (VS Code) als Entwicklungsumgebung zu verwenden.

1.  **VS Code installieren:** Laden Sie VS Code von der offiziellen Website herunter und installieren Sie es: [https://code.visualstudio.com/](https://code.visualstudio.com/)
2.  **Projekt öffnen:**
    - Öffnen Sie VS Code.
    - Gehen Sie zu `Datei` > `Ordner öffnen...` (oder verwenden Sie den Shortcut `Strg+K Strg+O`).
    - Navigieren Sie zu dem Verzeichnis, in das Sie das Projekt entpackt haben, und wählen Sie es aus.
3.  **Integriertes Terminal nutzen:**
    - Sobald das Projekt in VS Code geöffnet ist, können Sie das integrierte Terminal über `Terminal` > `Neues Terminal` (oder verwenden Sie den Shortcut `Strg+Ö` bzw. `Strg+Shift+Ö` für ein neues Terminal) öffnen.
    - Stellen Sie sicher, dass das Terminal im Root-Verzeichnis Ihres Projekts geöffnet ist, bevor Sie die `bun install`-Befehle ausführen.

### 4. Umgebungsvariablen konfigurieren

Erstellen Sie eine `.env`-Datei im Wurzelverzeichnis-Verzeichnis des Projekts. Diese Datei wird verwendet, um Umgebungsvariablen zu konfigurieren, die für die Anwendung wichtig sind. Sie können diese Datei direkt in Visual Studio Code erstellen und bearbeiten.

Beispiel für `.env`:

```dotenv
PFAD_WURZEL_ORDNER=/path/to/your/data/
PUBLIC_LOGO_URL=/static/logo/logo.svg
```

- `PFAD_WURZEL_ORDNER`: Der absolute Pfad zu dem Verzeichnis, in dem Ihre Projektdaten (z.B. Zeiterfassungsdateien) gespeichert werden sollen.
- `PUBLIC_LOGO_URL`: Die URL zum Logo, das in der Anwendung angezeigt wird. Standardmäßig ist dies `/static/logo/logo.svg`.

### Projektstruktur im Wurzelverzeichnis

Ausgehend vom in der `.env`-Datei konfigurierten `PFAD_WURZEL_ORDNER` erwartet die Anwendung folgende Struktur für Ihre Projektdaten:

```
{PFAD_WURZEL_ORDNER}/
├── nutzerliste.csv
├── anwesenheitszeiten-[MM]-[YYYY].csv (wird automatisch erstellt)
└── 01_Projektbezeichnung/
    └── Zeitwirtschaft/
        ├── stundenzettel.csv (wird automatisch erstellt)
        └── 01_Arbeitspaket/
            ├── kostenstellen.csv
            └── dokument.pdf
        └── 02_Arbeitspaket/
            ├── kostenstellen.csv
            └── dokument.pdf
└── 02_Projektbezeichnung/
    └── Zeitwirtschaft/
        ├── stundenzettel.csv
        └── 01_Arbeitspaket/
            ├── kostenstellen.csv
            └── dokument.pdf
```

**Erläuterungen:**

- **`nutzerliste.csv`**: Enthält die Benutzerinformationen für die Authentifizierung. Muss manuell im Wurzelverzeichnis erstellt werden.
- **`anwesenheitszeiten-[MM]-[YYYY].csv`**: Speichert die Kommt- und Geht-Zeiten der Benutzer pro Monat. Diese Dateien werden automatisch von der Anwendung erstellt und verwaltet.
- **`XX_Projektbezeichnung/`**: Jeder Ordner auf dieser Ebene repräsentiert ein Projekt und sollte mit einer fortlaufenden Nummerierung beginnen (z.B. `01_Projektname`). Alle anderen Dokumente und Ordner innerhalb dieser Projektordner werden von der Anwendung ignoriert.
- **`Zeitwirtschaft/`**: Ein fester Unterordner innerhalb jedes Projekts, der alle zeiterfassungsrelevanten Daten für dieses Projekt enthält.
- **`stundenzettel.csv`**: Speichert die Zeiteinträge für das jeweilige Projekt. Diese Datei wird automatisch von der Anwendung erstellt und verwaltet.
- **`XX_Arbeitspaket/`**: Unterordner innerhalb von `Zeitwirtschaft/`, die einzelne Arbeitspakete repräsentieren und ebenfalls mit einer fortlaufenden Nummerierung beginnen sollten (z.B. `01_Arbeitspaket`). Dieser Ordner darf maximal eine PDF-Datei enthalten und eine CSV-Datei mit den Kostenstellen.
- **`kostenstellen.csv`**: Enthält eine Liste der Kostenstellennummern und Titel für das jeweilige Arbeitspaket. Muss manuell in jedem `Arbeitspaket`-Ordner erstellt werden.
- **`dokument.pdf`**: Eine PDF-Datei innerhalb jedes Arbeitspaket-Ordners, die relevante Dokumente (z.B. Stücklisten, Arbeitshinweise) enthält.

### 5. Projekt ausführen

Starten Sie den Entwicklungsserver indem Sie im Terminal in VS Code folgenden Befehl eintippen und mit [Enter] bestätigen:

```bash
bun run dev
```

Die Anwendung sollte nun unter `http://localhost:5173` (oder einem anderen verfügbaren Port) erreichbar sein.


## Problembehebung

### `bun` wird im VS Code Terminal nicht gefunden

Es kann vorkommen, dass nach der Installation von `bun` der Befehl im integrierten Terminal von Visual Studio Code nicht sofort verfügbar ist. Dies äußert sich oft durch eine Fehlermeldung wie:

```
bun : Die Benennung "bun" wurde nicht als Name eines Cmdlet, einer Funktion, einer Skriptdatei 
oder eines ausführbaren Programms erkannt. Überprüfen Sie die Schreibweise des Namens, oder ob 
der Pfad korrekt ist (sofern enthalten), und wiederholen Sie den Vorgang.
In Zeile:1 Zeichen:1
+ bun -v
+ ~~~
    + CategoryInfo          : ObjectNotFound: (bun:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
```

**Lösung für Windows (PowerShell):**

Führen Sie das folgende Skript in einer **administrativen PowerShell** aus, um den Pfad zu `bun` dauerhaft zu den Systemumgebungsvariablen hinzuzufügen:

```powershell
# Dauerhaft in den Benutzer-PATH schreiben
$dirs = @("$env:LOCALAPPDATA\bun\bin", "$env:USERPROFILE\.bun\bin")
$found = $dirs | Where-Object { Test-Path (Join-Path $_ "bun.exe") }

if ($found) {
  $userPath = [Environment]::GetEnvironmentVariable("Path","User")
  # Duplikate vermeiden
  $need = $found | Where-Object { $userPath -notlike "*$_*" }
  if ($need) {
    [Environment]::SetEnvironmentVariable("Path", ($userPath + ";" + ($need -join ';')).Trim(';'), "User")
    Write-Host "Benutzer-PATH ergänzt um:"; $need
  } else {
    Write-Host "Benutzer-PATH enthält bun bereits."
  }
} else {
  Write-Warning "bun.exe nicht gefunden – prüfe Installation."
}
```

**Wichtiger Hinweis:** Nachdem Sie das Skript ausgeführt haben, müssen Sie Visual Studio Code **vollständig schließen und neu starten**. Alternativ können Sie das "Reload Window"-Kommando verwenden:
1.  Drücken Sie `Strg+Shift+P`, um die Befehlspalette zu öffnen.
2.  Tippen Sie `Developer: Reload Window` ein und bestätigen Sie mit `Enter`.

## Entwicklung

### Entwicklung mit Gemini CLI (KI-gestützte Entwicklung)

Dieses Projekt ist darauf ausgelegt, mit dem Gemini CLI, einem KI-gestützten Assistenten, direkt in Ihrem Terminal weiterentwickelt und angepasst zu werden. Anstatt Code manuell zu schreiben, können Sie Gemini Anweisungen in natürlicher Sprache geben.

**Installation von Gemini CLI:**

Stellen Sie sicher, dass Sie Bun installiert haben. Führen Sie dann den folgenden Befehl in Ihrem Terminal aus, um Gemini CLI global auf Ihrem System zu installieren:

```bash
bun add -g @google/gemini-cli
```

**Wie funktioniert die Interaktion?**

1.  **Starten Sie Gemini:** Navigieren Sie in Ihrem Terminal zum Projektverzeichnis und führen Sie den folgenden Befehl aus:

    ```bash
    gemini start
    ```

2.  **Chatten Sie mit der KI:** Nach dem Start begrüßt Sie Gemini und ist bereit für Ihre Anweisungen. Sie können nun direkt im Terminal mit der KI "chatten". Beschreiben Sie einfach, was Sie ändern oder hinzufügen möchten.

3.  **Gemini analysiert und plant:** Die KI analysiert Ihren Wunsch, durchsucht bei Bedarf den Code und schlägt einen Plan vor, wie sie die Aufgabe umsetzen wird.

4.  **Bestätigung und Ausführung:** Gemini bittet Sie um Bestätigung, bevor es Änderungen am Code vornimmt. Sie haben die volle Kontrolle und können jeden Schritt genehmigen oder ablehnen.

**Beispiele für Anweisungen:**

Sie können Gemini bitten, eine Vielzahl von Aufgaben zu erledigen. Hier sind einige Beispiele, um Ihnen den Einstieg zu erleichtern:

*   **Design-Anpassungen:**
    *   `"Ändere die Hintergrundfarbe der Navigationsleiste zu einem dunklen Grau."`
    *   `"Vergrößere die Schriftgröße auf der Startseite."`
    *   `"Passe das Logo an, sodass es auf mobilen Geräten kleiner dargestellt wird."`

*   **Funktionale Erweiterungen:**
    *   `"Füge einen Button auf der Login-Seite hinzu, der das Passwort anzeigt."`
    *   `"Erweitere die Tabelle auf der Hauptseite um eine Spalte, die die Gesamtdauer anzeigt."`
    *   `"Implementiere eine Funktion, die alle Zeiteinträge als CSV-Datei exportiert."`

*   **Fehlerbehebung:**
    *   `"Der Timer stoppt nicht, wenn ich mich auslogge. Bitte behebe das."`
    *   `"Ich bekomme eine Fehlermeldung, wenn ich auf den 'Speichern'-Button klicke. Finde und korrigiere den Fehler."`
    *   `"Die mobile Ansicht der Projektliste ist fehlerhaft. Kannst du das Layout korrigieren?"`

*   **Code-Verständnis:**
    *   `"Erkläre mir, wie die Benutzerauthentifizierung in diesem Projekt funktioniert."`
    *   `"Wo im Code wird die Zeit gespeichert? Zeige mir die relevanten Dateien."`

Weitere Informationen zur Verwendung von Gemini CLI finden Sie in der offiziellen [Dokumentation](https://developers.google.com/gemini/docs/cli).

### Versionskontrolle mit Git (Optional)

Für die Verwaltung von Codeänderungen und die Zusammenarbeit in Teams ist Git ein unverzichtbares Werkzeug.

**Wie Git funktioniert:**

Git ist ein verteiltes Versionskontrollsystem. Das bedeutet, dass jeder Entwickler eine vollständige Kopie des gesamten Projektverlaufs auf seinem lokalen Computer hat. Dies ermöglicht das Arbeiten offline, schnelle Operationen und eine robuste Sicherung der Codebasis. Git verfolgt Änderungen an Dateien, sodass Sie jederzeit zu früheren Versionen zurückkehren, Änderungen vergleichen und verschiedene Entwicklungsstränge (Branches) verwalten können.

**Git installieren:**

Für Windows-Benutzer wird empfohlen, den offiziellen Git for Windows Installer herunterzuladen und zu installieren. Dieser enthält Git Bash (eine Bash-Emulation für Windows) und Git GUI.

Laden Sie Git von der offiziellen Website herunter und folgen Sie den Installationsanweisungen: [https://git-scm.com/download/win](https://git-scm.com/download/win)

**Git in Visual Studio Code nutzen:**

VS Code bietet eine hervorragende integrierte Unterstützung für Git.

1.  **Quellcodeverwaltung-Ansicht:** Klicken Sie in der Seitenleiste auf das Symbol für die Quellcodeverwaltung (drei Kreise, die durch Linien verbunden sind). Hier sehen Sie alle geänderten Dateien.
2.  **Änderungen staggen und committen:**
    - Fahren Sie mit der Maus über eine geänderte Datei und klicken Sie auf das `+`-Symbol, um die Änderungen zu "staggen" (für den Commit vorzubereiten).
    - Geben Sie eine aussagekräftige Commit-Nachricht in das Textfeld oben ein.
    - Klicken Sie auf den Haken-Button, um die Änderungen zu "committen" (im lokalen Verlauf zu speichern).
3.  **Synchronisieren (Pull/Push):**
    - Unten links in der Statusleiste von VS Code sehen Sie oft Symbole für "Pull" (Änderungen vom Remote-Repository herunterladen) und "Push" (lokale Commits zum Remote-Repository hochladen).
    - Klicken Sie auf diese Symbole, um Ihre lokalen Änderungen mit dem Remote-Repository zu synchronisieren.
4.  **Branches verwalten:**
    - In der Statusleiste unten links sehen Sie auch den Namen des aktuellen Branches. Klicken Sie darauf, um Branches zu wechseln, neue Branches zu erstellen oder Branches zusammenzuführen.

Weitere Informationen zur Git-Integration in VS Code finden Sie in der offiziellen [Dokumentation](https://code.visualstudio.com/docs/editor/versioncontrol).
