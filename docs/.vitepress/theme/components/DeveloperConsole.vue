<script setup lang="ts">
import { computed, ref } from 'vue';
import { baseUrl, contractExamples, mockResponse, type SimulatorScenario } from '../data/contractExamples';
import { md5 } from '../utils/md5';

type SnippetLanguage = 'curl' | 'node' | 'java' | 'python';

const operations = contractExamples;
const defaultOperation = operations.find((operation) => operation.id === 'pay') || operations[0];
const scenarios: SimulatorScenario[] = [
  'SUCCESS',
  'IN_PROGRESS',
  'SIGN_ERROR',
  'PARAM_ERROR',
  'ORDER_NOT_FOUND',
  'DUPLICATE_REQUEST'
];
const snippetLanguages: Array<{ id: SnippetLanguage; label: string }> = [
  { id: 'curl', label: 'cURL' },
  { id: 'node', label: 'Node.js' },
  { id: 'java', label: 'Java' },
  { id: 'python', label: 'Python' }
];

const selectedOperationId = ref(defaultOperation.id);
const selectedScenario = ref<SimulatorScenario>('SUCCESS');
const selectedSnippetLanguage = ref<SnippetLanguage>('curl');
const terminalSn = ref(defaultOperation.sn);
const signingKey = ref(defaultOperation.key);
const rawBody = ref(defaultOperation.rawBody);
const webhookSn = ref(defaultOperation.sn);
const webhookKey = ref(defaultOperation.key);
const webhookBody = ref(
  '{"sn":"7893259247405832","client_sn":"MEX202605220001","order_status":"PAID","total_amount":"1000","finish_time":"1779436800000"}'
);
const webhookSignature = ref('');
const copied = ref('');

const selectedOperation = computed(() => operations.find((item) => item.id === selectedOperationId.value) || defaultOperation);
const signatureInput = computed(() => `${rawBody.value}${signingKey.value}`);
const signature = computed(() => md5(signatureInput.value));
const authorizationHeader = computed(() => `${terminalSn.value} ${signature.value}`);
const webhookComputedSignature = computed(() => md5(`${webhookBody.value}${webhookKey.value}`));
const webhookMatches = computed(() => webhookSignature.value.trim().toLowerCase() === webhookComputedSignature.value);
const simulatedResponse = computed(() =>
  JSON.stringify(mockResponse(selectedScenario.value, selectedOperation.value.id, rawBody.value), null, 2)
);
const requestUrl = computed(() => `${baseUrl}${selectedOperation.value.path}`);

