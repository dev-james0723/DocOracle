# DocOracle：用戶使用詳細指南（用真實例子解釋）

> 本文用一個真實例子，逐步展示用戶如何使用你嘅 DocOracle pipeline

---

## 真實例子：一個醫院想建立內部醫學知識庫

假設有一間醫院，佢哋有一本 600 頁嘅《急診醫學手冊》（PDF 格式）。佢哋想讓醫生可以通過 AI 聊天嘅方式快速查詢，而唔係每次都翻書。

醫院嘅 IT 部門主管決定用你嘅 DocOracle 項目。以下係佢哋會點樣做：

---

## 第一步：用戶下載你嘅 GitHub 項目

用戶進入你嘅 GitHub 倉庫 `github.com/你嘅用戶名/DocOracle`，見到一個綠色嘅按鈕寫著 **「Code」**。佢哋撳下去，選擇 **「Download ZIP」**。

```
github.com/你嘅用戶名/DocOracle
│
├── 綠色 Code 按鈕 ← 用戶撳呢度
│   └── Download ZIP ← 下載成一個 zip 檔
```

佢哋會下載到一個叫 `DocOracle-main.zip` 嘅檔案。

---

## 第二步：解壓縮，看到嘅文件結構

用戶解壓縮後，見到嘅文件結構係咁樣：

```
DocOracle-main/
│
├── README.md                    ← 最重要！用戶第一樣睇嘅
│
├── QUICK_START.md              ← 「我想 5 分鐘內跑起來」
│
├── docs/
│   ├── FULL_GUIDE.md           ← 詳細步驟
│   ├── ARCHITECTURE.md         ← 系統點樣運作
│   └── EXAMPLE_OUTPUT.md       ← 輸出會係咩樣
│
├── pipeline/
│   ├── requirements.txt        ← Python 依賴（pip install -r requirements.txt）
│   ├── run_all.sh              ← 一鍵執行全部（用戶只需要行呢個）
│   │
│   ├── 01_build_inventory.py
│   ├── 02_generate_page_records.py
│   ├── 03_build_visual_summary.py
│   ├── 04_merge_all_records.py
│   ├── 05_build_glossary_faq.py
│   ├── 06_build_retrieval.py
│   ├── 07_build_eval.py
│   ├── 08_identify_visual_pages.py
│   ├── 09_build_visual_assets.py
│   ├── 10_build_visual_metadata.py
│   └── config.yaml             ← 用戶可以改呢啲設定
│
├── website/
│   ├── README.md               ← 網站部署說明
│   ├── package.json
│   ├── client/
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── Chat.tsx
│   │   │   │   ├── Glossary.tsx
│   │   │   │   └── ...
│   │   └── ...
│   ├── server/
│   │   ├── knowledgeBase.ts
│   │   ├── routers.ts
│   │   ├── data/
│   │   │   └── .gitkeep         ← 空目錄，用戶嘅數據會放呢度
│   │   └── ...
│   └── ...
│
├── input/                       ← 用戶要將自己嘅 PDF 放呢度
│   └── .gitkeep
│
├── output/                      ← Pipeline 會生成嘅結果放呢度
│   └── .gitkeep
│
└── .gitignore                   ← 告訴 Git 忽略咩嘢
```

---

## 第三步：用戶準備自己嘅 PDF

醫院嘅 IT 部門將《急診醫學手冊.pdf》放入 `input/` 目錄：

```
DocOracle-main/
├── input/
│   └── 急診醫學手冊.pdf         ← 用戶放自己嘅 PDF 喺呢度
├── output/
│   └── (空嘅，等緊被填滿)
└── ...
```

---

## 第四步：用戶打開終端機（Terminal / Command Prompt），行 pipeline

用戶喺自己嘅電腦上打開終端機，進入 DocOracle 目錄：

```bash
cd ~/Downloads/DocOracle-main
```

然後行一個簡單嘅命令：

```bash
bash pipeline/run_all.sh
```

或者如果佢哋唔想用 bash，可以直接行 Python：

```bash
python pipeline/01_build_inventory.py
python pipeline/02_generate_page_records.py
python pipeline/03_build_visual_summary.py
... (依次行下去)
```

**或者最簡單嘅方法**：我會提供一個 Python script 叫 `run_pipeline.py`，用戶只需要：

```bash
python run_pipeline.py --input input/急診醫學手冊.pdf
```

