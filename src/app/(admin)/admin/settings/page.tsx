"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Bell, Lock, Users, Zap } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage platform configuration and preferences
        </p>
      </div>

      <div className="grid xl:grid-cols-2 gap-5">
        {/* Platform Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold  flex items-center gap-2">
            <Zap className="text-primary" size={20} />
            Platform Configuration
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Platform Name
              </label>
              <Input placeholder="Barguna" className="h-11" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Members
              </label>
              <Input placeholder="500" type="number" className="h-11" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Minimum Investment (BDT)
              </label>
              <Input placeholder="1000" type="number" className="h-11" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Maximum Investment (BDT)
              </label>
              <Input placeholder="500000" type="number" className="h-11" />
            </div>
          </div>
          <Button className="mt-6 bg-primary hover:bg-primary/90 gap-2">
            <Save size={16} /> Save Settings
          </Button>
        </Card>

        {/* Fee Configuration */}
        <Card className="p-6 border-2 border-secondary/20">
          <h2 className="text-lg font-semibold  flex items-center gap-2">
            <Users className="text-secondary" size={20} />
            Commission & Fee Settings
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Admin Commission (%)
              </label>
              <Input
                placeholder="5"
                type="number"
                step="0.1"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Percentage from profit
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Withdrawal Fee (BDT)
              </label>
              <Input placeholder="50" type="number" className="h-11" />
              <p className="text-xs text-muted-foreground mt-1">
                Fixed fee per withdrawal
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Deposit Processing Fee (%)
              </label>
              <Input
                placeholder="0.5"
                type="number"
                step="0.1"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Percentage fee on deposits
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Monthly Platform Fee (BDT)
              </label>
              <Input placeholder="1000" type="number" className="h-11" />
              <p className="text-xs text-muted-foreground mt-1">
                Operating costs
              </p>
            </div>
          </div>
          <Button className="mt-6 bg-secondary hover:bg-secondary/90 gap-2">
            <Save size={16} /> Save Fee Settings
          </Button>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="text-primary" size={20} />
            Notification Preferences
          </h2>
          <div className="space-y-4">
            {[
              { label: "Notify on New Withdrawal Requests", value: true },
              { label: "Notify on New Member Registration", value: true },
              { label: "Daily Investment Summary", value: false },
              { label: "KYC Verification Reminders", value: true },
              { label: "Low Pool Balance Alert", value: true },
              { label: "Suspicious Activity Detection", value: true },
            ].map((setting, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-muted/30 rounded"
              >
                <label className="text-sm font-medium">{setting.label}</label>
                <input
                  type="checkbox"
                  defaultChecked={setting.value}
                  className="w-4 h-4 rounded cursor-pointer"
                />
              </div>
            ))}
          </div>
          <Button className="mt-6 bg-primary hover:bg-primary/90 gap-2">
            <Save size={16} /> Save Preferences
          </Button>
        </Card>

        {/* Security Settings */}
        <Card className="p-6 border-2 border-destructive/20 bg-destructive/5">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Lock className="text-destructive" size={20} />
            Security Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Session Timeout (minutes)
              </label>
              <Input placeholder="30" type="number" className="h-11" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Two-Factor Authentication
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-sm h-11">
                <option>Optional</option>
                <option>Required for Sensitive Operations</option>
                <option>Mandatory</option>
              </select>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
              <p className="font-medium mb-1">Warning:</p>
              <p>
                Security settings affect all admin accounts. Changes will
                require re-authentication.
              </p>
            </div>
          </div>
          <Button className="mt-6 bg-destructive hover:bg-destructive/90 gap-2">
            <Save size={16} /> Update Security Settings
          </Button>
        </Card>
      </div>
    </div>
  );
}
