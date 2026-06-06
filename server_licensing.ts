import fs from "fs/promises";
import path from "path";

export interface License {
  license_id: string;
  org_id: string;
  tier: "Developer" | "Business" | "Enterprise";
  status: "TRIAL" | "ACTIVE" | "EXPIRED" | "SUSPENDED";
  max_devices: number;
  retention_days: number;
  created_at: string;
  expires_at: string;
}

export interface Subscription {
  subscription_id: string;
  org_id: string;
  billing_provider: string;
  external_subscription_id: string;
  plan_name: "Developer" | "Business" | "Enterprise";
  status: string;
  renewal_date: string;
}

export interface FeatureFlag {
  org_id: string;
  feature_name: "ThreatIntel" | "AdvancedAnalytics" | "RollbackControl" | "PriorityUpdates";
  enabled: boolean;
}

export interface AuditLog {
  timestamp: string;
  org_id: string;
  user: string;
  action: string;
  result: string;
  details: string;
}

const dbPath = path.join(process.cwd(), "andis_licensing.json");

// Helper to initialize the licensing database if it doesn't exist
async function initDb() {
  try {
    await fs.access(dbPath);
  } catch {
    // Write default database values for ORG "org-01"
    const defaultData = {
      licenses: [
        {
          license_id: "lic-dev-01",
          org_id: "org-01",
          tier: "Developer",
          status: "TRIAL",
          max_devices: 5,
          retention_days: 30,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ],
      subscriptions: [
        {
          subscription_id: "sub-dev-01",
          org_id: "org-01",
          billing_provider: "ANDIS Billing Portal",
          external_subscription_id: "sub_ext_dev_01",
          plan_name: "Developer",
          status: "ACTIVE",
          renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ],
      feature_flags: [
        { org_id: "org-01", feature_name: "ThreatIntel", enabled: false },
        { org_id: "org-01", feature_name: "AdvancedAnalytics", enabled: false },
        { org_id: "org-01", feature_name: "RollbackControl", enabled: false },
        { org_id: "org-01", feature_name: "PriorityUpdates", enabled: false }
      ],
      audit_logs: [
        {
          timestamp: new Date().toISOString(),
          org_id: "org-01",
          user: "System",
          action: "License creation",
          result: "SUCCESS",
          details: "Initialized Developer trial license"
        }
      ]
    };
    await fs.writeFile(dbPath, JSON.stringify(defaultData, null, 2), "utf-8");
  }
}

async function readDb(): Promise<any> {
  await initDb();
  const data = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(data);
}

async function writeDb(data: any): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
}

export const LicenseService = {
  async getLicense(orgId: string): Promise<License | null> {
    const db = await readDb();
    const license = db.licenses.find((l: License) => l.org_id === orgId);
    return license || null;
  },

  async validateDeviceLimit(orgId: string, currentCount: number): Promise<{ valid: boolean; max: number }> {
    const license = await this.getLicense(orgId);
    if (!license) return { valid: false, max: 0 };
    if (license.status === "EXPIRED" || license.status === "SUSPENDED") {
      return { valid: false, max: license.max_devices };
    }
    // Unlimited max_devices is represented by -1 or very large number
    const max = license.max_devices;
    if (max < 0 || max === null) return { valid: true, max: -1 };
    return { valid: currentCount < max, max };
  },

  async getRetentionPolicy(orgId: string): Promise<number> {
    const license = await this.getLicense(orgId);
    return license ? license.retention_days : 30;
  },

  async hasFeature(orgId: string, feature: string): Promise<boolean> {
    const db = await readDb();
    const flag = db.feature_flags.find((f: FeatureFlag) => f.org_id === orgId && f.feature_name === feature);
    return flag ? flag.enabled : false;
  },

  async isFeatureEnabled(orgId: string, feature: string): Promise<boolean> {
    return this.hasFeature(orgId, feature);
  }
};

export const SubscriptionService = {
  async getSubscription(orgId: string): Promise<Subscription | null> {
    const db = await readDb();
    return db.subscriptions.find((s: Subscription) => s.org_id === orgId) || null;
  },

  async createSubscription(orgId: string, tier: "Developer" | "Business" | "Enterprise"): Promise<void> {
    const db = await readDb();
    // Remove existing subscription & licenses
    db.subscriptions = db.subscriptions.filter((s: Subscription) => s.org_id !== orgId);
    db.licenses = db.licenses.filter((l: License) => l.org_id !== orgId);

    const subscription_id = `sub-${tier.toLowerCase()}-${Math.random().toString(36).substr(2, 9)}`;
    const license_id = `lic-${tier.toLowerCase()}-${Math.random().toString(36).substr(2, 9)}`;

    const max_devices = tier === "Developer" ? 5 : tier === "Business" ? 100 : -1;
    const retention_days = tier === "Developer" ? 30 : tier === "Business" ? 180 : 365;

    const newSub: Subscription = {
      subscription_id,
      org_id: orgId,
      billing_provider: "ANDIS Billing Portal",
      external_subscription_id: `sub_ext_${Math.random().toString(36).substr(2, 9)}`,
      plan_name: tier,
      status: "ACTIVE",
      renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const newLicense: License = {
      license_id,
      org_id: orgId,
      tier,
      status: "ACTIVE",
      max_devices,
      retention_days,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    db.subscriptions.push(newSub);
    db.licenses.push(newLicense);

    // Update feature flags
    db.feature_flags = db.feature_flags.filter((f: FeatureFlag) => f.org_id !== orgId);
    db.feature_flags.push(
      { org_id: orgId, feature_name: "ThreatIntel", enabled: tier === "Business" || tier === "Enterprise" },
      { org_id: orgId, feature_name: "AdvancedAnalytics", enabled: tier === "Enterprise" },
      { org_id: orgId, feature_name: "RollbackControl", enabled: tier === "Business" || tier === "Enterprise" },
      { org_id: orgId, feature_name: "PriorityUpdates", enabled: tier === "Enterprise" }
    );

    // Add Audit Log
    db.audit_logs.push({
      timestamp: new Date().toISOString(),
      org_id: orgId,
      user: "Admin",
      action: "Subscription creation",
      result: "SUCCESS",
      details: `Created new ${tier} subscription`
    });

    await writeDb(db);
  },

  async cancelSubscription(orgId: string): Promise<void> {
    const db = await readDb();
    
    // Set status of subscription and license to EXPIRED/SUSPENDED
    const license = db.licenses.find((l: License) => l.org_id === orgId);
    if (license) license.status = "SUSPENDED";

    const subscription = db.subscriptions.find((s: Subscription) => s.org_id === orgId);
    if (subscription) subscription.status = "CANCELLED";

    // Add Audit Log
    db.audit_logs.push({
      timestamp: new Date().toISOString(),
      org_id: orgId,
      user: "Admin",
      action: "Subscription cancellation",
      result: "SUCCESS",
      details: `Cancelled active subscription`
    });

    await writeDb(db);
  },

  async upgradePlan(orgId: string, newTier: "Developer" | "Business" | "Enterprise"): Promise<void> {
    const db = await readDb();
    
    const license = db.licenses.find((l: License) => l.org_id === orgId);
    const subscription = db.subscriptions.find((s: Subscription) => s.org_id === orgId);

    const max_devices = newTier === "Developer" ? 5 : newTier === "Business" ? 100 : -1;
    const retention_days = newTier === "Developer" ? 30 : newTier === "Business" ? 180 : 365;

    if (license) {
      license.tier = newTier;
      license.max_devices = max_devices;
      license.retention_days = retention_days;
      license.status = "ACTIVE";
    }

    if (subscription) {
      subscription.plan_name = newTier;
      subscription.status = "ACTIVE";
    }

    // Update feature flags
    db.feature_flags = db.feature_flags.filter((f: FeatureFlag) => f.org_id !== orgId);
    db.feature_flags.push(
      { org_id: orgId, feature_name: "ThreatIntel", enabled: newTier === "Business" || newTier === "Enterprise" },
      { org_id: orgId, feature_name: "AdvancedAnalytics", enabled: newTier === "Enterprise" },
      { org_id: orgId, feature_name: "RollbackControl", enabled: newTier === "Business" || newTier === "Enterprise" },
      { org_id: orgId, feature_name: "PriorityUpdates", enabled: newTier === "Enterprise" }
    );

    // Add Audit Log
    db.audit_logs.push({
      timestamp: new Date().toISOString(),
      org_id: orgId,
      user: "Admin",
      action: "Tier changes",
      result: "SUCCESS",
      details: `Upgraded subscription tier to ${newTier}`
    });

    await writeDb(db);
  },

  async downgradePlan(orgId: string, newTier: "Developer" | "Business" | "Enterprise"): Promise<void> {
    const db = await readDb();
    
    const license = db.licenses.find((l: License) => l.org_id === orgId);
    const subscription = db.subscriptions.find((s: Subscription) => s.org_id === orgId);

    const max_devices = newTier === "Developer" ? 5 : newTier === "Business" ? 100 : -1;
    const retention_days = newTier === "Developer" ? 30 : newTier === "Business" ? 180 : 365;

    if (license) {
      license.tier = newTier;
      license.max_devices = max_devices;
      license.retention_days = retention_days;
    }

    if (subscription) {
      subscription.plan_name = newTier;
    }

    // Update feature flags
    db.feature_flags = db.feature_flags.filter((f: FeatureFlag) => f.org_id !== orgId);
    db.feature_flags.push(
      { org_id: orgId, feature_name: "ThreatIntel", enabled: newTier === "Business" || newTier === "Enterprise" },
      { org_id: orgId, feature_name: "AdvancedAnalytics", enabled: newTier === "Enterprise" },
      { org_id: orgId, feature_name: "RollbackControl", enabled: newTier === "Business" || newTier === "Enterprise" },
      { org_id: orgId, feature_name: "PriorityUpdates", enabled: newTier === "Enterprise" }
    );

    // Add Audit Log
    db.audit_logs.push({
      timestamp: new Date().toISOString(),
      org_id: orgId,
      user: "Admin",
      action: "Tier changes",
      result: "SUCCESS",
      details: `Downgraded subscription tier to ${newTier}`
    });

    await writeDb(db);
  },

  async updateLicenseState(orgId: string, status: "TRIAL" | "ACTIVE" | "EXPIRED" | "SUSPENDED"): Promise<void> {
    const db = await readDb();
    const license = db.licenses.find((l: License) => l.org_id === orgId);
    if (license) {
      const prevStatus = license.status;
      license.status = status;
      db.audit_logs.push({
        timestamp: new Date().toISOString(),
        org_id: orgId,
        user: "System",
        action: status === "EXPIRED" ? "Trial expiration" : "License state update",
        result: "SUCCESS",
        details: `Updated license state from ${prevStatus} to ${status}`
      });
      await writeDb(db);
    }
  },

  async getAuditLogs(orgId: string): Promise<AuditLog[]> {
    const db = await readDb();
    return db.audit_logs.filter((log: AuditLog) => log.org_id === orgId);
  }
};
