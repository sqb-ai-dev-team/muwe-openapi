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
</script>

<template>
  <div class="developer-console">
    <section class="console-hero">
      <div>
        <p class="eyebrow">Browser-only sandbox</p>
        <h2>Sign, verify, simulate, and copy one clean integration example.</h2>
      </div>
      <div class="hero-stat">
        <strong>{{ operations.length }}</strong>
        <span>mocked operations</span>
      </div>
    </section>

    <section class="operation-strip" aria-label="Operation selector">
      <button
        v-for="operation in operations"
        :key="operation.id"
        type="button"
        :class="['operation-pill', { active: selectedOperationId === operation.id }]"
        @click="loadOperation(operation.id)"
      >
        <span>{{ operation.family }}</span>
        {{ operation.label }}
      </button>
    </section>

    <section class="workspace">
      <div class="primary-column">
        <section class="console-panel signature-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Signature</p>
              <h3>Request calculator</h3>
            </div>
            <code>{{ selectedOperation.method }} {{ selectedOperation.path }}</code>
          </div>

          <div class="form-grid">
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
            <textarea v-model="rawBody" spellcheck="false" rows="8" />
          </label>

          <div class="result-grid">
            <div>
              <span>MD5</span>
              <code>{{ signature }}</code>
              <button type="button" @click="copy(signature, 'signature')">
                {{ copied === 'signature' ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <div>
              <span>Authorization</span>
              <code>{{ authorizationHeader }}</code>
              <button type="button" @click="copy(authorizationHeader, 'authorization')">
                {{ copied === 'authorization' ? 'Copied' : 'Copy' }}
              </button>
            </div>
          </div>
        </section>

        <section class="console-panel">
          <div class="panel-heading">
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

          <div class="request-summary">
            <code>{{ requestUrl }}</code>
            <code>Authorization: {{ authorizationHeader }}</code>
          </div>
          <pre><code>{{ simulatedResponse }}</code></pre>
        </section>
      </div>

      <aside class="secondary-column">
        <section class="console-panel">
          <div class="panel-heading compact">
            <div>
              <p class="eyebrow">Webhook</p>
              <h3>Signature verifier</h3>
            </div>
            <button type="button" @click="useComputedWebhookSignature">Use computed</button>
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

        <section class="console-panel examples-panel">
          <div class="panel-heading compact">
            <div>
              <p class="eyebrow">Examples</p>
              <h3>Generated snippet</h3>
            </div>
            <button type="button" @click="copy(activeSnippet, `snippet-${selectedSnippetLanguage}`)">
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
              @click="selectedSnippetLanguage = language.id"
            >
              {{ language.label }}
            </button>
          </div>
          <pre><code>{{ activeSnippet }}</code></pre>
        </section>
      </aside>
    </section>
  </div>
</template>

<style scoped>
.developer-console {
  display: grid;
  gap: 18px;
  margin-top: 24px;
}

.console-hero {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 22px;
  background:
    linear-gradient(135deg, rgba(22, 163, 74, 0.12), transparent 42%),
    var(--vp-c-bg-soft);
}

.console-hero h2 {
  max-width: 760px;
  margin: 4px 0 0;
  font-size: 26px;
  line-height: 1.2;
}

.eyebrow {
  margin: 0;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.hero-stat {
  display: grid;
  align-content: center;
  min-width: 132px;
  border-left: 1px solid var(--vp-c-divider);
  padding-left: 20px;
}

.hero-stat strong {
  font-size: 34px;
  line-height: 1;
}

.hero-stat span {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.operation-strip {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.operation-pill {
  display: grid;
  gap: 2px;
  min-width: 132px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  text-align: left;
}

.operation-pill span {
  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.operation-pill.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.workspace {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(340px, 0.85fr);
  gap: 18px;
  align-items: start;
}

.primary-column,
.secondary-column {
  display: grid;
  gap: 18px;
  min-width: 0;
}

.console-panel {
  min-width: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 18px;
  background: var(--vp-c-bg);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.signature-panel {
  background: var(--vp-c-bg-soft);
}

.panel-heading {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
}

.panel-heading.compact {
  align-items: center;
}

.panel-heading h3 {
  margin: 2px 0 0;
  font-size: 18px;
  line-height: 1.25;
}

.panel-heading > code {
  max-width: 48%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 7px 9px;
  background: var(--vp-c-bg);
}

.form-grid,
.result-grid {
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
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 9px 10px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font: 13px/1.5 var(--vp-font-family-mono);
}

textarea {
  resize: vertical;
}

button {
  border: 1px solid var(--vp-c-divider);
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

.result-grid > div {
  min-width: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
  background: var(--vp-c-bg);
}

.result-grid span {
  display: block;
  margin-bottom: 8px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.result-grid button {
  margin-top: 10px;
}

code {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

pre {
  max-height: 430px;
  overflow: auto;
  border-radius: 8px;
  padding: 12px;
  background: var(--vp-code-block-bg);
}

.request-summary {
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
}

.request-summary code {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 8px 10px;
  background: var(--vp-c-bg-soft);
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
  min-height: 320px;
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

@media (max-width: 960px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .console-hero,
  .panel-heading {
    display: grid;
  }

  .hero-stat {
    border-left: 0;
    border-top: 1px solid var(--vp-c-divider);
    padding: 14px 0 0;
  }

  .console-panel,
  .console-hero {
    padding: 14px;
  }

  .console-hero h2 {
    font-size: 22px;
  }

  .form-grid,
  .result-grid {
    grid-template-columns: 1fr;
  }

  .panel-heading > code {
    max-width: 100%;
  }
}
</style>
