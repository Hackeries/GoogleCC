import PageTitle from "@/components/PageTitle";
import { Settings as SettingsIcon, User, Bell, Lock, Globe } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Settings = () => {
  // TODO: Implement settings with profile, notifications, security, and preferences
  // Ticket: #SETTINGS-001

  const settingsSections = [
    {
      title: "Profile Settings",
      description: "Manage your personal information and preferences",
      icon: User,
    },
    {
      title: "Notifications",
      description: "Configure email and push notification preferences",
      icon: Bell,
    },
    {
      title: "Security",
      description: "Password, two-factor authentication, and sessions",
      icon: Lock,
    },
    {
      title: "Language & Region",
      description: "Set your timezone, language, and date formats",
      icon: Globe,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Settings"
        subtitle="Manage your account and application preferences"
      />

      <div className="grid gap-4">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{section.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center mt-4">
        <SettingsIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Advanced Settings Coming Soon
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Full settings management including custom branding, API keys, webhooks,
          and advanced integrations are under development.
        </p>
      </div>
    </div>
  );
};

export default Settings;