const snippets = computed<Record<SnippetLanguage, string>>(() => {
  const escapedBody = rawBody.value.replace(/'/g, "'\\''");
  const nodeBody = JSON.stringify(rawBody.value);
  const javaBody = rawBody.value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const pythonBody = JSON.stringify(rawBody.value);

  return {
    curl: `curl -X POST '${requestUrl.value}' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: ${authorizationHeader.value}' \\
  -d '${escapedBody}'`,
    node: `import crypto from 'node:crypto';

const rawBody = ${nodeBody};
const key = '${signingKey.value}';
const sn = '${terminalSn.value}';
const sign = crypto.createHash('md5').update(rawBody + key, 'utf8').digest('hex');

const response = await fetch('${requestUrl.value}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: \`\${sn} \${sign}\`
  },
  body: rawBody
});`,
    java: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

String rawBody = "${javaBody}";
String key = "${signingKey.value}";
String sn = "${terminalSn.value}";
MessageDigest md = MessageDigest.getInstance("MD5");
byte[] digest = md.digest((rawBody + key).getBytes(StandardCharsets.UTF_8));
StringBuilder sign = new StringBuilder();
for (byte b : digest) {
  sign.append(String.format("%02x", b & 0xff));
}

HttpRequest request = HttpRequest.newBuilder()
  .uri(URI.create("${requestUrl.value}"))
  .header("Content-Type", "application/json")
  .header("Authorization", sn + " " + sign)
  .POST(HttpRequest.BodyPublishers.ofString(rawBody, StandardCharsets.UTF_8))
  .build();
HttpClient.newHttpClient().send(request, java.net.http.HttpResponse.BodyHandlers.ofString());`,
    python: `import hashlib
import requests

raw_body = ${pythonBody}
key = "${signingKey.value}"
sn = "${terminalSn.value}"
sign = hashlib.md5((raw_body + key).encode("utf-8")).hexdigest()

response = requests.post(
    "${requestUrl.value}",
    headers={
        "Content-Type": "application/json",
        "Authorization": f"{sn} {sign}",
    },
    data=raw_body.encode("utf-8"),
)`
  };
});
const activeSnippet = computed(() => snippets.value[selectedSnippetLanguage.value]);
const highlightedSnippet = computed(() => highlightCode(activeSnippet.value, selectedSnippetLanguage.value));

function loadOperation(operationId = selectedOperationId.value): void {
  selectedOperationId.value = operationId;
  const operation = selectedOperation.value;
  terminalSn.value = operation.sn;
  signingKey.value = operation.key;
  rawBody.value = operation.rawBody;
}

async function copy(value: string, label: string): Promise<void> {
  await navigator.clipboard.writeText(value);
  copied.value = label;
  window.setTimeout(() => {
    if (copied.value === label) copied.value = '';
  }, 1600);
}

function useComputedWebhookSignature(): void {
  webhookSignature.value = webhookComputedSignature.value;
}

function selectSnippetLanguage(language: SnippetLanguage): void {
  selectedSnippetLanguage.value = language;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function highlightCode(value: string, language: SnippetLanguage): string {
  const escaped = escapeHtml(value);
  const strings: string[] = [];
  const stashString = (match: string) => {
    const token = `@@STRING_${strings.length}@@`;
    strings.push(`<span class="token string">${match}</span>`);
    return token;
  };
  const restoreStrings = (marked: string) =>
    marked.replace(/@@STRING_(\d+)@@/g, (_, index: string) => strings[Number(index)] || '');

  if (language === 'curl') {
    const marked = escaped
      .replace(/(&#39;[^]*?&#39;)/g, stashString)
      .replace(/(-[A-Z])\b/g, '<span class="token keyword">$1</span>')
      .replace(/(--[a-z-]+)/g, '<span class="token keyword">$1</span>');
    return restoreStrings(marked);
  }

  const keywordPattern =
    language === 'python'
      ? /\b(import|from|as|def|return|if|else|for|in|with|True|False|None)\b/g
      : /\b(import|const|let|var|await|new|return|for|String|byte|class|public|static|void)\b/g;

  const withoutStrings = escaped.replace(/(&quot;(?:\\.|[^])*?&quot;|&#39;(?:\\.|[^])*?&#39;|`(?:\\.|[^])*?`)/g, stashString);
  const marked = withoutStrings
    .replace(/(\/\/.*|#.*)$/gm, '<span class="token comment">$1</span>')
    .replace(keywordPattern, '<span class="token keyword">$1</span>');
  return restoreStrings(marked);
}
</script>

<template>
  <div class="developer-console">
    <header class="console-header">
      <div>
        <p class="eyebrow">MUWE sandbox</p>
        <h2>Sandbox workbench</h2>
        <p>Calculate signatures, simulate contract responses, verify notifications, and copy one production-shaped snippet.</p>
      </div>
      <div class="endpoint-card" aria-label="Selected endpoint">
        <span>{{ selectedOperation.family }}</span>
        <code>{{ selectedOperation.method }} {{ selectedOperation.path }}</code>
      </div>
    </header>

    <section class="console-shell">
      <nav class="operation-rail" aria-label="Operation selector">
        <p>Operations</p>
        <button
          v-for="operation in operations"
          :key="operation.id"
          type="button"
          :class="['operation-button', { active: selectedOperationId === operation.id }]"
          @click="loadOperation(operation.id)"
        >
          <span>{{ operation.family }}</span>
          <strong>{{ operation.label }}</strong>
        </button>
      </nav>

      <main class="workbench">
        <section class="tool-panel">
          <div class="panel-title">
            <div>
              <p class="eyebrow">Signature</p>
              <h3>Request calculator</h3>
            </div>
            <button type="button" class="ghost-button" @click="copy(authorizationHeader, 'authorization-top')">
              {{ copied === 'authorization-top' ? 'Copied' : 'Copy auth' }}
            </button>
          </div>

          <div class="field-row">
            <label>
              Serial number
              <input v-model="terminalSn" spellcheck="false" />
            </label>
            <label>
              Signing key
              <input v-model="signingKey" spellcheck="false" />
            </label>
          </div>
          <label>
            Raw JSON body
            <textarea v-model="rawBody" spellcheck="false" rows="9" />
          </label>

          <div class="output-row">
            <article>
              <span>MD5</span>
              <code>{{ signature }}</code>
              <button type="button" @click="copy(signature, 'signature')">
                {{ copied === 'signature' ? 'Copied' : 'Copy' }}
              </button>
            </article>
            <article>
              <span>Authorization</span>
              <code>{{ authorizationHeader }}</code>
              <button type="button" @click="copy(authorizationHeader, 'authorization')">
                {{ copied === 'authorization' ? 'Copied' : 'Copy' }}
              </button>
            </article>
          </div>
        </section>

        <section class="tool-panel">
          <div class="panel-title">
            <div>
              <p class="eyebrow">Simulator</p>
              <h3>Mock response</h3>
            </div>
            <select v-model="selectedScenario" aria-label="Simulator scenario">
              <option v-for="scenario in scenarios" :key="scenario" :value="scenario">
                {{ scenario }}
              </option>
            </select>
          </div>

          <div class="request-line">
            <code>{{ requestUrl }}</code>
            <code>Authorization: {{ authorizationHeader }}</code>
          </div>
          <pre><code>{{ simulatedResponse }}</code></pre>
        </section>
      </main>

      <aside class="side-stack">
        <section class="tool-panel compact-panel">
          <div class="panel-title">
            <div>
              <p class="eyebrow">Webhook</p>
              <h3>Signature verifier</h3>
            </div>
            <button type="button" class="ghost-button" @click="useComputedWebhookSignature">Use computed</button>
          </div>

          <label>
            Notification serial number
            <input v-model="webhookSn" spellcheck="false" />
          </label>
          <label>
            Notification key
            <input v-model="webhookKey" spellcheck="false" />
          </label>
          <label>
            Raw notification body
            <textarea v-model="webhookBody" spellcheck="false" rows="5" />
          </label>
          <label>
            Received signature
            <input v-model="webhookSignature" spellcheck="false" />
          </label>

          <div :class="['verifier-status', webhookSignature ? (webhookMatches ? 'ok' : 'bad') : 'idle']">
            {{ webhookSignature ? (webhookMatches ? 'Signature matches' : 'Signature does not match') : 'Paste a signature to verify' }}
          </div>
        </section>

        <section class="tool-panel compact-panel examples-panel">
          <div class="panel-title">
            <div>
              <p class="eyebrow">Examples</p>
              <h3>Generated snippet</h3>
            </div>
            <button type="button" class="ghost-button" @click="copy(activeSnippet, `snippet-${selectedSnippetLanguage}`)">
              {{ copied === `snippet-${selectedSnippetLanguage}` ? 'Copied' : 'Copy' }}
            </button>
          </div>

          <div class="language-tabs" role="tablist" aria-label="Example language">
            <button
              v-for="language in snippetLanguages"
              :key="language.id"
              type="button"
              role="tab"
              :aria-selected="selectedSnippetLanguage === language.id"
              :class="{ active: selectedSnippetLanguage === language.id }"
              @click="selectSnippetLanguage(language.id)"
            >
              {{ language.label }}
            </button>
          </div>
          <pre class="snippet-code"><code :class="`language-${selectedSnippetLanguage}`" v-html="highlightedSnippet"></code></pre>
        </section>
      </aside>
    </section>
  </div>
</template>

<style scoped>
.developer-console {
  --console-border: color-mix(in srgb, var(--vp-c-divider) 82%, transparent);
  --console-surface: color-mix(in srgb, var(--vp-c-bg) 94%, var(--vp-c-bg-soft));
  --console-muted: color-mix(in srgb, var(--vp-c-bg-soft) 82%, var(--vp-c-bg));
  display: grid;
  width: 100%;
  margin-top: 28px;
  gap: 16px;
}

:global(.VPDoc:has(.developer-console) > .container) {
  max-width: none !important;
}

:global(.VPDoc:has(.developer-console) > .container > .content) {
  max-width: min(1160px, calc(100vw - var(--vp-sidebar-width, 0px) - 64px)) !important;
}

:global(.VPDoc:has(.developer-console) > .container > .content > .content-container) {
  max-width: none !important;
}

.eyebrow {
  margin: 0;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.console-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(250px, 340px);
  gap: 24px;
  align-items: end;
  min-width: 0;
  border: 1px solid var(--console-border);
  border-radius: 8px;
  padding: 22px 24px;
  background: linear-gradient(180deg, var(--console-muted), var(--vp-c-bg));
}

.console-header h2 {
  margin: 3px 0 6px;
  font-size: 28px;
  line-height: 1.15;
}

.console-header p:last-child {
  max-width: 680px;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.55;
}

.endpoint-card {
  display: grid;
  gap: 8px;
  min-width: 0;
  border: 1px solid var(--console-border);
  border-radius: 8px;
  padding: 14px;
  background: var(--vp-c-bg);
}

.endpoint-card span {
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.endpoint-card code {
  color: var(--vp-c-text-1);
  font-size: 13px;
}

.console-shell {
  display: grid;
  grid-template-columns: 172px minmax(430px, 1fr) minmax(300px, 340px);
  gap: 16px;
  align-items: start;
}

.operation-rail,
.workbench,
.side-stack {
  min-width: 0;
}

.operation-rail {
  position: sticky;
  top: 80px;
  display: grid;
  gap: 6px;
  border: 1px solid var(--console-border);
  border-radius: 8px;
  padding: 10px;
  background: var(--console-surface);
}

.operation-rail p {
  margin: 4px 6px 8px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.operation-button {
  display: grid;
  gap: 2px;
  width: 100%;
  min-height: 54px;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 9px 10px;
  color: var(--vp-c-text-1);
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.operation-button span {
  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.operation-button strong {
  font-size: 14px;
  line-height: 1.2;
}

.operation-button:hover,
.operation-button.active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.workbench,
.side-stack {
  display: grid;
  gap: 16px;
}

.side-stack {
  position: sticky;
  top: 80px;
}

.tool-panel {
  min-width: 0;
  border: 1px solid var(--console-border);
  border-radius: 8px;
  padding: 18px;
  background: var(--console-surface);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.05);
}

.compact-panel {
  padding: 16px;
}

.panel-title {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
}

.panel-title h3 {
  margin: 2px 0 0;
  font-size: 18px;
  line-height: 1.25;
}

.field-row,
.output-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

label {
  display: grid;
  gap: 6px;
  margin: 12px 0;
  color: var(--vp-c-text-1);
  font-weight: 700;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid var(--console-border);
  border-radius: 6px;
  padding: 9px 10px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font: 13px/1.5 var(--vp-font-family-mono);
}

textarea {
  resize: vertical;
  min-height: 108px;
}

button {
  border: 1px solid var(--console-border);
  border-radius: 6px;
  padding: 7px 10px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  cursor: pointer;
  font-weight: 700;
  white-space: nowrap;
}

button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.ghost-button {
  background: var(--vp-c-bg);
}

.output-row > article {
  min-width: 0;
  border: 1px solid var(--console-border);
  border-radius: 8px;
  padding: 12px;
  background: var(--vp-c-bg);
}

.output-row span {
  display: block;
  margin-bottom: 8px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.output-row button {
  margin-top: 10px;
}

code {
  color: var(--vp-c-text-1);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

pre {
  max-height: 420px;
  overflow: auto;
  border-radius: 8px;
  margin: 0;
  padding: 14px;
  background: var(--vp-code-block-bg);
  font-size: 12px;
  line-height: 1.55;
}

pre code {
  display: block;
  min-width: max-content;
  white-space: pre;
  overflow-wrap: normal;
}

.request-line {
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
}

.request-line code {
  border: 1px solid var(--console-border);
  border-radius: 6px;
  padding: 8px 10px;
  background: var(--vp-c-bg-soft);
  font-size: 12px;
}

.verifier-status {
  border-radius: 6px;
  padding: 10px 12px;
  font-weight: 800;
}

.verifier-status.idle {
  background: var(--vp-c-default-soft);
}

.verifier-status.ok {
  color: var(--vp-c-green-3);
  background: var(--vp-c-green-soft);
}

.verifier-status.bad {
  color: var(--vp-c-red-3);
  background: var(--vp-c-red-soft);
}

.examples-panel pre {
  min-height: 300px;
  max-height: 360px;
}

.snippet-code {
  background: var(--vp-code-block-bg);
}

.snippet-code :deep(.token.keyword) {
  color: var(--vp-c-brand-1);
  font-weight: 700;
}

.snippet-code :deep(.token.string) {
  color: var(--vp-c-green-2);
}

.snippet-code :deep(.token.comment) {
  color: var(--vp-c-text-3);
  font-style: italic;
}

.language-tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  margin-bottom: 12px;
}

.language-tabs button {
  padding: 8px 6px;
}

.language-tabs button.active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

@media (max-width: 1120px) {
  .console-shell {
    grid-template-columns: 170px minmax(0, 1fr);
  }

  .side-stack {
    position: static;
    grid-column: 2;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .developer-console {
    width: 100%;
  }

  .console-header,
  .console-shell {
    grid-template-columns: 1fr;
  }

  .operation-rail {
    position: static;
    grid-auto-flow: column;
    grid-auto-columns: minmax(148px, 1fr);
    overflow-x: auto;
  }

  .operation-rail p {
    display: none;
  }

  .side-stack {
    grid-column: auto;
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .console-header,
  .tool-panel {
    padding: 14px;
  }

  .console-header h2 {
    font-size: 22px;
  }

  .panel-title,
  .field-row,
  .output-row {
    grid-template-columns: 1fr;
  }

  .panel-title {
    display: grid;
  }

  .language-tabs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
