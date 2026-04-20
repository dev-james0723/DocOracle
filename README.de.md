# DocOracle

**Verwandeln Sie jedes PDF in eine KI-gestützte Wissensdatenbank — mit Chat, Diagrammen, Quellenangaben und einer deploymentfähigen Website.**

DocOracle ist ein Open-Source-Projekt, das jedes PDF-Dokument in eine vollständig strukturierte KI-Wissensdatenbank umwandelt. Es extrahiert jede Seite, analysiert jedes Diagramm mit Gemini Vision, erstellt durchsuchbare Daten und generiert optional eine interaktive Website, auf der Nutzer Fragen stellen und Antworten erhalten können, die auf dem Originaldokument basieren — mit seitengenauer Quellenangabe und automatisch angezeigten relevanten Diagrammen.

![Landing Page](screenshots/01_landing_page.webp)

---

## Sprache wechseln | Language

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [Deutsch](README.de.md)

---

## Warum DocOracle? (Warum nicht einfach ein PDF bei ChatGPT hochladen?)

Sie fragen sich vielleicht: *„Kann ich mein PDF nicht einfach bei ChatGPT oder Claude hochladen und Fragen stellen?"*

Das können Sie — aber hier ist, was dabei passiert:

| | PDF bei ChatGPT/Claude hochladen | DocOracle |
|---|---|---|
| **Seitenangaben** | Vage oder fehlend — das LLM kann nicht zuverlässig sagen, von welcher Seite eine Antwort stammt | Jede Antwort enthält genaue Seitenzahlen, da die Pipeline Seitengrenzen beibehält |
| **Diagramme und Bilder** | Werden ignoriert oder schlecht beschrieben — die meisten LLMs überspringen visuelle Inhalte vollständig | Jedes Diagramm, jede Tabelle und jedes Foto wird von Gemini Vision mit detaillierten räumlichen Beschreibungen und Abruf-Tags analysiert |
| **Große Dokumente (200+ Seiten)** | Kontextfenster-Überlauf — das LLM verwirft Inhalte stillschweigend, was zu unvollständigen oder halluzinierten Antworten führt | Die Pipeline verarbeitet jede Seite einzeln und erstellt dann abrufoptimierte Chunks — kein Inhalt geht verloren |
| **Konsistenz** | Möglicherweise unterschiedliche Antworten bei derselben Frage | Strukturierte JSON-Daten gewährleisten deterministischen Abruf — dieselbe Frage findet immer dieselbe Evidenz |
| **Wiederverwendbarkeit** | In einer einzelnen Chat-Sitzung gesperrt — nicht teilbar, durchsuchbar oder erweiterbar | Ausgabe sind Standard-JSON-Dateien, die eine Website antreiben, ein RAG-System speisen oder in jede Anwendung integriert werden können |
| **Glossar und Struktur** | Keine — nur rohe Antworten ohne Navigation | Automatisch generiertes Glossar mit Kategorie-Badges, Kapitel-/Abschnittsnavigator mit Zusammenfassungen und Keyword-Tags |
| **Teilbares Produkt** | Ein privater Chat-Thread | Eine deploymentfähige Website, die jeder in Ihrem Team (oder Ihre Leser, Studenten oder Kunden) nutzen kann |

Kurz gesagt: Ein PDF bei einem LLM hochzuladen liefert Ihnen ein **einmaliges Gespräch**. DocOracle gibt Ihnen eine **permanente, strukturierte, teilbare Wissensdatenbank**, die jede Seite, jedes Diagramm und jede Quellenangabe bewahrt.

---

## Für wen ist das gedacht?

DocOracle dient verschiedenen Nutzertypen je nach technischem Hintergrund und Zielen. Lesen Sie die Kategorie, die zu Ihnen passt.

### Kategorie 1 — Nicht-technische Nutzer (Kein Coding erforderlich)

Diese Nutzer möchten ein PDF in eine KI-Wissensdatenbank umwandeln, ohne Code zu schreiben oder Skripte auszuführen.

#### 1.1 Live-Demo ausprobieren (Null Einrichtungsaufwand)

