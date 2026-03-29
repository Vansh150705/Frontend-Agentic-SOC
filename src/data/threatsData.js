export const threatTrendData = [
  { time: "00:00", critical: 2, high: 5, medium: 8 },
  { time: "02:00", critical: 1, high: 3, medium: 6 },
  { time: "04:00", critical: 0, high: 2, medium: 4 },
  { time: "06:00", critical: 3, high: 7, medium: 11 },
  { time: "08:00", critical: 5, high: 12, medium: 18 },
  { time: "10:00", critical: 8, high: 15, medium: 24 },
  { time: "12:00", critical: 6, high: 11, medium: 19 },
  { time: "14:00", critical: 9, high: 18, medium: 28 },
  { time: "16:00", critical: 7, high: 14, medium: 22 },
  { time: "18:00", critical: 4, high: 9, medium: 16 },
  { time: "20:00", critical: 3, high: 6, medium: 12 },
  { time: "22:00", critical: 2, high: 4, medium: 9 },
];

export const severityDist = [
  { name: "Critical", value: 8, color: "#dc2626" },
  { name: "High", value: 23, color: "#ea580c" },
  { name: "Medium", value: 41, color: "#ca8a04" },
  { name: "Low", value: 28, color: "#16a34a" },
];

export const liveThreats = [
  { id: 1, time: "14:35:22", sourceIp: "203.0.113.45", type: "SQL Injection", severity: "Critical", status: "Active", protocol: "HTTP", port: 80 },
  { id: 2, time: "14:34:58", sourceIp: "198.51.100.23", type: "XSS Attack", severity: "High", status: "Active", protocol: "HTTPS", port: 443 },
  { id: 3, time: "14:34:31", sourceIp: "192.0.2.178", type: "Brute Force", severity: "High", status: "Blocked", protocol: "SSH", port: 22 },
  { id: 4, time: "14:33:45", sourceIp: "203.0.113.89", type: "Data Exfiltration", severity: "Critical", status: "Active", protocol: "FTP", port: 21 },
  { id: 5, time: "14:33:12", sourceIp: "198.51.100.67", type: "Ransomware", severity: "Critical", status: "Contained", protocol: "SMB", port: 445 },
  { id: 6, time: "14:32:50", sourceIp: "192.0.2.34", type: "Port Scan", severity: "Medium", status: "Monitoring", protocol: "TCP", port: 8080 },
  { id: 7, time: "14:32:11", sourceIp: "203.0.113.156", type: "DNS Tunneling", severity: "High", status: "Active", protocol: "DNS", port: 53 },
  { id: 8, time: "14:31:44", sourceIp: "198.51.100.9", type: "MITM Attack", severity: "Critical", status: "Investigating", protocol: "ARP", port: 0 },
  { id: 9, time: "14:30:22", sourceIp: "192.0.2.211", type: "Credential Stuffing", severity: "Medium", status: "Blocked", protocol: "HTTPS", port: 443 },
  { id: 10, time: "14:29:55", sourceIp: "203.0.113.72", type: "Malware Beacon", severity: "High", status: "Active", protocol: "HTTP", port: 80 },
];
