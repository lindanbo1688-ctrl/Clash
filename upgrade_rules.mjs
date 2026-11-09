/**
 * Upgrade H:\软路由\网络维护\Clash-规则 from ACL4SSR upstream + keep local customs.
 * Re-run anytime; see UPGRADE.md in the rules dir after first run.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const LOG = path.join(DIR, ".upgrade-last.jsonl");
const BASES = [
  "https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/",
  "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/",
];

const map = {
  // localFile -> [upstream relative paths under ACL4SSR] (merged in order)
  "UnBan.txt": ["Clash/UnBan.list"],
  "BanAD.txt": ["Clash/BanAD.list"],
  "BanProgramAD.txt": ["Clash/BanProgramAD.list"],
  "GoogleFCM.txt": ["Clash/Ruleset/GoogleFCM.list"],
  "GoogleCN.txt": ["Clash/GoogleCN.list", "Clash/Ruleset/GoogleCN.list"],
  "SteamCN.txt": ["Clash/Ruleset/SteamCN.list"],
  "Bing.txt": ["Clash/Bing.list", "Clash/Ruleset/Bing.list"],
  "OneDrive.txt": ["Clash/OneDrive.list"],
  "Microsoft.txt": ["Clash/Microsoft.list", "Clash/Ruleset/Microsoft.list"],
  "Apple.txt": ["Clash/Apple.list", "Clash/Ruleset/Apple.list"],
  "Telegram.txt": ["Clash/Telegram.list"],
  "OpenAi.txt": [
    "Clash/Ruleset/OpenAi.list",
    "Clash/Ruleset/AI.list",
    "Clash/Ruleset/Claude.list",
    "Clash/Ruleset/ClaudeAI.list",
    "Clash/Ruleset/Gemini.list",
  ],
  "NetEaseMusic.txt": ["Clash/Ruleset/NetEaseMusic.list"],
  "Epic.txt": ["Clash/Ruleset/Epic.list"],
  "Origin.txt": ["Clash/Ruleset/Origin.list"],
  "Sony.txt": ["Clash/Ruleset/Sony.list"],
  "Steam.txt": ["Clash/Ruleset/Steam.list"],
  "Nintendo.txt": ["Clash/Ruleset/Nintendo.list"],
  "YouTube.txt": ["Clash/Ruleset/YouTube.list"],
  "Netflix.txt": ["Clash/Ruleset/Netflix.list"],
  "Bahamut.txt": ["Clash/Ruleset/Bahamut.list"],
  "BilibiliHMT.txt": ["Clash/Ruleset/BilibiliHMT.list"],
  "Bilibili.txt": ["Clash/Ruleset/Bilibili.list"],
  "ChinaMedia.txt": ["Clash/ChinaMedia.list"],
  "ProxyMedia.txt": ["Clash/ProxyMedia.list"],
  "ProxyGFWlist.txt": ["Clash/ProxyGFWlist.list"],
  "ChinaDomain.txt": ["Clash/ChinaDomain.list"],
  "ChinaCompanyIp.txt": ["Clash/ChinaCompanyIp.list"],
  "Download.txt": ["Clash/Download.list"],
  "GoogleCNProxyIP.txt": ["Clash/Ruleset/GoogleCNProxyIP.list"],
  "ChinaIp.txt": ["Clash/ChinaIp.list"],
  "LocalAreaNetwork.txt": ["Clash/LocalAreaNetwork.list"],
  "Blockchain.txt": ["Clash/Ruleset/Crypto.list", "Clash/Ruleset/Binance.list"],
  "ExclusivetotheAPP.txt": [
    "Clash/Ruleset/Facebook.list",
    "Clash/Ruleset/Instagram.list",
  ],
};

/** Extra rules always kept/merged (local customs not in ACL4SSR) */
// 升级时强制剔除（上游 ACL4SSR 仍可能带回；本地实测会误伤）
const LOCAL_REMOVALS = {
  "GoogleCN.txt": [
    "DOMAIN-SUFFIX,www.gstatic.com",
    "DOMAIN-SUFFIX,ssl.gstatic.com",
    "DOMAIN-SUFFIX,fonts.gstatic.com",
    "DOMAIN-SUFFIX,g0.gstatic.com",
    "DOMAIN-SUFFIX,g1.gstatic.com",
    "DOMAIN-SUFFIX,g2.gstatic.com",
    "DOMAIN-SUFFIX,fonts.googleapis.com",
    "DOMAIN-SUFFIX,recaptcha.net",
    "DOMAIN-SUFFIX,checkin.gstatic.com",
    "DOMAIN-SUFFIX,connectivitycheck.gstatic.com",
    "DOMAIN-SUFFIX,csi.gstatic.com",
    "DOMAIN-SUFFIX,clientservices.googleapis.com",
    "DOMAIN-SUFFIX,imasdk.googleapis.com",
    "DOMAIN-SUFFIX,update.googleapis.com",
    "DOMAIN-SUFFIX,safebrowsing.googleapis.com",
    "DOMAIN-SUFFIX,dl.google.com",
    "DOMAIN-SUFFIX,dl.l.google.com",
    "DOMAIN-SUFFIX,tools.google.com",
    "DOMAIN-SUFFIX,tools.l.google.com",
  ],
  "UnBan.txt": ["DOMAIN,dl.google.com"],
  "ChinaMedia.txt": ["DOMAIN-KEYWORD,fun"],
  "Transfer.txt": ["DOMAIN-KEYWORD,transfer"],
  "Blockchain.txt": [
    "DOMAIN-KEYWORD,gemini",
    "DOMAIN-KEYWORD,crypto",
    "DOMAIN-KEYWORD,zb",
    "DOMAIN-KEYWORD,cex",
    "DOMAIN-KEYWORD,liquid",
    "DOMAIN-KEYWORD,exmo",
    "DOMAIN-KEYWORD,bitz",
  ],
  "OpenAi.txt": [
    "DOMAIN-SUFFIX,bing.com",
    "DOMAIN-SUFFIX,discord.com",
    "DOMAIN-SUFFIX,cdn.discordapp.com",
  ],
};

