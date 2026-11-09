# Clash 规则库升级说明

> 目录：`H:\\软路由\\网络维护\\Clash-规则`  
> 上次升级：2026-10-18  
> 上游主源：[ACL4SSR/ACL4SSR](https://github.com/ACL4SSR/ACL4SSR)

## 目标

本目录 TXT 供 GitHub `wusenyu168/Clash` 托管，OpenClash `rule-providers` 通过
`cdn.jsdelivr.net/gh/wusenyu168/Clash@main/xxx.txt` 或 raw 拉取。

## 格式约定（务必遵守）

| 文件 | behavior（yaml） | payload 内容 |
|------|------------------|--------------|
| 绝大多数 `*.txt` | `classical` | `DOMAIN*` / `IP-CIDR,x/y,no-resolve` |
| `ChinaIp.txt` | `ipcidr` | 纯 CIDR：`- '1.2.3.0/24'`（禁止 classical） |
| `LocalAreaNetwork.txt` | `classical` | **禁止**含 `198.18.0.0/16`（会与 fake-ip 冲突） |
| `AppelePay.txt` | `classical` | DOMAIN-KEYWORD 规则（不是 domain 列表） |
| `HKKuaisu` | `classical` | 无后缀文件名，保持与 yaml 一致 |

## 如何再次升级（推荐流程）

1. 在本目录运行（脚本已随规则库一并上传）：
   ```bat
   cd /d H:\软路由\网络维护\Clash-规则
   node upgrade_rules.mjs
   ```
   （需已安装 Node.js；也可把本目录放到任意路径后执行 `node upgrade_rules.mjs`）
2. 脚本会：
   - 从 ACL4SSR（优先 jsDelivr）下载对应 `.list`
   - 与本地已有规则 **去重合并**（不会丢你手工加的域名）
   - 强制合并 `LOCAL_EXTRAS`（Cursor / Apple Pay / 代理 IP 池等）
   - 去掉 LAN 中的 198.18
   - 重写文件头 `# updated / # count`
   - 刷新本文件 `UPGRADE.md` 中的「本次升级摘要」
3. 抽查 `OpenAi.txt` / `YouTube.txt` / `ChinaIp.txt` 行数与格式
4. 提交并推送到 GitHub `wusenyu168/Clash`（或你的 fork）
5. OpenClash 清规则缓存后「更新规则集」

若要**永久增加**自定义域名：编辑 `upgrade_rules.mjs` 里的 `LOCAL_EXTRAS`，再跑脚本。  
若要**永久剔除**上游误规则：编辑 `LOCAL_REMOVALS`（如 gstatic 误直连、Blockchain 过宽关键字）。

## 文件 ↔ 上游映射

- `UnBan.txt` ← `Clash/UnBan.list`
- `BanAD.txt` ← `Clash/BanAD.list`
- `BanProgramAD.txt` ← `Clash/BanProgramAD.list`
- `GoogleFCM.txt` ← `Clash/Ruleset/GoogleFCM.list`
- `GoogleCN.txt` ← `Clash/GoogleCN.list` + `Clash/Ruleset/GoogleCN.list`
- `SteamCN.txt` ← `Clash/Ruleset/SteamCN.list`
- `Bing.txt` ← `Clash/Bing.list` + `Clash/Ruleset/Bing.list`
- `OneDrive.txt` ← `Clash/OneDrive.list`
- `Microsoft.txt` ← `Clash/Microsoft.list` + `Clash/Ruleset/Microsoft.list`
- `Apple.txt` ← `Clash/Apple.list` + `Clash/Ruleset/Apple.list`
- `Telegram.txt` ← `Clash/Telegram.list`
- `OpenAi.txt` ← `Clash/Ruleset/OpenAi.list` + `Clash/Ruleset/AI.list` + `Clash/Ruleset/Claude.list` + `Clash/Ruleset/ClaudeAI.list` + `Clash/Ruleset/Gemini.list`
- `NetEaseMusic.txt` ← `Clash/Ruleset/NetEaseMusic.list`
- `Epic.txt` ← `Clash/Ruleset/Epic.list`
- `Origin.txt` ← `Clash/Ruleset/Origin.list`
- `Sony.txt` ← `Clash/Ruleset/Sony.list`
- `Steam.txt` ← `Clash/Ruleset/Steam.list`
- `Nintendo.txt` ← `Clash/Ruleset/Nintendo.list`
- `YouTube.txt` ← `Clash/Ruleset/YouTube.list`
- `Netflix.txt` ← `Clash/Ruleset/Netflix.list`
- `Bahamut.txt` ← `Clash/Ruleset/Bahamut.list`
- `BilibiliHMT.txt` ← `Clash/Ruleset/BilibiliHMT.list`
- `Bilibili.txt` ← `Clash/Ruleset/Bilibili.list`
- `ChinaMedia.txt` ← `Clash/ChinaMedia.list`
- `ProxyMedia.txt` ← `Clash/ProxyMedia.list`
- `ProxyGFWlist.txt` ← `Clash/ProxyGFWlist.list`
- `ChinaDomain.txt` ← `Clash/ChinaDomain.list`
- `ChinaCompanyIp.txt` ← `Clash/ChinaCompanyIp.list`
- `Download.txt` ← `Clash/Download.list`
- `GoogleCNProxyIP.txt` ← `Clash/Ruleset/GoogleCNProxyIP.list`
- `ChinaIp.txt` ← `Clash/ChinaIp.list`
- `LocalAreaNetwork.txt` ← `Clash/LocalAreaNetwork.list`
- `Blockchain.txt` ← `Clash/Ruleset/Crypto.list` + `Clash/Ruleset/Binance.list`
- `ExclusivetotheAPP.txt` ← `Clash/Ruleset/Facebook.list` + `Clash/Ruleset/Instagram.list`

## 本地专属（不会被上游覆盖删除）

- `AppelePay.txt` / `HKKuaisu` / `Transfer.txt` / `Card2D.txt`
- `OpenAi.txt` 额外：cursor / copilot / grok / perplexity / deepseek
- `ExclusivetotheAPP.txt`：在 Facebook+Instagram 上游之上保留你原来的 APP 域名

## 本次升级摘要

| 文件 | 升级前 | 升级后 | Δ |
|------|--------|--------|---|
| UnBan.txt | 18 | 31 | +13 |
| BanAD.txt | 589 | 589 | +0 |
| BanProgramAD.txt | 1023 | 1017 | -6 |
| GoogleFCM.txt | 35 | 44 | +9 |
| GoogleCN.txt | 29 | 48 | +19 |
| SteamCN.txt | 16 | 16 | +0 |
| Bing.txt | 3 | 3 | +0 |
| OneDrive.txt | 16 | 17 | +1 |
| Microsoft.txt | 79 | 79 | +0 |
| Apple.txt | 34 | 35 | +1 |
| Telegram.txt | 13 | 13 | +0 |
| OpenAi.txt | 68 | 105 | +37 |
| NetEaseMusic.txt | 37 | 37 | +0 |
| Epic.txt | 37 | 43 | +6 |
| Origin.txt | 7 | 7 | +0 |
| Sony.txt | 5 | 5 | +0 |
| Steam.txt | 18 | 18 | +0 |
| Nintendo.txt | 15 | 15 | +0 |
| YouTube.txt | 16 | 16 | +0 |
| Netflix.txt | 40 | 40 | +0 |
| Bahamut.txt | 5 | 5 | +0 |
| BilibiliHMT.txt | 21 | 21 | +0 |
| Bilibili.txt | 21 | 37 | +16 |
| ChinaMedia.txt | 49 | 49 | +0 |
| ProxyMedia.txt | 365 | 359 | -6 |
| ProxyGFWlist.txt | 6908 | 6991 | +83 |
| ChinaDomain.txt | 609 | 635 | +26 |
| ChinaCompanyIp.txt | 208 | 208 | +0 |
| Download.txt | 16 | 23 | +7 |
| GoogleCNProxyIP.txt | 18 | 18 | +0 |
| ChinaIp.txt | 7456 | 7456 | +0 |
| LocalAreaNetwork.txt | 36 | 36 | +0 |
| Blockchain.txt | 50 | 299 | +249 |
| ExclusivetotheAPP.txt | 11 | 34 | +23 |
| AppelePay.txt | 11 | 14 | +3 |
| HKKuaisu | 4 | 4 | +0 |
| Transfer.txt | 3 | 5 | +2 |
| Card2D.txt | 2 | 4 | +2 |

### 拉取失败（保留本地旧内容或仅 extras）

_无_

## 与 `通用2.0.yaml` 对齐检查清单

- [ ] `ChinaIp` → `behavior: ipcidr`
- [ ] `AppelePay` → `behavior: classical`
- [ ] `LocalAreaNetwork` 内联或不含 198.18
- [ ] 关键集优先 `cdn.jsdelivr.net/gh/...`（路由器访问 raw.githubusercontent 易 404）

## 版本记录

| 日期 | 说明 |
|------|------|
| 2026-10-25 | Gemini 图标：GoogleCN 去 gstatic/googleapis/dl/tools 误直连；Blockchain 去过宽 keyword；OpenAi 去 bing/discord；Transfer/ChinaMedia 收紧；yaml 内联 Gemini 优先于 googleapis 通配；`LOCAL_REMOVALS` 防升级回滚 |
| 2026-10-18 | 全量对齐 ACL4SSR；ChinaIp=ipcidr；LAN 去 198.18；OpenAi 合并 AI/Claude/Gemini；文档化 |
