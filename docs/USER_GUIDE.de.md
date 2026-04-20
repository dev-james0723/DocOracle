# DocOracle: Detaillierter Benutzerhandbuch (mit echten Beispielen)

> Dieser Leitfaden erklärt die Verwendung von DocOracle Schritt für Schritt anhand echter Funktionsbeschreibungen und realer Gesprächsbeispiele aus der Live-Demo [decca-oracle.manus.space](https://decca-oracle.manus.space).

---

## Sprachauswahl | Language

[English](USER_GUIDE.md) · [繁體中文](USER_GUIDE.zh-TW.md) · [简体中文](USER_GUIDE.zh-CN.md) · [日本語](USER_GUIDE.ja.md) · [Deutsch](USER_GUIDE.de.md)

---

## Praxisbeispiel: Ein Krankenhaus baut eine interne medizinische Wissensdatenbank auf

Angenommen, ein Krankenhaus besitzt ein 600-seitiges „Handbuch für Notfallmedizin" im PDF-Format. Das Ziel ist es, Ärzten die Möglichkeit zu geben, über eine KI-Chat-Oberfläche schnell Informationen abzurufen, ohne jedes Mal das Buch durchblättern zu müssen.

Der IT-Leiter des Krankenhauses entscheidet sich für DocOracle. Im Folgenden werden alle Schritte und die jeweiligen Bildschirmanzeigen detailliert beschrieben.

---

## Schritt 1: Zuerst die Live-Demo ausprobieren (ohne Installation)

Bevor etwas installiert wird, besucht der IT-Leiter die DocOracle Live-Demo: **[decca-oracle.manus.space](https://decca-oracle.manus.space)**.

Die Startseite bietet zwei Optionen:

- **„Demo erkunden"** — Lädt ein vorverarbeitetes Beispieldokument und zeigt sofort die vollständige Wissensdatenbank-Oberfläche, ohne dass etwas hochgeladen werden muss.
- **„Mit Ihrer PDF ausprobieren"** — Ermöglicht das Hochladen einer eigenen PDF-Datei und die Ausführung der vollständigen Verarbeitungspipeline.

Der IT-Leiter klickt auf **„Mit Ihrer PDF ausprobieren"**, lädt einen 50-seitigen Auszug des Handbuchs hoch und wartet auf die Verarbeitung.

---

## Schritt 2: Upload und Pipeline-Verarbeitungsansicht

Nach dem Upload gelangt der Benutzer zur Ansicht **Letzte Uploads**. Diese Ansicht zeigt alle eingereichten PDFs und deren aktuellen Verarbeitungsstatus.

Jeder Eintrag in der Liste enthält folgende Informationen:

| Spalte | Beschreibung |
|--------|-------------|
| **Dateiname** | Name der hochgeladenen PDF-Datei |
| **Status-Badge** | Eines von: `In der Warteschlange`, `In Bearbeitung`, `Abgeschlossen`, `Fehlgeschlagen` |
| **Schaltfläche „Fortschritt anzeigen"** | Öffnet die Job-Detailseite für diesen Upload |
| **Papierkorb-Symbol** | Löscht den Job sofort (für alle Status verfügbar) |

> **Reales Beispiel aus der Live-Demo:** Nach dem Hochladen von *Emergency_Medicine_Excerpt.pdf* zeigt die Liste der letzten Uploads:
>
> ```
> Emergency_Medicine_Excerpt.pdf   [In Bearbeitung]   [Fortschritt anzeigen]  [🗑]
> ```

Das Papierkorb-Symbol (🗑) befindet sich **links** neben der Schaltfläche „Fortschritt anzeigen". Jobs können jederzeit gelöscht werden — einschließlich solcher, die sich noch in der Warteschlange befinden oder gerade verarbeitet werden — um den Verbrauch von API-Guthaben zu verhindern.

---

## Schritt 3: Pipeline-Ausführung beobachten

Ein Klick auf **„Fortschritt anzeigen"** öffnet die Job-Detailseite. Während der Pipeline-Ausführung wird ein Echtzeit-Fortschrittsindikator angezeigt, der zeigt, welcher der 12 Schritte gerade ausgeführt wird:

```
[2026-04-19 10:00:00] DocOracle-Pipeline wird gestartet...
[2026-04-19 10:00:05] Schritt 1: Seiteninventar wird erstellt...
  - 50 Seiten werden analysiert
  - Seitenklassifizierung: 38 Textseiten, 7 Diagrammseiten, 5 gemischte Seiten
[2026-04-19 10:15:30] Schritt 2: Seitendatensätze mit Gemini Vision werden generiert...
  - Seiten 1–10 werden verarbeitet...
  - Seiten 11–20 werden verarbeitet...
  [████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 25%
...
[2026-04-19 10:45:00] ✅ Pipeline abgeschlossen!
```

Die Verarbeitungszeit hängt von der Dokumentgröße ab:

| Seitenanzahl | Geschätzte Zeit |
|-------------|----------------|
| 50 | ca. 15 Minuten |
| 200 | ca. 1 Stunde |
| 500 | ca. 3 Stunden |

---

## Schritt 4: Umgang mit fehlgeschlagener Pipeline

Manchmal schlägt die Pipeline fehl — beispielsweise wenn das Gemini-API-Ratenlimit erreicht wird oder die PDF ungewöhnliche Kodierungen enthält. In diesem Fall zeigt die Job-Detailseite eine deutliche **„Pipeline fehlgeschlagen"**-Fehlerkarte.

Auf der Karte werden zwei Schaltflächen nebeneinander angezeigt:

- **„Erneut versuchen"** — Stellt den Job erneut in die Warteschlange und startet die Pipeline von vorne.
- **„Löschen"** — Entfernt den Job dauerhaft aus dem System.

> **Warum die Schaltfläche „Löschen" wichtig ist:** Wenn ein Job wiederholt fehlschlägt, verbraucht das ständige Klicken auf „Erneut versuchen" API-Guthaben ohne Ergebnis. Die Schaltfläche „Löschen" ermöglicht es, fehlgeschlagene Jobs sauber zu entfernen und weitere automatische Wiederholungsversuche im Hintergrund zu verhindern.

**Praxisbeispiel:** Der IT-Leiter hat versehentlich eine beschädigte PDF-Datei hochgeladen. Die Pipeline ist bei Schritt 2 fehlgeschlagen. Anstatt auf „Erneut versuchen" zu klicken (was erneut fehlschlagen würde), klickt er auf **„Löschen"** und lädt die korrekte Datei neu hoch.

---

## Schritt 5: Der Knowledge Hub — Die Ansicht nach Abschluss der Pipeline

Dies ist der wichtigste Teil dieses Leitfadens. Sobald die Pipeline erfolgreich abgeschlossen ist, verwandelt sich die Job-Detailseite in den **Knowledge Hub** — eine vollständige Oberfläche mit drei Registerkarten.

### Statistikleiste

Die Statistikleiste am oberen Rand des Knowledge Hubs zeigt eine schnelle Zusammenfassung der extrahierten Inhalte:

```
📄 50 Seiten   |   🖼 12 visuelle Assets   |   📑 8 Abschnitte   |   📖 23 Begriffe
```

### Registerkarte 1: Buchstruktur

Die Registerkarte **Buchstruktur** zeigt die vollständige Kapitel- und Abschnittshierarchie des Dokuments. Jeder Eintrag enthält:

- Abschnittstitel und Seitenbereich (z. B. „Kapitel 3: Beurteilung von Brustschmerzen — Seiten 42–67")
- Eine Zusammenfassung des Abschnittsinhalts in einem Absatz
- Schlüsselwort-Tags (z. B. `EKG`, `Troponin`, `Differentialdiagnose`)

**Ein Klick auf einen beliebigen Abschnitt** öffnet eine vorausgefüllte Chat-Frage zu diesem Abschnitt. Ein Klick auf „Kapitel 3: Beurteilung von Brustschmerzen" sendet beispielsweise automatisch: *„Was behandelt Kapitel 3 zur Beurteilung von Brustschmerzen?"*

> **Reales Beispiel aus der Live-Demo:** Der IT-Leiter navigiert zu „Kapitel 5: Traumaprotokolle" und klickt darauf. Die KI antwortet sofort mit einer strukturierten Zusammenfassung unter Angabe spezifischer Seitenzahlen aus dem Handbuch.

### Registerkarte 2: Glossar

Die Registerkarte **Glossar** zeigt alle aus dem Dokument extrahierten Fachbegriffe als durchsuchbare Karten. Jede Karte enthält:

- Den Begriff (z. B. „Troponin I")
- Die aus dem Dokument extrahierte Definition
- Die Seitenzahlen, auf denen der Begriff vorkommt
- Kategorie-Tags (z. B. `Biomarker`, `Diagnostik`)

Am oberen Rand der Glossar-Registerkarte befindet sich eine **Suchleiste**. Die Eingabe von „EKG" filtert die Liste so, dass nur EKG-bezogene Begriffe angezeigt werden.

**Ein Klick auf eine beliebige Begriffskarte** öffnet eine vorausgefüllte Chat-Frage. Ein Klick auf „Troponin I" sendet beispielsweise: *„Können Sie Troponin I genauer erklären?"*

> **Reales Beispiel aus der Live-Demo:** Ein Arzt verwendet die Glossar-Registerkarte, um „STEMI" (ST-Hebungsinfarkt) nachzuschlagen. Die Karte zeigt die Definition, den Seitenbereich (Seiten 246–251) und das Tag `Kardiologie`. Ein Klick auf die Karte öffnet einen Chat, der um weitere Details bittet. Die KI antwortet mit einer vollständigen Erklärung unter Bezugnahme auf die Seiten 246, 248 und 250.

### Registerkarte 3: Fragen stellen

Die Registerkarte **Fragen stellen** zeigt 6 vorgeschlagene Fragen, die aus dem Dokumentinhalt generiert wurden. Diese helfen neuen Benutzern zu verstehen, welche Arten von Fragen DocOracle beantworten kann.

Beispiele für vorgeschlagene Fragen zum Notfallmedizin-Handbuch:

1. „Was ist die Erstlinienbehandlung bei Anaphylaxie?"
2. „Wie bewertet man einen Patienten mit verändertem Bewusstseinszustand?"
3. „Welche bildgebenden Untersuchungen werden bei Verdacht auf Lungenembolie empfohlen?"
4. „Was sind die Kriterien für die Aktivierung eines Traumateams?"
5. „Wie interpretiert man ein STEMI im 12-Kanal-EKG?"
6. „Welche Medikamente sind in geburtshilflichen Notfällen kontraindiziert?"

Ein Klick auf eine vorgeschlagene Frage sendet diese direkt an den KI-Chat.

---

## Schritt 6: Verwendung des KI-Chats

Nach der Erkundung der Knowledge-Hub-Registerkarten klickt der Arzt auf eine der vorgeschlagenen Fragen oder gibt eine eigene ein. Die KI-Antwort enthält:

1. Eine strukturierte, auf das Dokument gestützte Antwort
2. Genaue Seitenzahlangaben
3. Automatisch neben der Antwort angezeigte relevante Diagramme oder Tabellen

**Reales Gesprächsbeispiel:**

> **Arzt:** „Welche Untersuchungen sollte ich bei einem Patienten mit starken Brustschmerzen durchführen?"
>
> **DocOracle KI:** „Laut Handbuch (Seiten 245–250) werden für Patienten mit starken Brustschmerzen folgende Untersuchungen empfohlen:
>
> 1. **EKG (Elektrokardiogramm)** — Innerhalb von 10 Minuten nach Ankunft durchzuführen. Interpretationsrichtlinien auf Seite 246.
> 2. **Röntgen-Thorax** — Zum Ausschluss von Pneumothorax und Aortendissektion. Siehe Seite 248.
> 3. **Blutuntersuchungen** — Troponin I, BNP, D-Dimer. Referenzwerte auf Seite 250.
>
> [Diagramm: EKG-Interpretations-Flussdiagramm — Extrahiert von Seite 247]
>
> [Schaltfläche: **In Bilderklärung umwandeln** — Klicken, um eine visuelle Zusammenfassung dieser Antwort zu generieren]"

Die Schaltfläche **„In Bilderklärung umwandeln"** generiert ein von der KI erstelltes visuelles Diagramm, das die Antwort zusammenfasst — ideal für schnelle Referenzen oder Lehrzwecke.

---

## Schritt 7: Verwaltung von Uploads

### Jobs aus der Liste der letzten Uploads löschen

Im Hauptbereich von DocOracle listet der Abschnitt **Letzte Uploads** alle verarbeiteten Dokumente auf. Jede Zeile verfügt links neben der Schaltfläche „Fortschritt anzeigen" über ein Papierkorb-Symbol (🗑).

**Jobs in jedem Status** können gelöscht werden:

| Status | Löschbar? | Auswirkung |
|--------|-----------|-----------|
| `In der Warteschlange` | Ja | Bricht den Job vor dem Start ab |
| `In Bearbeitung` | Ja | Stoppt die Pipeline mittendrin |
| `Abgeschlossen` | Ja | Entfernt die Wissensdatenbank dauerhaft |
| `Fehlgeschlagen` | Ja | Bereinigt fehlgeschlagene Jobs |

> **Wichtiger Hinweis:** Nicht gelöschte fehlgeschlagene Jobs können automatisch erneut versucht werden und dabei API-Guthaben verbrauchen. Eine sofortige Löschung verhindert dies.

### Jobs von der Job-Detailseite löschen

Beim Anzeigen eines bestimmten Jobs (unabhängig davon, ob er erfolgreich war oder fehlgeschlagen ist) befindet sich auf dieser Seite ebenfalls eine **Löschen**-Schaltfläche:

- Bei **abgeschlossenen** Jobs: Die Löschen-Schaltfläche befindet sich in der Knowledge-Hub-Kopfzeile neben dem Dokumenttitel.
- Bei **fehlgeschlagenen** Jobs: Die Löschen-Schaltfläche befindet sich innerhalb der Fehlerkarte neben der Schaltfläche „Erneut versuchen".

---

## Schritt 8: Eigene Instanz bereitstellen (Entwicklerpfad)

Um DocOracle auf einem eigenen Server mit eigenen Dokumenten zu betreiben, sind folgende Schritte erforderlich.

### Voraussetzungen

| Anforderung | Version | Verwendungszweck |
|------------|---------|-----------------|
| Python | 3.9+ | Pipeline-Skripte |
| Node.js | 18+ | Website |
| pdftotext | Beliebig | Textextraktion (`sudo apt-get install poppler-utils`) |
| Gemini API-Schlüssel | — | Vision-Analyse und Chat ([Kostenlosen Schlüssel erhalten](https://aistudio.google.com/app/apikey)) |

### Schritt-für-Schritt-Anleitung

**1. Repository klonen**

```bash
git clone https://github.com/dev-james0723/DocOracle.git
cd DocOracle
```

**2. PDF in den Ordner `input/` legen**

```bash
cp /path/to/your/handbook.pdf input/
```

**3. Pipeline-Abhängigkeiten installieren**

```bash
pip install -r pipeline/requirements.txt
```

**4. Gemini API-Schlüssel festlegen**

```bash
export GEMINI_API_KEY="your-gemini-api-key"
```

**5. Pipeline ausführen**

```bash
bash pipeline/run_all.sh
```

**6. Ausgabedateien in das Website-Verzeichnis kopieren**

```bash
cp output/05_retrieval/page_chunks.jsonl website/server/data/
cp output/04_gold_master/glossary.json website/server/data/
cp output/04_gold_master/sections.json website/server/data/
cp output/10_visual_assets/visual_assets_index.json website/server/data/visual_assets.json
```

**7. Website starten**

```bash
cd website
npm install
npm run dev
```

`http://localhost:3000` im Browser öffnen. Die KI-Wissensdatenbank ist einsatzbereit.

---

## Schritt 9: Struktur der Ausgabedateien

Nach Abschluss der Pipeline enthält das Verzeichnis `output/` folgende Struktur:

```
output/
├── 00_source/
│   ├── source.pdf
│   └── document_manifest.json
│
├── 01_inventory/
│   └── page_inventory.json
│
├── 02_page_records/
│   ├── page_1.json
│   ├── page_2.json
│   └── ...（eine Datei pro Seite）
│
├── 04_gold_master/
│   ├── page_chunks.jsonl          ← Vollständiger Textinhalt, seitenweise
│   ├── glossary.json              ← Alle extrahierten Begriffe und Definitionen
│   ├── sections.json              ← Kapitel-/Abschnittshierarchie
│   └── faq_seeds.json
│
├── 05_retrieval/
│   ├── page_chunks.jsonl          ← Für RAG optimierte Abruf-Chunks
│   └── section_chunks.jsonl
│
├── 10_visual_assets/
│   ├── diagrams/
│   │   ├── diagram_001.png
│   │   ├── diagram_001.json       ← Räumliche Beschreibung dieses Diagramms
│   │   └── ...
│   ├── tables/
│   │   ├── table_001.png
│   │   └── ...
│   └── visual_assets_index.json   ← Index aller visuellen Assets
│
└── 09_final_report/
    └── final_report.md
```

Die **4 wichtigsten Dateien**, die in die Website kopiert werden müssen:

| Datei | Inhalt |
|-------|--------|
| `output/05_retrieval/page_chunks.jsonl` | Vollständiger seitenweiser Text für den KI-Abruf |
| `output/04_gold_master/glossary.json` | Alle Fachbegriffe mit Definitionen und Seitenreferenzen |
| `output/04_gold_master/sections.json` | Kapitel-/Abschnittsstruktur mit Zusammenfassungen |
| `output/10_visual_assets/visual_assets_index.json` | Index aller Diagramme, Tabellen und Fotos |

---

## Häufig gestellte Fragen

**F: Wie lange dauert die Pipeline?**
A: Etwa 15 Minuten für ein 50-seitiges Dokument, etwa 1 Stunde für 200 Seiten und etwa 3 Stunden für 500 Seiten. Die Verarbeitungszeit hängt von der Anzahl der visuellen Assets (Diagramme, Tabellen) ab, da jedes einzeln von Gemini Vision analysiert wird.

**F: Ist die Nutzung der Gemini API kostenpflichtig?**
A: Gemini bietet einen kostenlosen Tarif für kleine Dokumente (bis zu ca. 50 Seiten). Für größere Dokumente kann ein kostenpflichtiger API-Schlüssel erforderlich sein. Aktuelle Preise sind unter [Google AI Studio](https://aistudio.google.com) verfügbar.

**F: Kann ich ein anderes LLM als Gemini verwenden?**
A: Ja. Die Datei `pipeline/config.yaml` kann bearbeitet werden, um auf einen anderen Modell-Endpunkt zu verweisen. Die Textverarbeitungsschritte der Pipeline sind modellunabhängig konzipiert; nur der Vision-Analyseschritt erfordert ein multimodales Modell.

**F: Was passiert, wenn die Pipeline mittendrin fehlschlägt?**
A: Die Pipeline speichert den Fortschritt bei jedem Schritt. Bei einem Fehler in Schritt 7 kann die Ausführung ab Schritt 7 neu gestartet werden, ohne die Schritte 1–6 zu wiederholen. Alternativ kann der Job über die Oberfläche gelöscht und neu begonnen werden.

**F: Kann eine abgeschlossene Wissensdatenbank gelöscht werden?**
A: Ja. Das Papierkorb-Symbol in der Liste der letzten Uploads oder die Löschen-Schaltfläche auf der Job-Detailseite entfernt den Job und alle zugehörigen Daten dauerhaft.

**F: Welche Dateiformate werden unterstützt?**
A: Derzeit wird nur PDF unterstützt. Die Unterstützung von DOCX, EPUB und HTML ist für zukünftige Versionen geplant.

---

## Zusammenfassung: Verfügbare Funktionen für Benutzer

Nach der Ausführung von DocOracle auf einem Dokument stehen folgende Funktionen zur Verfügung:

| Funktion | Beschreibung |
|----------|-------------|
| **KI-Chat mit Zitaten** | Fragen stellen und Antworten mit genauen Seitenzahlen erhalten |
| **Buchstruktur-Registerkarte** | Kapitel und Abschnitte durchsuchen; auf einen Eintrag klicken, um eine Frage zu stellen |
| **Glossar-Registerkarte** | Alle extrahierten Begriffe durchsuchen; auf einen Eintrag klicken, um weitere Details anzufordern |
| **Fragen-stellen-Registerkarte** | 6 aus dem Dokument generierte Vorschlagsfragen |
| **Abruf visueller Assets** | Relevante Diagramme erscheinen automatisch neben den Antworten |
| **Bilderklärung** | Visuelle Zusammenfassung für komplexe Antworten generieren |
| **Löschsteuerung** | Jobs jederzeit entfernen (in der Warteschlange, in Bearbeitung, abgeschlossen oder fehlgeschlagen) |

---

*DocOracle — Weil jedes Dokument es verdient, verstanden zu werden.*
