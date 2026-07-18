const extractCodeBlocks = (content) => {
  const raw = String(content || "");
  const blockRegex = /```([a-z0-9]*)?\n([\s\S]*?)```/gi;
  const blocks = [];

  for (const match of raw.matchAll(blockRegex)) {
    const beforeText = raw.slice(Math.max(0, match.index - 120), match.index);
    const label =
      beforeText
        .split("\n")
        .map((line) => line.trim().toLowerCase())
        .filter(Boolean)
        .pop() || "";

    blocks.push({
      language: (match[1] || "").toLowerCase(),
      code: match[2].trim(),
      label,
    });
  }

  return blocks;
};

const looksLikeHtml = (code) =>
  /^\s*(<!doctype|<html[\s>]|<body[\s>]|<main[\s>]|<div[\s>]|<section[\s>]|<form[\s>])/i.test(
    code,
  );

const injectAssets = ({ html, css, js }) => {
  let preview = html;

  if (css) {
    preview = preview.includes("</head>")
      ? preview.replace("</head>", `<style>\n${css}\n</style>\n</head>`)
      : `<style>\n${css}\n</style>\n${preview}`;
  }

  if (js) {
    preview = preview.includes("</body>")
      ? preview.replace("</body>", `<script>\n${js}\n</script>\n</body>`)
      : `${preview}\n<script>\n${js}\n</script>`;
  }

  return preview;
};

const createHtmlArtifactFromBlocks = (blocks) => {
  const htmlBlock = blocks.find(
    (block) =>
      looksLikeHtml(block.code) &&
      (block.language === "html" || block.label.includes("index.html")),
  );

  if (!htmlBlock) return null;

  const cssBlock = blocks.find(
    (block) => block.language === "css" || block.label.includes("style.css"),
  );
  const jsBlock = blocks.find(
    (block) =>
      block.language === "js" ||
      block.language === "javascript" ||
      block.label.includes("script.js"),
  );
  const preview = injectAssets({
    html: htmlBlock.code,
    css: cssBlock?.code,
    js: jsBlock?.code,
  });

  return {
    title: "Generated HTML App",
    language: "html",
    code: blocks
      .filter((block) => block.code)
      .map((block) => block.code)
      .join("\n\n"),
    preview,
  };
};

