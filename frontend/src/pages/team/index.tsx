import PageTitle from "@/components/PageTitle";
import { Users, UserPlus, Mail, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Team = () => {
  // TODO: Implement team management with member list, invitations, and permissions
  // Ticket: #TEAM-001

  const mockTeamMembers = [
    {
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      avatar: "JD",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Member",
      avatar: "JS",
    },
    {
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Member",
      avatar: "BJ",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Team Members"
        subtitle="Manage your team and collaborate on scheduling"
      />

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Invite team members to collaborate on events and scheduling
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <div className="grid gap-4">
        {mockTeamMembers.map((member) => (
          <Card key={member.email} className="shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">{member.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Mail className="h-3 w-3" />
                    {member.email}
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                  <Shield className="h-3 w-3" />
                  <span className="text-sm font-medium">{member.role}</span>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center mt-4">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Team Management Coming Soon
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Full team management features including invitations, role assignments,
          and collaborative scheduling are under development.
        </p>
      </div>
    </div>
  );
};

export default Team;
