<script setup lang="ts">
import { computed, ref } from 'vue';
import { baseUrl, contractExamples, mockResponse, type SimulatorScenario } from '../data/contractExamples';
import { md5 } from '../utils/md5';

const operations = contractExamples;
const scenarios: SimulatorScenario[] = [
  'SUCCESS',
  'IN_PROGRESS',
  'SIGN_ERROR',
  'PARAM_ERROR',
  'ORDER_NOT_FOUND',
  'DUPLICATE_REQUEST'
];

const selectedOperationId = ref(operations[0].id);
const selectedScenario = ref<SimulatorScenario>('SUCCESS');
const terminalSn = ref(operations[0].sn);
const signingKey = ref(operations[0].key);
const rawBody = ref(operations[0].rawBody);
const webhookSn = ref(operations[0].sn);
const webhookKey = ref(operations[0].key);
const webhookBody = ref(
  '{"sn":"7893259247405832","client_sn":"MEX202605220001","order_status":"PAID","total_amount":"1000","finish_time":"1779436800000"}'
);
const webhookSignature = ref('');
const copied = ref('');

const selectedOperation = computed(() => operations.find((item) => item.id === selectedOperationId.value) || operations[0]);
const signatureInput = computed(() => `${rawBody.value}${signingKey.value}`);
const signature = computed(() => md5(signatureInput.value));
const authorizationHeader = computed(() => `${terminalSn.value} ${signature.value}`);
const webhookComputedSignature = computed(() => md5(`${webhookBody.value}${webhookKey.value}`));
const webhookMatches = computed(() => webhookSignature.value.trim().toLowerCase() === webhookComputedSignature.value);
const simulatedResponse = computed(() => JSON.stringify(mockResponse(selectedScenario.value, rawBody.value), null, 2));

const snippets = computed(() => {
  const url = `${baseUrl}${selectedOperation.value.path}`;
  const escapedBody = rawBody.value.replace(/'/g, "'\\''");
  const nodeBody = JSON.stringify(rawBody.value);
  const javaBody = rawBody.value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const pythonBody = JSON.stringify(rawBody.value);

  return {
    curl: `curl -X POST '${url}' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: ${authorizationHeader.value}' \\
  -d '${escapedBody}'`,
    node: `import crypto from 'node:crypto';

const rawBody = ${nodeBody};
const key = '${signingKey.value}';
const sn = '${terminalSn.value}';
const sign = crypto.createHash('md5').update(rawBody + key, 'utf8').digest('hex');

const response = await fetch('${url}', {
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
  .uri(URI.create("${url}"))
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
    "${url}",
    headers={
        "Content-Type": "application/json",
        "Authorization": f"{sn} {sign}",
    },
    data=raw_body.encode("utf-8"),
)`
  };
});

function loadOperation(): void {
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
    <section class="console-panel">
      <div class="panel-heading">
        <div>
          <h2>Signature Calculator</h2>
          <p>MD5 is calculated over the exact raw UTF-8 JSON body plus the signing key.</p>
        </div>
        <select v-model="selectedOperationId" @change="loadOperation" aria-label="Example operation">
          <option v-for="operation in operations" :key="operation.id" :value="operation.id">
            {{ operation.label }}
          </option>
        </select>
      </div>

      <label>
        Serial number
        <input v-model="terminalSn" spellcheck="false" />
      </label>
      <label>
        Signing key
        <input v-model="signingKey" spellcheck="false" />
      </label>
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
          <h2>Webhook Signature Verifier</h2>
          <p>The secret stays in this browser session. The verifier compares the received signature with MD5(raw body + key).</p>
        </div>
        <button type="button" @click="useComputedWebhookSignature">Use computed signature</button>
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
        <textarea v-model="webhookBody" spellcheck="false" rows="6" />
      </label>
      <label>
        Received signature
        <input v-model="webhookSignature" spellcheck="false" />
      </label>

      <div :class="['verifier-status', webhookSignature ? (webhookMatches ? 'ok' : 'bad') : 'idle']">
        {{ webhookSignature ? (webhookMatches ? 'Signature matches' : 'Signature does not match') : 'Paste a received signature to verify' }}
      </div>
    </section>

    <section class="console-panel">
      <div class="panel-heading">
        <div>
          <h2>Request Simulator</h2>
          <p>Mock responses use the Phase 1 contract examples and selectable failure modes.</p>
        </div>
        <select v-model="selectedScenario" aria-label="Simulator scenario">
          <option v-for="scenario in scenarios" :key="scenario" :value="scenario">
            {{ scenario }}
          </option>
        </select>
      </div>

      <div class="request-summary">
        <code>POST {{ selectedOperation.path }}</code>
        <code>Authorization: {{ authorizationHeader }}</code>
      </div>
      <pre><code>{{ simulatedResponse }}</code></pre>
    </section>

    <section class="console-panel">
      <div class="panel-heading">
        <div>
          <h2>Generated Examples</h2>
          <p>Snippets are generated from the same operation, raw body, serial number, and key currently loaded above.</p>
        </div>
      </div>

      <div class="snippet-grid">
        <article v-for="(snippet, name) in snippets" :key="name">
          <div class="snippet-title">
            <strong>{{ name }}</strong>
            <button type="button" @click="copy(snippet, `snippet-${name}`)">
              {{ copied === `snippet-${name}` ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <pre><code>{{ snippet }}</code></pre>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.developer-console {
  display: grid;
  gap: 24px;
  margin-top: 24px;
}

.console-panel {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 20px;
  background: var(--vp-c-bg-soft);
}

.panel-heading {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.panel-heading h2 {
  margin: 0 0 4px;
  font-size: 20px;
}

.panel-heading p {
  margin: 0;
  color: var(--vp-c-text-2);
}

label {
  display: grid;
  gap: 6px;
  margin: 12px 0;
  font-weight: 600;
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
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 6px;
  padding: 7px 10px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  cursor: pointer;
  white-space: nowrap;
}

button:hover {
  background: var(--vp-c-brand-soft);
}

.result-grid,
.snippet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.result-grid > div,
.snippet-grid article {
  min-width: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 14px;
  background: var(--vp-c-bg);
}

.result-grid span,
.snippet-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
  color: var(--vp-c-text-2);
}

code {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

pre {
  max-height: 440px;
  overflow: auto;
  border-radius: 6px;
  padding: 12px;
  background: var(--vp-code-block-bg);
}

.request-summary {
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
}

.verifier-status {
  border-radius: 6px;
  padding: 10px 12px;
  font-weight: 700;
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

@media (max-width: 640px) {
  .console-panel {
    padding: 14px;
  }

  .panel-heading {
    display: grid;
  }
}
</style>