const LOCAL_EXTRAS = {
  "OpenAi.txt": [
    "DOMAIN-KEYWORD,cursor",
    "DOMAIN-SUFFIX,cursor.sh",
    "DOMAIN-SUFFIX,cursorapi.com",
    "DOMAIN-KEYWORD,copilot",
    "DOMAIN-SUFFIX,githubcopilot.com",
    "DOMAIN-KEYWORD,grok",
    "DOMAIN-SUFFIX,x.ai",
    "DOMAIN-SUFFIX,grok.com",
    "DOMAIN-KEYWORD,perplexity",
    "DOMAIN-SUFFIX,perplexity.ai",
    "DOMAIN-KEYWORD,deepseek",
    "DOMAIN-SUFFIX,deepseek.com",
    "DOMAIN-KEYWORD,gemini",
    "DOMAIN-SUFFIX,gemini.google.com",
    "DOMAIN,aistudio.google.com",
    "DOMAIN,bard.google.com",
    "DOMAIN,generativelanguage.googleapis.com",
    "DOMAIN-SUFFIX,notebooklm.google.com",
  ],
  "AppelePay.txt": [
    "DOMAIN-KEYWORD,time.apple",
    "DOMAIN-KEYWORD,securemetrics.apple",
    "DOMAIN-KEYWORD,ocsp2.apple",
    "DOMAIN-KEYWORD,ess.apple",
    "DOMAIN-KEYWORD,mastercard",
    "DOMAIN-KEYWORD,apay.apple",
    "DOMAIN-KEYWORD,device.apple",
    "DOMAIN-KEYWORD,fds.apple",
    "DOMAIN-KEYWORD,gsa.apple",
    "DOMAIN-KEYWORD,gsas.apple",
    "DOMAIN-KEYWORD,wps.apple.com",
    "DOMAIN-KEYWORD,apple-pay",
    "DOMAIN-SUFFIX,apple-pay.com",
    "DOMAIN-SUFFIX,applepay.cdn-apple.com",
  ],
  "HKKuaisu": [
    "DOMAIN-KEYWORD,ipfoxy",
    "DOMAIN-KEYWORD,kookeey",
    "DOMAIN-KEYWORD,ip2world",
    "DOMAIN-SUFFIX,gate-sg.ipfoxy.io",
  ],
  "Transfer.txt": [
    "DOMAIN-SUFFIX,transfer.sh",
  ],
  "ChinaMedia.txt": [
    "DOMAIN-SUFFIX,fun.tv",
    "DOMAIN-SUFFIX,funshion.com",
  ],
  "Card2D.txt": [
    "DOMAIN-KEYWORD,card2d",
    "DOMAIN-SUFFIX,card2d.com",
  ],
};