搞掂！Pipeline 會自動行晒所有 12 個步驟。

---

## 第五步：Pipeline 自動處理（大概 2-4 小時，視乎 PDF 有幾大）

用戶坐低等。佢哋會睇到終端機不斷輸出進度：

```
[2026-04-19 10:00:00] Starting DocOracle pipeline...
[2026-04-19 10:00:05] Task 1: Building page inventory...
  - Analyzing 600 pages
  - Classifying pages: 450 text pages, 80 diagram pages, 70 mixed
[2026-04-19 10:15:30] Task 2: Generating page records...
  - Processing pages 1-50 with Gemini Vision API...
  - Processing pages 51-100...
  [████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 25%
[2026-04-19 11:45:00] Task 3: Building visual summary...
[2026-04-19 12:30:00] Task 4: Merging records...
[2026-04-19 12:45:00] Task 5: Building glossary and FAQ...
[2026-04-19 13:00:00] Task 6: Building retrieval layer...
[2026-04-19 13:15:00] Task 7: Building evaluation set...
[2026-04-19 13:30:00] Task 8: Identifying visual pages...
[2026-04-19 13:45:00] Task 9: Building visual assets...
[2026-04-19 14:00:00] Task 10: Building visual metadata...
[2026-04-19 14:15:00] ✅ Pipeline complete!
```

---

## 第六步：Pipeline 生成嘅輸出文件

Pipeline 完成後，`output/` 目錄會被填滿：

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
│   ├── ... (600 個文件)
│   └── page_600.json
│
├── 03_visual_reviews/
│   └── high_risk_pages_summary.md
│
├── 04_gold_master/
│   ├── page_chunks.jsonl          ← 重要！每一頁嘅文字
│   ├── glossary.json               ← 重要！術語定義
│   ├── sections.json               ← 重要！章節結構
│   └── faq_seeds.json
│
├── 05_retrieval/
│   ├── page_chunks.jsonl           ← 用來搜索嘅
│   ├── section_chunks.jsonl
│   └── retrieval_strategy.md
│
├── 06_eval/
│   └── eval_questions.json
│
├── 10_visual_assets/
│   ├── diagrams/
│   │   ├── diagram_001.png
│   │   ├── diagram_001.json        ← 描述呢張圖
│   │   ├── diagram_002.png
│   │   └── ...
│   ├── tables/
│   │   ├── table_001.png
│   │   ├── table_001.json
│   │   └── ...
│   └── visual_assets_index.json    ← 所有視覺資產嘅索引
│
└── 09_final_report/
    └── final_report.md
```

---

## 第七步：用戶複製關鍵數據文件到網站

現在最重要嘅一步。用戶需要將 **4 個關鍵文件** 複製到網站嘅 `server/data/` 目錄：

```bash
cp output/04_gold_master/page_chunks.jsonl website/server/data/
cp output/04_gold_master/glossary.json website/server/data/
cp output/04_gold_master/sections.json website/server/data/
cp output/10_visual_assets/visual_assets_index.json website/server/data/
```

現在 `website/server/data/` 變成咁：

```
website/server/data/
├── page_chunks.jsonl              ← 600 頁嘅文字內容
├── glossary.json                  ← 醫學術語定義
├── sections.json                  ← 手冊嘅章節結構
└── visual_assets_index.json       ← 圖表索引
```

---

## 第八步：用戶啟動網站

用戶進入 `website/` 目錄，安裝依賴同啟動：

```bash
cd website/
npm install
npm run dev
```

網站會喺 `http://localhost:3000` 啟動。

---

## 第九步：醫生可以用 AI 聊天查詢

現在醫院嘅醫生可以打開呢個網站，問問題：

**醫生**：「如果病人有嚴重胸痛，我應該做咩檢查？」

**DocOracle AI**：「根據手冊第 245 頁，對於胸痛患者，應該首先進行以下檢查：
1. 心電圖（ECG）- 手冊第 246 頁有詳細說明
2. 胸部 X 光 - 手冊第 248 頁
3. 血液檢查 - 手冊第 250 頁

[顯示相應嘅圖表]

[「Turn into image explanation」按鈕 - 醫生可以點擊生成一張視覺化嘅檢查流程圖]」

---

## 總結：用戶會上傳到 GitHub 嘅文件結構

現在你明白咗，用戶需要嘅係：