**Sie sind:** Jemand mit einem PDF, der DocOracle sofort ausprobieren möchte, ohne etwas zu installieren.

**Was Sie tun:** Besuchen Sie die [DocOracle Live-Demo](https://decca-oracle.manus.space), klicken Sie auf „Mit Ihrem PDF ausprobieren", laden Sie Ihr Dokument hoch und warten Sie, bis die Pipeline es verarbeitet hat. Danach können Sie direkt im Browser mit der KI über Ihr Dokument chatten — mit Quellenangaben und Diagrammen.

**Was Sie benötigen:** Einen Webbrowser und eine PDF-Datei. Mehr nicht.

> Dies ist der schnellste Weg, DocOracle zu erleben. Kein Download, kein Terminal, keine API-Schlüssel.

#### 1.2 Eine eigenständige KI-Wissensdatenbank-Website erstellen (No-Code-Tools)

**Sie sind:** Jemand, der KI-gestützte Web-Builder wie [Base44](https://base44.com), [Lovable](https://lovable.dev), [Vibecoding.ai](https://vibecoding.ai) oder [Cursor](https://cursor.sh) verwendet und eine eigene KI-Wissensdatenbank-Website aus Ihrem PDF erstellen möchte.

**Was Sie tun:** Führen Sie die DocOracle-Pipeline aus (oder lassen Sie einen KI-Agenten sie für Sie ausführen — siehe [Kategorie 2](#kategorie-2--entwickler-und-technische-nutzer)), um Ihr PDF in 4 JSON-Datendateien zu verarbeiten. Verwenden Sie dann Ihren bevorzugten No-Code-Builder, um eine Website zu erstellen, die diese JSON-Dateien liest und eine KI-Chat-Oberfläche bereitstellt.

**Was Sie erhalten:** Eine eigenständige Website, die Sie besitzen und kontrollieren, angetrieben durch den Inhalt Ihres Dokuments.

#### 1.3 Ein einbettbares KI-Chat-Widget für Ihre bestehende Website erstellen

**Sie sind:** Jemand, der bereits eine Website hat (Unternehmensseite, WordPress-Blog, Portfolio usw.) und ein KI-gestütztes „Mein Dokument fragen"-Chat-Widget hinzufügen möchte.

**Was Sie tun:** Wie 1.2, aber statt einer vollständigen Website erstellen Sie mit einem No-Code-Tool ein leichtgewichtiges Chat-Widget und betten es über `<iframe>` oder `<script>`-Tag in Ihre bestehende Website ein.

**Was Sie erhalten:** Ein KI-Chat-Fenster in Ihrer aktuellen Website — Besucher können Fragen zu Ihren PDF-Inhalten stellen, ohne Ihre Website zu verlassen.

---

### Kategorie 2 — Entwickler und technische Nutzer

Diese Nutzer sind mit Terminal, Python und/oder JavaScript vertraut und möchten mehr Kontrolle über die Pipeline und die Ausgabe.

#### 2.1 Full-Stack-Entwickler (KI-Wissensdatenbank-MVP schnell erstellen)

**Sie sind:** Ein Entwickler, der React/Node.js kennt und schnell eine KI-Wissensdatenbank für einen Kunden oder ein Projekt erstellen möchte — ohne die gesamte PDF-Verarbeitungs-Pipeline von Grund auf neu zu schreiben.

**Was Sie tun:** Klonen Sie dieses Repository, legen Sie Ihr PDF in `input/` ab, führen Sie die Pipeline aus und starten Sie die Website. Passen Sie die UI an, wechseln Sie den LLM-Anbieter oder erweitern Sie die API nach Bedarf. Siehe den Abschnitt [Schnellstart](#schnellstart) unten.

**Was Sie erhalten:** Eine funktionierende KI-Wissensdatenbank-Website in weniger als einem Tag, mit Chat, Glossar, Abschnittsnavigation und visuellem Asset-Abruf — bereit zur Demo oder zum Deployment.

#### 2.2 KI-Agenten nur für die Pipeline nutzen (JSON-Ausgabe erhalten)

**Sie sind:** Ein Entwickler oder Dateningenieur, der die strukturierte JSON-Ausgabe der Pipeline möchte, aber keine Website benötigt. Sie planen, die Daten in Ihr eigenes RAG-System, Ihre Suchmaschine oder Ihre benutzerdefinierte Anwendung einzuspeisen.

**Was Sie tun:** Kopieren Sie den fertigen Prompt unten, fügen Sie ihn in einen fähigen KI-Agenten (ChatGPT, Claude, Manus AI usw.) ein und hängen Sie Ihr PDF an. Der KI-Agent führt die vollständige Pipeline aus und erstellt den `PDF_PROJECT_OUTPUT/`-Ordner mit allen Ergebnissen.

**Was Sie erhalten:** 4 Schlüssel-JSON-Dateien (`page_chunks.jsonl`, `glossary.json`, `sections.json`, `visual_assets_index.json`) plus Bewertungsfragen, einen System-Prompt und visuelle Asset-Metadaten — alles in Standard-JSON-Format, das von jeder Programmiersprache gelesen werden kann.

> **Kopier-Einfüge-Prompt für diesen Anwendungsfall:** Siehe [`docs/PROMPT_PIPELINE_ONLY.md`](docs/PROMPT_PIPELINE_ONLY.md)

#### 2.3 KI-Agenten für Pipeline UND Website nutzen (End-to-End)

**Sie sind:** Ein Entwickler, Gründer oder technischer Nutzer, der möchte, dass ein KI-Agent alles erledigt — das PDF verarbeitet und in einer einzigen Sitzung eine vollständige, deploymentfähige KI-Wissensdatenbank-Website erstellt.

**Was Sie tun:** Kopieren Sie den fertigen Prompt, fügen Sie ihn in einen fähigen KI-Agenten (Manus AI, Claude Cowork usw.) ein und hängen Sie Ihr PDF an. Der KI-Agent führt die vollständige Pipeline aus, generiert die JSON-Daten und erstellt und deployed dann eine interaktive Website mit KI-Chat, Glossar, Abschnittsnavigation und visuellem Asset-Abruf.

**Was Sie erhalten:** Eine vollständig funktionsfähige KI-Wissensdatenbank-Website, bereit zur Weitergabe an Ihr Team, Kunden oder Ihr Publikum.

> **Kopier-Einfüge-Prompt für diesen Anwendungsfall:** Siehe [`docs/PROMPT_PIPELINE_AND_WEBSITE.md`](docs/PROMPT_PIPELINE_AND_WEBSITE.md)

#### 2.4 Backend-/Dateningenieur (Nur Pipeline, eigenes Frontend erstellen)

**Sie sind:** Ein Python-Entwickler oder Dateningenieur, der bereits ein Frontend oder eine Anwendung hat. Sie benötigen nur eine zuverlässige PDF-zu-strukturierten-Daten-Pipeline.

**Was Sie tun:** Verwenden Sie nur das `pipeline/`-Verzeichnis. Führen Sie die Skripte lokal auf Ihrem Rechner aus. Die Ausgabe-JSON-Dateien können in jeden Tech-Stack integriert werden — Python, PHP, Go, Java, Ruby oder alles, was JSON lesen kann.

**Was Sie erhalten:** Saubere, strukturierte JSON-Daten mit seitenweisen Textchunks, einem Glossar, Abschnittshierarchie und visuellen Asset-Metadaten — bereit zur Integration in Ihr bestehendes System.

---

### Kategorie 3 — Geschäfts- und Unternehmensnutzer

#### 3.1 Unternehmensschulung / HR-Abteilungen

**Sie sind:** Ein HR-Manager oder Schulungsleiter mit Mitarbeiterhandbüchern, SOPs, Compliance-Handbüchern oder Einarbeitungsmaterialien im PDF-Format.

**Ihr Ziel:** Mitarbeitern ermöglichen, Fragen zu stellen wie *„Was ist die Urlaubsregelung?"* oder *„Wie reiche ich eine Spesenabrechnung ein?"* und sofortige, genaue Antworten mit Seitenverweisen zu erhalten.

**Wie Sie DocOracle nutzen:** Lassen Sie Ihr IT-Team die Pipeline ausführen (oder verwenden Sie einen KI-Agenten mit den Prompts in Kategorie 2), und deployen Sie dann die Website intern für Ihre Mitarbeiter.

#### 3.2 Autoren und Verlage

**Sie sind:** Ein Autor, technischer Redakteur oder Verleger, der ein Buch oder Handbuch geschrieben hat und Lesern einen KI-gestützten Begleiter anbieten möchte.

**Ihr Ziel:** Lesern ermöglichen, Fragen zu stellen wie *„Was behandelt Kapitel 5?"* und Antworten zu erhalten, die auf Ihrem Buch basieren, mit Seitenangaben.

**Wie Sie DocOracle nutzen:** Verarbeiten Sie das PDF Ihres Buches durch die Pipeline und deployen Sie die Website als Begleiter zu Ihrer Publikation.

---

### Kategorie 4 — Forscher und Akademiker

#### 4.1 Forscher, Wissenschaftler und Doktoranden

**Sie sind:** Ein Forscher, der mit langen Regierungsberichten, wissenschaftlichen Arbeiten, Richtliniendokumenten oder technischen Spezifikationen arbeitet.

**Ihr Ziel:** Schnell spezifische Klauseln, Datenpunkte oder Argumente in einem 500-seitigen Dokument finden — ohne es von Anfang bis Ende zu lesen.

**Wie Sie DocOracle nutzen:** Führen Sie die Pipeline auf Ihrem Dokument aus und starten Sie die Website lokal. Verwenden Sie den KI-Chat, um Ihr Dokument mit vollständiger Quellenangabe abzufragen.

---

### Kategorie 5 — Pädagogen und Bildungseinrichtungen

#### 5.1 Lehrer und Bildungseinrichtungen

**Sie sind:** Ein Lehrer, Professor oder Nachhilfezentrum mit Lehrbüchern, Vorlesungsnotizen oder Lernmaterialien.

**Ihr Ziel:** Schülern einen KI-Lernassistenten geben, der Fragen wie *„Was ist Newtons drittes Gesetz?"* beantwortet — mit Antworten, die auf dem tatsächlichen Lehrbuch basieren und spezifische Seiten zitieren.

**Wie Sie DocOracle nutzen:** Verarbeiten Sie das Lehrbuch-PDF und deployen Sie die Website für Ihre Schüler. Jede Antwort enthält Seitenzahlen, sodass Schüler im Originalmaterial nachschlagen können.

---

## Funktionsübersicht

| Funktion | Beschreibung |
|----------|-------------|
| **Gemini Vision-Analyse** | Jedes Diagramm, jede Tabelle und jedes Bild wird von Gemini Vision mit detaillierten räumlichen Beschreibungen analysiert |
| **KI-Chat mit Quellenangaben** | Fragen stellen und dokumentenbasierte Antworten mit Seitenzahlen erhalten |
| **Visueller Asset-Abruf** | Relevante Diagramme erscheinen automatisch neben Chat-Antworten |
| **Glossar-Browser** | Alphabetisches Glossar mit Kategorie-Badges und Seitenverweisen |
| **Abschnittsnavigator** | Vollständige Buchstruktur mit Zusammenfassungen und Keyword-Tags |
| **Bilderklärung** | Schaltfläche „In Bilderklärung umwandeln" generiert KI-visuelle Zusammenfassungen komplexer Antworten |
| **Dunkel-/Hellmodus** | Zwischen dunklem und hellem Modus wechseln |
| **PDF-Upload-Demo** | Integrierte Oberfläche zum Hochladen und Verarbeiten neuer PDFs |

---

## Schnellstart

> Dieser Abschnitt richtet sich an **Entwickler** (Nutzertypen 2.1 und 2.4). Wenn Sie ein nicht-technischer Nutzer sind, lesen Sie [Kategorie 1](#kategorie-1--nicht-technische-nutzer-kein-coding-erforderlich) oben.

### Voraussetzungen

| Anforderung | Version | Zweck |
|-------------|---------|-------|
| Python | 3.9+ | Pipeline-Skripte |
| Node.js | 18+ | Website |
| pdftotext | beliebig | Textextraktion (`sudo apt-get install poppler-utils`) |
| Gemini API-Schlüssel | — | Vision-Analyse und Chat ([Kostenlosen Schlüssel erhalten](https://aistudio.google.com/app/apikey)) |

### Schritt 1: Repository klonen

```bash
git clone https://github.com/dev-james0723/DocOracle.git
cd DocOracle
```

### Schritt 2: Ihr PDF ablegen

```bash
cp /path/to/your/book.pdf input/
```

### Schritt 3: Pipeline-Abhängigkeiten installieren

```bash
pip install -r pipeline/requirements.txt
```

### Schritt 4: API-Schlüssel setzen

```bash
export GEMINI_API_KEY="your-gemini-api-key"
```

### Schritt 5: Pipeline ausführen

```bash
bash pipeline/run_all.sh
```

Die Pipeline verarbeitet Ihr PDF in 12 Schritten. Die Verarbeitungszeit hängt von der Seitenanzahl ab:

| Seiten | Geschätzte Zeit |
|--------|----------------|
| 50 | ~15 Minuten |
| 200 | ~1 Stunde |
| 500 | ~3 Stunden |

### Schritt 6: Website starten

```bash
# Die 4 Schlüssel-Ausgabedateien in die Website kopieren
cp output/05_retrieval/page_chunks.jsonl website/server/data/
cp output/04_gold_master/glossary.json website/server/data/
cp output/04_gold_master/sections.json website/server/data/
cp output/10_visual_assets/visual_assets_index.json website/server/data/visual_assets.json

# Website installieren und starten
cd website
npm install
npm run dev
```

Öffnen Sie `http://localhost:3000` in Ihrem Browser. Ihre KI-Wissensdatenbank ist bereit.

---

## Pipeline-Schritte

Die Pipeline besteht aus 12 Python-Skripten, die sequenziell ausgeführt werden:

| Schritt | Skript | Funktion |
|---------|--------|----------|
| 1 | `01_build_inventory.py` | Klassifiziert jede Seite als Text, Diagramm, Foto oder gemischt |
| 2 | `02_generate_page_records.py` | Erstellt detaillierte Datensätze für jede Seite mit Gemini Vision |
| 3 | `03_merge_all_records.py` | Führt Textextraktion und Visionsanalyse zu Gold-Master-Datensätzen zusammen |
| 4 | `04_build_visual_summary.py` | Generiert Zusammenfassungen für risikoreiche visuelle Seiten |
| 5 | `05_build_sections_glossary.py` | Erstellt Kapitel-/Abschnittsstruktur und Glossar |
| 6 | `06_build_glossary_faq.py` | Generiert FAQ-Seeds aus dem Inhalt |
| 7 | `07_build_retrieval.py` | Erstellt abrufoptimierte Chunks für RAG |
| 8 | `08_build_eval.py` | Generiert 80+ Bewertungsfragen für Tests |
| 9 | `09_identify_visual_pages.py` | Identifiziert alle Seiten mit Diagrammen, Tabellen oder Bildern |
| 10 | `10_build_visual_assets.py` | Extrahiert visuelle Assets als einzelne Bilder |
| 11 | `11_build_visual_metadata.py` | Verknüpft jedes visuelle Asset mit beschreibenden Metadaten |
| 12 | `12_build_url_map.py` | Erstellt die URL-Zuordnung für die Webanzeige |

---

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert — siehe die [LICENSE](LICENSE)-Datei für Details.

**Wichtig:** DocOracle ist ein Werkzeug zur Verarbeitung von Dokumenten, für die Sie die rechtliche Nutzungsberechtigung haben. Der Pipeline- und Website-Code ist Open Source; die von Ihnen verarbeiteten Dokumente liegen in Ihrer Verantwortung. Laden Sie niemals urheberrechtlich geschütztes Material hoch, für das Sie keine Nutzungserlaubnis haben.

---

<p align="center">
  <strong>DocOracle</strong> — Denn jedes Dokument verdient es, verstanden zu werden.
</p>