async function fetchText(rel) {
  let lastErr;
  for (const b of BASES) {
    const url = b + rel;
    try {
      const r = await fetch(url, {
        headers: { "User-Agent": "clash-rules-upgrade/1.0" },
        signal: AbortSignal.timeout(60000),
      });
      if (r.ok) return { ok: true, url, text: await r.text() };
      lastErr = `${r.status} ${url}`;
    } catch (e) {
      lastErr = `${e.message} ${url}`;
    }
  }
  return { ok: false, error: lastErr };
}

function parseListLines(text) {
  const rules = [];
  for (const raw of text.split(/\r?\n/)) {
    let line = raw.trim();
    if (!line || line.startsWith("#") || line.startsWith(";")) continue;
    // strip payload yaml style if any
    line = line.replace(/^-\s*/, "").replace(/^['"]|['"]$/g, "");
    if (!line || line === "payload:") continue;
    rules.push(line);
  }
  return rules;
}

function parseLocalPayload(text) {
  return parseListLines(text);
}

function normalizeRule(r) {
  return r.replace(/\s+/g, "").toUpperCase();
}

function mergeRules(...sets) {
  const seen = new Set();
  const out = [];
  for (const set of sets) {
    for (const r of set) {
      const k = normalizeRule(r);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(r);
    }
  }
  return out;
}

function writeClassical(file, rules, meta) {
  const header =
    `payload:\n` +
    `  # source: ACL4SSR (+ local customs)\n` +
    `  # updated: ${meta.date}\n` +
    `  # count: ${rules.length}\n` +
    (meta.note ? `  # note: ${meta.note}\n` : "") +
    `\n`;
  const body = rules.map((r) => `  - ${r}`).join("\n") + "\n";
  fs.writeFileSync(path.join(DIR, file), header + body, "utf8");
}

function writeIpcidr(file, rules, meta) {
  // extract CIDRs from IP-CIDR,x/y[,no-resolve] or bare
  const cidrs = [];
  const seen = new Set();
  for (const r of rules) {
    let m = r.match(/IP-CIDR6?,([^,\s]+)/i);
    let c = m ? m[1] : null;
    if (!c && /^\d+\.\d+\.\d+\.\d+\/\d+$/.test(r)) c = r;
    if (!c && /^[0-9a-f:]+\/\d+$/i.test(r)) c = r;
    if (!c) continue;
    if (seen.has(c)) continue;
    seen.add(c);
    cidrs.push(c);
  }
  const header =
    `payload:\n` +
    `  # behavior: ipcidr（勿改 classical）\n` +
    `  # source: ACL4SSR ChinaIp / 17mon\n` +
    `  # updated: ${meta.date}\n` +
    `  # count: ${cidrs.length}\n\n`;
  const body = cidrs.map((c) => `  - '${c}'`).join("\n") + "\n";
  fs.writeFileSync(path.join(DIR, file), header + body, "utf8");
  return cidrs.length;
}

function stripFakeIpLan(rules) {
  return rules.filter((r) => !/198\.18\.0\.0\/16/i.test(r));
}

const date = new Date().toISOString().slice(0, 10);
const report = { date, files: [], errors: [], skipped: [] };

async function upgradeOne(file, rels) {
  const localPath = path.join(DIR, file);
  const localRules = fs.existsSync(localPath)
    ? parseLocalPayload(fs.readFileSync(localPath, "utf8"))
    : [];

  const upstreamAll = [];
  const sources = [];
  for (const rel of rels) {
    const res = await fetchText(rel);
    if (!res.ok) {
      report.errors.push({ file, rel, error: res.error });
      continue;
    }
    sources.push(res.url);
    upstreamAll.push(...parseListLines(res.text));
  }

  if (upstreamAll.length === 0 && !LOCAL_EXTRAS[file]) {
    report.skipped.push({ file, reason: "no upstream fetched" });
    return;
  }

  let extras = LOCAL_EXTRAS[file] || [];
  let merged = mergeRules(upstreamAll, localRules, extras);

  const removals = new Set(
    (LOCAL_REMOVALS[file] || []).map((r) => normalizeRule(r))
  );
  if (removals.size) {
    merged = merged.filter((r) => !removals.has(normalizeRule(r)));
  }

  if (file === "LocalAreaNetwork.txt") {
    merged = stripFakeIpLan(merged);
    // ensure critical LAN pieces
    merged = mergeRules(merged, [
      "DOMAIN-SUFFIX,internal",
      "IP-CIDR,169.254.0.0/16,no-resolve",
    ]);
  }

  const before = localRules.length;
  if (file === "ChinaIp.txt") {
    const n = writeIpcidr(file, merged, { date });
    report.files.push({
      file,
      before,
      after: n,
      delta: n - before,
      format: "ipcidr",
      sources,
    });
  } else {
    writeClassical(file, merged, {
      date,
      note: sources.length ? "merged upstream+local" : "local/extras only",
    });
    report.files.push({
      file,
      before,
      after: merged.length,
      delta: merged.length - before,
      format: "classical",
      sources,
    });
  }
}

// customs-only files
async function writeCustomsOnly() {
  for (const [file, rules] of Object.entries(LOCAL_EXTRAS)) {
    if (map[file]) continue; // already handled in map merge
    const localPath = path.join(DIR, file);
    const localRules = fs.existsSync(localPath)
      ? parseLocalPayload(fs.readFileSync(localPath, "utf8"))
      : [];
    let merged = mergeRules(rules, localRules);
    const removals = new Set(
      (LOCAL_REMOVALS[file] || []).map((r) => normalizeRule(r))
    );
    if (removals.size) {
      merged = merged.filter((r) => !removals.has(normalizeRule(r)));
    }
    const outName = file === "HKKuaisu" ? "HKKuaisu" : file;
    writeClassical(outName, merged, { date, note: "local custom" });
    report.files.push({
      file: outName,
      before: localRules.length,
      after: merged.length,
      delta: merged.length - localRules.length,
      format: "classical-custom",
      sources: [],
    });
  }
}

for (const [file, rels] of Object.entries(map)) {
  process.stdout.write(`Updating ${file}...\n`);
  await upgradeOne(file, rels);
}
await writeCustomsOnly();

// UPGRADE.md
const md = `# Clash 规则库升级说明

> 目录：\`H:\\\\软路由\\\\网络维护\\\\Clash-规则\`  
> 上次升级：${date}  
> 上游主源：[ACL4SSR/ACL4SSR](https://github.com/ACL4SSR/ACL4SSR)

## 目标

本目录 TXT 供 GitHub \`wusenyu168/Clash\` 托管，OpenClash \`rule-providers\` 通过
\`cdn.jsdelivr.net/gh/wusenyu168/Clash@main/xxx.txt\` 或 raw 拉取。

## 格式约定（务必遵守）

| 文件 | behavior（yaml） | payload 内容 |
|------|------------------|--------------|
| 绝大多数 \`*.txt\` | \`classical\` | \`DOMAIN*\` / \`IP-CIDR,x/y,no-resolve\` |
| \`ChinaIp.txt\` | \`ipcidr\` | 纯 CIDR：\`- '1.2.3.0/24'\`（禁止 classical） |
| \`LocalAreaNetwork.txt\` | \`classical\` | **禁止**含 \`198.18.0.0/16\`（会与 fake-ip 冲突） |
| \`AppelePay.txt\` | \`classical\` | DOMAIN-KEYWORD 规则（不是 domain 列表） |
| \`HKKuaisu\` | \`classical\` | 无后缀文件名，保持与 yaml 一致 |

## 如何再次升级（推荐流程）

1. 在本机运行升级脚本（仓库内）：
   \`\`\`bat
   node h:\\源码\\s-ui-main\\s-ui-main\\_upgrade_clash_rules.mjs
   \`\`\`
2. 脚本会：
   - 从 ACL4SSR（优先 jsDelivr）下载对应 \`.list\`
   - 与本地已有规则 **去重合并**（不会丢你手工加的域名）
   - 强制合并 \`LOCAL_EXTRAS\`（Cursor / Apple Pay / 代理 IP 池等）
   - 去掉 LAN 中的 198.18
   - 重写文件头 \`# updated / # count\`
3. 抽查 \`OpenAi.txt\` / \`YouTube.txt\` / \`ChinaIp.txt\` 行数与格式
4. 提交并推送到 GitHub \`wusenyu168/Clash\`（或你的 fork）
5. OpenClash 清规则缓存后「更新规则集」

## 文件 ↔ 上游映射

${Object.entries(map)
  .map(([f, rels]) => `- \`${f}\` ← ${rels.map((r) => `\`${r}\``).join(" + ")}`)
  .join("\n")}

## 本地专属（不会被上游覆盖删除）

- \`AppelePay.txt\` / \`HKKuaisu\` / \`Transfer.txt\` / \`Card2D.txt\`
- \`OpenAi.txt\` 额外：cursor / copilot / grok / perplexity / deepseek
- \`ExclusivetotheAPP.txt\`：在 Facebook+Instagram 上游之上保留你原来的 APP 域名

## 本次升级摘要

| 文件 | 升级前 | 升级后 | Δ |
|------|--------|--------|---|
${report.files
  .map((f) => `| ${f.file} | ${f.before} | ${f.after} | ${f.delta >= 0 ? "+" : ""}${f.delta} |`)
  .join("\n")}

### 拉取失败（保留本地旧内容或仅 extras）

${
  report.errors.length
    ? report.errors.map((e) => `- ${e.file}: ${e.rel} → ${e.error}`).join("\n")
    : "_无_"
}

## 与 \`通用2.0.yaml\` 对齐检查清单

- [ ] \`ChinaIp\` → \`behavior: ipcidr\`
- [ ] \`AppelePay\` → \`behavior: classical\`
- [ ] \`LocalAreaNetwork\` 内联或不含 198.18
- [ ] 关键集优先 \`cdn.jsdelivr.net/gh/...\`（路由器访问 raw.githubusercontent 易 404）

## 版本记录

| 日期 | 说明 |
|------|------|
| ${date} | 全量对齐 ACL4SSR；ChinaIp=ipcidr；LAN 去 198.18；OpenAi 合并 AI/Claude/Gemini；文档化 |
`;

fs.writeFileSync(path.join(DIR, "UPGRADE.md"), md, "utf8");

fs.appendFileSync(
  LOG,
  JSON.stringify({
    sessionId: "2a7aab",
    runId: "upgrade-clash-rules",
    hypothesisId: "H8,H9",
    location: "Clash-规则",
    message: "Full ACL4SSR merge upgrade",
    data: {
      fileCount: report.files.length,
      errors: report.errors.length,
      topGrowth: report.files
        .slice()
        .sort((a, b) => b.delta - a.delta)
        .slice(0, 8),
    },
    timestamp: Date.now(),
  }) + "\n"
);

console.log(JSON.stringify(report, null, 2));
