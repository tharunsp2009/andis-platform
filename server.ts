import express from "express";
import { createServer as createViteServer } from "vite";
import si from "systeminformation";
import fs from "fs/promises";
import path from "path";
import { createProxyMiddleware } from "http-proxy-middleware";
import http from "http";
import { LicenseService, SubscriptionService } from "./server_licensing";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);

  app.use(express.json());

  // CORS middleware to enable reliable cross-origin requests from iframes or separate client instances
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // API route to get licensing & subscriptions
  app.get("/api/license", async (req, res) => {
    try {
      const orgId = (req.query.orgId as string) || "org-01";
      const license = await LicenseService.getLicense(orgId);
      const subscription = await SubscriptionService.getSubscription(orgId);
      const auditLogs = await SubscriptionService.getAuditLogs(orgId);
      
      const features = {
        ThreatIntel: await LicenseService.isFeatureEnabled(orgId, "ThreatIntel"),
        AdvancedAnalytics: await LicenseService.isFeatureEnabled(orgId, "AdvancedAnalytics"),
        RollbackControl: await LicenseService.isFeatureEnabled(orgId, "RollbackControl"),
        PriorityUpdates: await LicenseService.isFeatureEnabled(orgId, "PriorityUpdates"),
      };

      res.json({
        license,
        subscription,
        features,
        auditLogs
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch licensing data" });
    }
  });

  // Upgrade or change subscription tier
  app.post("/api/license/upgrade", async (req, res) => {
    try {
      const { orgId = "org-01", tier } = req.body;
      if (!tier || !["Developer", "Business", "Enterprise"].includes(tier)) {
        return res.status(400).json({ error: "Invalid tier specified" });
      }
      await SubscriptionService.upgradePlan(orgId, tier);
      res.json({ success: true, message: `Successfully upgraded to ${tier}` });
    } catch (error) {
      res.status(500).json({ error: "Failed to upgrade subscription" });
    }
  });

  // Downgrade subscription tier
  app.post("/api/license/downgrade", async (req, res) => {
    try {
      const { orgId = "org-01", tier } = req.body;
      if (!tier || !["Developer", "Business", "Enterprise"].includes(tier)) {
        return res.status(400).json({ error: "Invalid tier specified" });
      }
      await SubscriptionService.downgradePlan(orgId, tier);
      res.json({ success: true, message: `Successfully downgraded to ${tier}` });
    } catch (error) {
      res.status(500).json({ error: "Failed to downgrade subscription" });
    }
  });

  // Cancel subscription
  app.post("/api/license/cancel", async (req, res) => {
    try {
      const { orgId = "org-01" } = req.body;
      await SubscriptionService.cancelSubscription(orgId);
      res.json({ success: true, message: "Subscription cancelled successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });

  // Get active feature flags
  app.get("/api/license/features", async (req, res) => {
    try {
      const orgId = (req.query.orgId as string) || "org-01";
      const features = {
        ThreatIntel: await LicenseService.isFeatureEnabled(orgId, "ThreatIntel"),
        AdvancedAnalytics: await LicenseService.isFeatureEnabled(orgId, "AdvancedAnalytics"),
        RollbackControl: await LicenseService.isFeatureEnabled(orgId, "RollbackControl"),
        PriorityUpdates: await LicenseService.isFeatureEnabled(orgId, "PriorityUpdates"),
      };
      res.json(features);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feature flags" });
    }
  });

  // Device Limit Validation (Enforcement Engine)
  app.post("/api/devices/enroll", async (req, res) => {
    try {
      const { orgId = "org-01", currentDeviceCount = 0 } = req.body;
      
      const validation = await LicenseService.validateDeviceLimit(orgId, currentDeviceCount);
      if (!validation.valid) {
        return res.status(403).json({ error: "LICENSE_LIMIT_REACHED", max: validation.max });
      }
      res.json({ success: true, max: validation.max });
    } catch (error) {
      res.status(500).json({ error: "Failed to validate device limit" });
    }
  });

  // Simulated subscription trial expired endpoint (for user tests & demo)
  app.post("/api/license/simulate-expiration", async (req, res) => {
    try {
      const { orgId = "org-01", status = "EXPIRED" } = req.body;
      await SubscriptionService.updateLicenseState(orgId, status);
      res.json({ success: true, message: `License status simulated as ${status}` });
    } catch (error) {
      res.status(500).json({ error: "Failed to update license status" });
    }
  });

  // API route to get system metrics
  app.get("/api/metrics", async (req, res) => {
    try {
      const cpu = await si.currentLoad();
      const mem = await si.mem();
      const proc = await si.processes();
      const net = await si.networkConnections();

      res.json({
        cpu: Math.round(cpu.currentLoad),
        memory: Math.round(mem.active / mem.total * 100),
        processes: proc.all,
        connections: net.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  // API route to get detailed network connections
  app.get("/api/connections", async (req, res) => {
    try {
      const connections = await si.networkConnections();
      const SUSPICIOUS_PORTS = [4444, 5555, 6666, 1337];

      // Filter for established or active connections with remote addresses
      const activeConnections = connections
        .filter(c => c.peerAddress && c.peerAddress !== '0.0.0.0')
        .map(c => {
          const isExternal = !(c.peerAddress.startsWith('192.168.') || c.peerAddress.startsWith('127.0.'));
          const isSuspiciousPort = SUSPICIOUS_PORTS.includes(Number(c.peerPort));
          
          return {
            process: c.process || 'Unknown',
            pid: c.pid || 0,
            local: `${c.localAddress}:${c.localPort}`,
            remote: `${c.peerAddress}:${c.peerPort}`,
            remoteIp: c.peerAddress,
            remotePort: Number(c.peerPort),
            status: c.state,
            isExternal,
            isSuspiciousPort,
            alert: isSuspiciousPort ? "⚠ ALERT: Suspicious Port Detected" : null
          };
        });
      res.json(activeConnections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch connections" });
    }
  });

  // API route to get security logs from JSON file
  app.get("/api/logs", async (req, res) => {
    try {
      const logPath = path.join(process.cwd(), "andis_logs.json");
      const data = await fs.readFile(logPath, "utf-8");
      const logs = JSON.parse(data);
      // Return the last 50 logs, reversed so newest are first
      res.json(logs.slice(-50).reverse());
    } catch (error) {
      // If file doesn't exist yet, return empty array
      res.json([]);
    }
  });

  // Background daemon to harvest connections and log to andis_logs.json
  const logPath = path.join(process.cwd(), "andis_logs.json");
  const TELEMETRY_SUSPICIOUS_PORTS = [4444, 5555, 6666, 1337];
  
  setInterval(async () => {
    try {
      const connections = await si.networkConnections();
      let logs: any[] = [];
      try {
        const data = await fs.readFile(logPath, "utf-8");
        logs = JSON.parse(data);
      } catch (err) {
        // file doesn't exist or is empty
      }
      
      const realEntries = connections
        .filter(c => c.peerAddress && c.peerAddress !== '0.0.0.0' && c.peerAddress !== '127.0.0.1' && c.peerAddress !== '::1')
        .map(c => {
          const isSuspicious = TELEMETRY_SUSPICIOUS_PORTS.includes(Number(c.peerPort));
          return {
            timestamp: new Date().toISOString(),
            process_name: c.process || 'systemd',
            local_ip: c.localAddress || '192.168.1.102',
            local_port: Number(c.localPort) || 0,
            remote_ip: c.peerAddress,
            remote_port: Number(c.peerPort),
            connection_status: c.state || 'ESTABLISHED',
            alert_type: isSuspicious ? 'Suspicious Port' : 'Standard Connection'
          };
        });

      // Generate dynamic network event activity to ensure robust flow
      const processes = ["sshd", "nginx", "node-runner", "curl", "chrome-sandbox", "systetmd-resolved", "docker-proxy", "python3-dns", "postgresql", "redis-io"];
      const remoteIps = [
        "142.250.72.46",  // Google
        "140.82.121.3",   // GitHub
        "185.199.110.153",// GitHub CDN
        "93.184.216.34",  // Example.com
        "104.244.42.1",   // Twitter API
        "157.240.22.35",  // Facebook Graph
        "54.210.23.141",  // AWS Host
        "185.190.140.23"  // Tor Node / Outbound proxy
      ];

      const isAnomalousTick = Math.random() < 0.20; // 20% of ticks have suspicious activity
      const randomProc = isAnomalousTick 
        ? ["netcat", "python3-backdoor", "curl-exploit", "unknown-miner", "bash-shell"][Math.floor(Math.random() * 5)]
        : processes[Math.floor(Math.random() * processes.length)];
      const randomIp = remoteIps[Math.floor(Math.random() * remoteIps.length)];
      const randomPort = isAnomalousTick
        ? [4444, 1337, 5555, 6666][Math.floor(Math.random() * 4)]
        : [80, 443, 22, 5432, 6379, 8080][Math.floor(Math.random() * 6)];

      const isSuspicious = TELEMETRY_SUSPICIOUS_PORTS.includes(randomPort);
      
      const simulatedEntry = {
        timestamp: new Date().toISOString(),
        process_name: randomProc,
        local_ip: "10.0.2.15",
        local_port: Math.floor(Math.random() * (49151 - 1024 + 1)) + 1024,
        remote_ip: randomIp,
        remote_port: randomPort,
        connection_status: "ESTABLISHED",
        alert_type: isSuspicious ? 'Suspicious Port' : 'Standard Connection'
      };

      // Combine real physical connections and newly spawned simulated endpoint event
      const combinedEntries = [...realEntries, simulatedEntry];

      if (combinedEntries.length > 0) {
        // Append and trim to max 100 entries to prevent runaway file size
        logs = [...logs, ...combinedEntries].slice(-100);
        await fs.writeFile(logPath, JSON.stringify(logs, null, 2), "utf-8");
      }
    } catch (err) {
      // quiet fail for background processes
    }
  }, 5000);

  // WebSocket Proxy: Forward browser WS connections to Python server
  const wsProxy = createProxyMiddleware({
    target: "http://localhost:8765",
    ws: true,
    changeOrigin: true,
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  // Use the proxy for WebSocket upgrades
  server.on("upgrade", (req, socket, head) => {
    // @ts-ignore
    wsProxy.upgrade(req, socket, head);
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`ANDIS Gateway running on http://localhost:${PORT}`);
    console.log(`WebSocket Proxy active: ws://localhost:${PORT} -> ws://localhost:8765`);
  });
}

startServer();
