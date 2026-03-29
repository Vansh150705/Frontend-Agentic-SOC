export const securityLogs = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  timestamp: new Date(Date.now() - i * 180000).toISOString().replace("T", " ").slice(0, 19),
  level: ["INFO", "WARN", "ERROR", "CRITICAL"][Math.floor(Math.random() * 4)],
  source: ["firewall-01", "ids-sensor-02", "auth-srv", "api-gateway", "vpn-concentrator", "endpoint-mgr"][Math.floor(Math.random() * 6)],
  event: [
    "Authentication failure for user admin@corp.com",
    "Firewall rule 487 triggered — blocked outbound traffic",
    "IDS signature match: ET SCAN Nmap SYN Scan",
    "SSL certificate expiry warning: 7 days remaining",
    "Successful login from new geo-location: Tokyo, JP",
    "DLP policy violation: PII data in email attachment",
    "VPN connection established from 203.0.113.45",
    "Privilege escalation attempt detected on auth-srv",
    "Antivirus definition update completed on 842 endpoints",
    "Critical patch MS23-047 applied to 156 hosts",
  ][Math.floor(Math.random() * 10)],
  userIp: `${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`,
}));
