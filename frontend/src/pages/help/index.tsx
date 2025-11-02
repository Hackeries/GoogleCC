import PageTitle from "@/components/PageTitle";
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Book, 
  Video,
  Search,
  ExternalLink
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      question: "How do I create a new event type?",
      answer: "Go to Event Types page and click 'Create Event'. Fill in the event details including title, duration, and location type. Your event will get a unique link you can share with others."
    },
    {
      question: "How do I connect my Google Calendar?",
      answer: "Navigate to Integrations & Apps page, find Google Calendar & Meet card, and click 'Connect'. You'll be redirected to Google's authorization page. After granting permissions, your calendar will be synced automatically."
    },
    {
      question: "Can I reschedule a meeting?",
      answer: "Yes! Go to your Calendar view, drag and drop the meeting to a new time slot, or resize it to change the duration. The changes will be synced to your integrated calendar automatically."
    },
    {
      question: "How do I set my availability?",
      answer: "Visit the Availability page where you can set your working hours for each day of the week. You can also configure buffer time between meetings and set time zones."
    },
    {
      question: "What is the difference between public and private events?",
      answer: "Public events can be booked by anyone with your event link. Private events are only visible to you and won't show up on your public booking page."
    },
    {
      question: "How do I cancel a meeting?",
      answer: "Go to the Meetings page, find the meeting you want to cancel, and click the cancel button. Both you and the guest will receive a cancellation notification, and it will be removed from your integrated calendar."
    },
    {
      question: "Can I customize my booking page URL?",
      answer: "Yes! Your booking page URL is based on your username (e.g., app.com/username). You can update your username in Settings > Profile."
    },
    {
      question: "How do video conference links work?",
      answer: "When you create an event with Google Meet, Zoom, or Microsoft Teams, a unique video conference link is automatically generated for each booking. The link is shared with attendees via email."
    },
  ];

  const resources = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of creating events and managing your calendar",
      icon: Book,
      link: "#"
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides for all features",
      icon: Video,
      link: "#"
    },
    {
      title: "API Documentation",
      description: "Integrate our calendar system into your applications",
      icon: Book,
      link: "#"
    },
  ];

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement actual contact form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Message sent successfully! We'll get back to you soon.");
    setContactForm({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Help & Support"
        subtitle="Find answers to common questions and get in touch with our support team"
      />

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Live Chat</CardTitle>
                  <CardDescription className="mt-1">
                    Chat with our support team
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Email Support</CardTitle>
                  <CardDescription className="mt-1">
                    support@googlecc.com
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-green-50 flex items-center justify-center">
                  <Book className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Documentation</CardTitle>
                  <CardDescription className="mt-1">
                    Browse our knowledge base
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - FAQs */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* FAQs Accordion */}
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFaqs.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No FAQs found matching your search.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-purple-600" />
                Learning Resources
              </CardTitle>
              <CardDescription>
                Guides and tutorials to help you get the most out of the app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resources.map((resource) => {
                  const Icon = resource.icon;
                  return (
                    <a
                      key={resource.title}
                      href={resource.link}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{resource.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {resource.description}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </a>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Contact Form */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-600" />
                Contact Support
              </CardTitle>
              <CardDescription>
                Can't find what you're looking for? Send us a message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitContact} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    required
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, subject: e.target.value })
                    }
                    required
                    placeholder="How can we help?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, message: e.target.value })
                    }
                    required
                    placeholder="Describe your issue or question..."
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;
