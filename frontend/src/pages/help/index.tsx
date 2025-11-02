import PageTitle from "@/components/PageTitle";
import { HelpCircle, BookOpen, MessageCircle, Video, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Help = () => {
  // TODO: Implement help center with documentation, FAQs, and support
  // Ticket: #HELP-001

  const helpResources = [
    {
      title: "Documentation",
      description: "Browse our comprehensive guides and tutorials",
      icon: BookOpen,
      link: "#",
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      icon: Video,
      link: "#",
    },
    {
      title: "Contact Support",
      description: "Get help from our support team",
      icon: MessageCircle,
      link: "#",
    },
    {
      title: "Community Forum",
      description: "Connect with other users and share tips",
      icon: HelpCircle,
      link: "#",
    },
  ];

  const faqs = [
    {
      question: "How do I connect my Google Calendar?",
      answer:
        "Go to Integrations & Apps, click on Google Meet & Calendar, and follow the authorization flow.",
    },
    {
      question: "Can I customize my availability?",
      answer:
        "Yes! Navigate to Availability to set your working hours for each day of the week.",
    },
    {
      question: "How do I share my booking link?",
      answer:
        "Create an event type, then copy the public link to share with others.",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Help & Support"
        subtitle="Get assistance and learn how to use GoogleCC"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {helpResources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card key={resource.title} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-base">{resource.title}</CardTitle>
                </div>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="gap-2">
                  Open
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">{faq.question}</CardTitle>
                <CardDescription className="mt-2">{faq.answer}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center mt-4">
        <HelpCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Need More Help?
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-4">
          Our comprehensive help center with searchable documentation, video
          tutorials, and live chat support is coming soon.
        </p>
        <Button variant="default">Contact Support Team</Button>
      </div>
    </div>
  );
};

export default Help;