const meaCalculatorCode = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MEA Calculator</title>
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f5f7fb;
        color: #172033;
      }

      main {
        width: min(920px, calc(100vw - 32px));
        margin: 0 auto;
        padding: 40px 0;
      }

      .header {
        margin-bottom: 20px;
      }

      h1 {
        margin: 0 0 8px;
        font-size: clamp(28px, 5vw, 42px);
        line-height: 1.05;
        letter-spacing: 0;
      }

      p {
        margin: 0;
        color: #5c687a;
        line-height: 1.6;
      }

      .panel {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 280px;
        gap: 16px;
        align-items: start;
      }

      .form,
      .result {
        border: 1px solid #dce3ee;
        border-radius: 8px;
        background: #ffffff;
        box-shadow: 0 16px 40px rgba(23, 32, 51, 0.08);
      }

      .form {
        padding: 18px;
      }

      label {
        display: block;
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 700;
        color: #26344d;
      }

      textarea {
        width: 100%;
        min-height: 88px;
        resize: vertical;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        padding: 12px;
        font: inherit;
        color: #172033;
        outline: none;
      }

      textarea:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
      }

      .field + .field {
        margin-top: 14px;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;
      }

      button {
        min-height: 40px;
        border: 0;
        border-radius: 8px;
        padding: 0 14px;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
      }

      .primary {
        background: #2563eb;
        color: white;
      }

      .secondary {
        background: #eef2f7;
        color: #26344d;
      }

      .result {
        padding: 18px;
      }

      .value {
        margin-top: 12px;
        font-size: 42px;
        line-height: 1;
        font-weight: 800;
        color: #0f766e;
      }

      .meta {
        display: grid;
        gap: 8px;
        margin-top: 16px;
        font-size: 13px;
        color: #5c687a;
      }

      .error {
        margin-top: 12px;
        color: #b42318;
        font-weight: 700;
      }

      @media (max-width: 760px) {
        .panel {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="header">
        <h1>MEA Calculator</h1>
        <p>Enter comma-separated actual and predicted values to calculate mean absolute error.</p>
      </section>

      <section class="panel">
        <form class="form" id="calculator">
          <div class="field">
            <label for="actual">Actual values</label>
            <textarea id="actual" placeholder="10, 20, 30, 40">10, 20, 30, 40</textarea>
          </div>

          <div class="field">
            <label for="predicted">Predicted values</label>
            <textarea id="predicted" placeholder="12, 18, 32, 38">12, 18, 32, 38</textarea>
          </div>

          <div class="actions">
            <button class="primary" type="submit">Calculate MEA</button>
            <button class="secondary" type="button" id="sample">Load sample</button>
          </div>

          <div class="error" id="error" role="alert"></div>
        </form>

        <aside class="result">
          <p>Mean absolute error</p>
          <div class="value" id="mea">2.0000</div>
          <div class="meta">
            <span id="count">4 data points</span>
            <span id="sum">Total absolute error: 8.0000</span>
          </div>
        </aside>
      </section>
    </main>

    <script>
      const parseValues = (value) => {
        const parts = value.split(",").map((item) => item.trim()).filter(Boolean);
        const numbers = parts.map(Number);

        if (!numbers.length || numbers.some((number) => Number.isNaN(number))) {
          throw new Error("Enter valid comma-separated numbers.");
        }

        return numbers;
      };

      const calculate = () => {
        const error = document.getElementById("error");
        error.textContent = "";

        try {
          const actual = parseValues(document.getElementById("actual").value);
          const predicted = parseValues(document.getElementById("predicted").value);

          if (actual.length !== predicted.length) {
            throw new Error("Actual and predicted lists must have the same length.");
          }

          const total = actual.reduce((sum, value, index) => {
            return sum + Math.abs(value - predicted[index]);
          }, 0);
          const mea = total / actual.length;

          document.getElementById("mea").textContent = mea.toFixed(4);
          document.getElementById("count").textContent = actual.length + " data points";
          document.getElementById("sum").textContent = "Total absolute error: " + total.toFixed(4);
        } catch (err) {
          error.textContent = err.message;
        }
      };

      document.getElementById("calculator").addEventListener("submit", (event) => {
        event.preventDefault();
        calculate();
      });

      document.getElementById("sample").addEventListener("click", () => {
        document.getElementById("actual").value = "10, 20, 30, 40";
        document.getElementById("predicted").value = "12, 18, 32, 38";
        calculate();
      });
    </script>
  </body>
</html>`;

const calculatorCode = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Calculator</title>
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #eef2f7;
        color: #101828;
      }

      .calculator {
        width: min(340px, calc(100vw - 32px));
        border: 1px solid #d0d5dd;
        border-radius: 8px;
        background: #ffffff;
        padding: 16px;
        box-shadow: 0 18px 48px rgba(16, 24, 40, 0.14);
      }

      .display {
        min-height: 72px;
        border-radius: 8px;
        background: #101828;
        color: #ffffff;
        padding: 18px 14px;
        text-align: right;
        font-size: 32px;
        font-weight: 800;
        overflow: hidden;
      }

      .keys {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        margin-top: 14px;
      }

      button {
        min-height: 52px;
        border: 0;
        border-radius: 8px;
        background: #f2f4f7;
        color: #101828;
        font: inherit;
        font-size: 18px;
        font-weight: 800;
        cursor: pointer;
      }

      button:hover {
        background: #e4e7ec;
      }

      .operator,
      .equals {
        background: #2563eb;
        color: #ffffff;
      }

      .operator:hover,
      .equals:hover {
        background: #1d4ed8;
      }

      .clear {
        background: #fee4e2;
        color: #b42318;
      }
    </style>
  </head>
  <body>
    <main class="calculator">
      <div class="display" id="display">0</div>
      <section class="keys">
        <button class="clear" data-action="clear">C</button>
        <button data-value="(">(</button>
        <button data-value=")">)</button>
        <button class="operator" data-value="/">/</button>
        <button data-value="7">7</button>
        <button data-value="8">8</button>
        <button data-value="9">9</button>
        <button class="operator" data-value="*">*</button>
        <button data-value="4">4</button>
        <button data-value="5">5</button>
        <button data-value="6">6</button>
        <button class="operator" data-value="-">-</button>
        <button data-value="1">1</button>
        <button data-value="2">2</button>
        <button data-value="3">3</button>
        <button class="operator" data-value="+">+</button>
        <button data-value="0">0</button>
        <button data-value=".">.</button>
        <button data-action="backspace">DEL</button>
        <button class="equals" data-action="equals">=</button>
      </section>
    </main>

    <script>
      const display = document.getElementById("display");
      let expression = "";

      const updateDisplay = () => {
        display.textContent = expression || "0";
      };

      document.querySelector(".keys").addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;

        if (button.dataset.action === "clear") {
          expression = "";
          updateDisplay();
          return;
        }

        if (button.dataset.action === "backspace") {
          expression = expression.slice(0, -1);
          updateDisplay();
          return;
        }

        if (button.dataset.action === "equals") {
          try {
            const normalized = expression.replace(/[^0-9+\\-*/().]/g, "");
            const result = Function('"use strict"; return (' + normalized + ")")();
            expression = Number.isFinite(result) ? String(result) : "Error";
          } catch {
            expression = "Error";
          }
          updateDisplay();
          return;
        }

        if (expression === "Error") expression = "";
        expression += button.dataset.value;
        updateDisplay();
      });
    </script>
  </body>
</html>`;

export const createArtifactFromResponse = ({ prompt, response }) => {
  const normalizedPrompt = String(prompt || "").toLowerCase();
  const blocks = extractCodeBlocks(response);
  const htmlArtifact = createHtmlArtifactFromBlocks(blocks);

  if (htmlArtifact) return htmlArtifact;

  if (
    normalizedPrompt.includes("calculator") &&
    (normalizedPrompt.includes("mea") ||
      normalizedPrompt.includes("mae") ||
      normalizedPrompt.includes("mean absolute error"))
  ) {
    return {
      title: "MEA Calculator",
      language: "html",
      code: meaCalculatorCode,
      preview: meaCalculatorCode,
    };
  }

  if (normalizedPrompt.includes("calculator")) {
    return {
      title: "Calculator App",
      language: "html",
      code: calculatorCode,
      preview: calculatorCode,
    };
  }

  return null;
};
