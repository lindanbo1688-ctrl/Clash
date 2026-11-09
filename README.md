# Clash 规则碎片（classical / ipcidr）

供 OpenClash / Mihomo `rule-providers` 使用。

- **升级说明（必读）**：[UPGRADE.md](./UPGRADE.md)
- **一键对齐 ACL4SSR**：`node upgrade_rules.mjs`
- **上游**：https://github.com/ACL4SSR/ACL4SSR
- **注意**：`ChinaIp.txt` 必须配 `behavior: ipcidr`；`LocalAreaNetwork.txt` 不得含 `198.18.0.0/16`