```
DocOracle/
│
├── README.md                    ← 最重要！清楚解釋點樣用
├── QUICK_START.md               ← 5 分鐘快速開始指南
│
├── pipeline/
│   ├── requirements.txt
│   ├── run_all.sh
│   ├── 01_build_inventory.py
│   ├── 02_generate_page_records.py
│   ├── ... (所有 12 個 Python 腳本)
│   └── config.yaml
│
├── website/
│   ├── (所有網站源代碼)
│   └── server/data/.gitkeep     ← 空目錄，用戶嘅數據放呢度
│
├── input/
│   └── .gitkeep                 ← 用戶放 PDF 喺呢度
│
├── output/
│   └── .gitkeep                 ← Pipeline 輸出放呢度
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── FULL_GUIDE.md
│   └── EXAMPLE_OUTPUT.md
│
└── .gitignore
```

---

## 用戶一睇 README 就應該明白嘅嘢

你嘅 README 應該包含：

1. **一句話描述**：「將任何技術 PDF 轉換成一個 AI 聊天知識庫」

2. **一張圖**：展示整個流程（PDF → Pipeline → JSON → Website）

3. **Quick Start（5 分鐘）**：
   ```bash
   git clone https://github.com/你/DocOracle.git
   cd DocOracle
   pip install -r pipeline/requirements.txt
   cp 你的文件.pdf input/
   bash pipeline/run_all.sh
   cd website && npm install && npm run dev
   ```

4. **詳細步驟**：逐步解釋每一步做咩

5. **輸出會係咩樣**：展示 `output/` 目錄嘅結構

6. **常見問題**：
   - Q: 要幾耐先完成？A: 視乎 PDF 大小，通常 2-4 小時
   - Q: 需要 API key 嗎？A: 需要 Gemini API key（免費額度有限）
   - Q: 可以用其他 LLM 嗎？A: 可以，改 `config.yaml` 就得

---

## 最重要嘅一點：你要準備一個「範例輸出」

用戶最想睇嘅係：「如果我用咗你嘅 pipeline，最後會得到啲咩嘢？」

所以你應該在 GitHub 上提供一個 **sample output 目錄**，裡面有：

```
sample_output/
├── page_chunks.jsonl (前 10 頁嘅範例)
├── glossary.json (前 20 個詞彙嘅範例)
├── sections.json (章節結構範例)
├── visual_assets_index.json (前 5 個視覺資產嘅範例)
└── README.md (解釋呢啲文件係咩)
```

咁用戶就可以唔使行 pipeline，直接用呢啲 sample data 啟動網站，睇下效果。

---

## 最後：用戶會問嘅問題

當用戶睇到你嘅項目時，佢哋心裡會問：

1. ✅ **「我點樣用？」** → README 要清楚
2. ✅ **「要幾耐？」** → 要講清楚時間
3. ✅ **「最後會得到啲咩？」** → 要有 sample output
4. ✅ **「我需要咩技能？」** → 要清楚講 Python/Node.js 知識要求
5. ✅ **「要俾錢嗎？」** → 要講清楚 API 成本（Gemini Vision API 有免費額度）

---

## 你要上傳嘅文件清單

總結一下，你要上傳到 GitHub 嘅係：

| 文件/目錄 | 用途 | 必須嗎？ |
|---------|------|--------|
| `README.md` | 項目介紹 + Quick Start | **必須** |
| `QUICK_START.md` | 5 分鐘快速指南 | **必須** |
| `pipeline/*.py` | 12 個處理腳本 | **必須** |
| `pipeline/run_all.sh` | 一鍵執行 | **必須** |
| `pipeline/requirements.txt` | Python 依賴 | **必須** |
| `website/` | 完整網站源代碼 | **必須** |
| `docs/ARCHITECTURE.md` | 系統架構 | 推薦 |
| `docs/FULL_GUIDE.md` | 詳細步驟 | 推薦 |
| `sample_output/` | 範例輸出 | 推薦 |
| `LICENSE` | MIT License | **必須** |
| `.gitignore` | 忽略文件列表 | **必須** |

---

## 最重要嘅一句話

**用戶下載你嘅項目後，應該能夠 5 分鐘內理解「我要做咩」，30 分鐘內開始跑 pipeline，2-4 小時後得到一個完整嘅 AI 知識庫網站。**

如果用戶做唔到呢啲，就代表你嘅 README 同文檔寫得唔夠清楚。
