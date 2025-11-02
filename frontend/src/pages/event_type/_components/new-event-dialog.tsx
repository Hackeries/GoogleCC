import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "lucide-react";
import { locationOptions, VideoConferencingPlatform } from "@/lib/types";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PROTECTED_ROUTES } from "@/routes/common/routePaths";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { checkIntegrationQueryFn, CreateEventMutationFn, getAllIntegrationQueryFn } from "@/lib/api";
import { toast } from "sonner";
import { Loader } from "@/components/loader";

const NewEventDialog = ({ btnVariant }: { btnVariant?: string }) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: CreateEventMutationFn,
  });

  const [selectedLocationType, setSelectedLocationType] =
    useState<VideoConferencingPlatform | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [appConnected, setAppConnected] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // ✅ Fetch all integrations to check connection status
  const { data: integrationsData } = useQuery({
    queryKey: ["integrations"],
    queryFn: getAllIntegrationQueryFn,
  });

  // ✅ Schema
  const eventSchema = z.object({
    title: z.string().min(1, "Event name is required"),
    duration: z
      .number()
      .int({ message: "Duration must be a number" })
      .min(1, "Duration is required"),
    description: z.string().optional(),
    locationType: z.nativeEnum(VideoConferencingPlatform, {
      required_error: "Location type is required",
    }),
  });

  type EventFormData = z.infer<typeof eventSchema>;

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      duration: 30,
      description: "",
    },
  });

  const { isValid } = form.formState;

  // ✅ Check if Google Meet is connected when integrations data loads or dialog opens
  useEffect(() => {
    if (isOpen && integrationsData?.data?.integrations) {
      const googleMeetIntegration = integrationsData.data.integrations.find(
        (integration) => integration.appType === "GOOGLE_MEET_AND_CALENDAR"
      );
      if (googleMeetIntegration?.isConnected && selectedLocationType === VideoConferencingPlatform.GOOGLE_MEET_AND_CALENDAR) {
        setAppConnected(true);
        setError(null);
      }
    }
  }, [integrationsData, selectedLocationType, isOpen]);

  const handleLocationTypeChange = async (value: VideoConferencingPlatform) => {
    setSelectedLocationType(value);
    setError(null);
    form.setValue("locationType", value);

    // Only check for Google Meet integration
    if (value === VideoConferencingPlatform.GOOGLE_MEET_AND_CALENDAR) {
      // ✅ First check from the fetched integrations data (cache)
      const googleMeetIntegration = integrationsData?.data?.integrations.find(
        (integration) => integration.appType === "GOOGLE_MEET_AND_CALENDAR"
      );

      if (googleMeetIntegration?.isConnected) {
        setAppConnected(true);
        form.trigger("locationType");
        return;
      }

      // ✅ If not found in cache, check via API call
      setIsChecking(true);
      try {
        const { connected } = await checkIntegrationQueryFn(
          VideoConferencingPlatform.GOOGLE_MEET_AND_CALENDAR
        );

        if (!connected) {
          setError(
            `Google Meet is not connected. <a href="${PROTECTED_ROUTES.INTEGRATIONS}" target="_blank" rel="noopener noreferrer" class="underline text-primary">Visit the integration page</a> to connect your account.`
          );
          setAppConnected(false);
          form.trigger("locationType");
          return;
        }

        setError(null);
        setAppConnected(true);
        form.trigger("locationType");
      } catch (error) {
        console.error("Integration check failed:", error);
        setError("Failed to check Google Meet integration status. Please try again.");
        setAppConnected(false);
      } finally {
        setIsChecking(false);
      }
    } else {
      // For other platforms (Zoom, MS Teams), don't require connection check for now
      setAppConnected(true);
      form.trigger("locationType");
    }
  };

  const onSubmit = (data: EventFormData) => {
    const payload = {
      title: data.title,
      duration: data.duration,
      description: data.description || "",
      locationType: data.locationType,
    };

    console.log("✅ Form Data (payload):", payload);

    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["event_list"] });
        queryClient.invalidateQueries({ queryKey: ["integrations"] });
        setSelectedLocationType(null);
        setIsOpen(false);
        setAppConnected(false);
        setError(null);
        form.reset();
        toast.success("Event created successfully!");
      },
      onError: () => {
        toast.error("Failed to create event");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={btnVariant ? "default" : "outline"}
          size="lg"
          className={cn(
            `!w-auto !border-2 !border-blue-500 !text-blue-600 !font-semibold !text-base hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-xl`,
            btnVariant && "!text-white !bg-gradient-to-r !from-blue-500 !to-purple-600 hover:!from-blue-600 hover:!to-purple-700 !border-none"
          )}
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Event Type</span>
        </Button>

      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto !px-0 pb-0">
        <DialogHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-6">
          <DialogTitle className="text-2xl font-bold">✨ Create Event Type</DialogTitle>
          <DialogDescription className="text-blue-100 text-base">
            Set up a new event type for seamless scheduling
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 px-6">
              {/* Event Name */}
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-semibold !text-base text-gray-700">
                      📝 Event name *
                    </Label>
                    <FormControl className="mt-2">
                      <Input 
                        placeholder="e.g., 30-Minute Consultation, Discovery Call" 
                        className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-semibold !text-base text-gray-700">
                      💬 Description
                    </Label>
                    <FormControl className="mt-2">
                      <Textarea
                        className="focus-visible:ring-ring/0 border-2 focus:border-blue-500 transition-colors text-base resize-none"
                        placeholder="Describe what this event is about..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration */}
              <FormField
                name="duration"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-semibold !text-base text-gray-700">⏱️ Duration (minutes) *</Label>
                    <FormControl className="mt-2">
                      <Input
                        {...field}
                        type="number"
                        placeholder="e.g., 15, 30, 60"
                        className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value) && value > 0) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Type */}
              <FormField
                name="locationType"
                control={form.control}
                render={() => (
                  <FormItem>
                    <Label className="font-semibold !text-base text-gray-700">
                      🔗 Meeting Platform *
                    </Label>
                    <FormControl className="w-full mt-2">
                      <div className="grid grid-cols-4 gap-3">
                        {locationOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            title={option.label} // ✅ accessibility fix
                            className={cn(
                              `relative w-full h-[85px] cursor-pointer border-2 disabled:pointer-events-none border-gray-300 mx-auto rounded-xl flex flex-col items-center justify-center transition-all duration-200 hover:shadow-lg`,
                              selectedLocationType === option.value &&
                                "border-blue-500 bg-blue-50 shadow-lg scale-105",
                              !option.isAvailable &&
                                "pointer-events-none !text-gray-400 opacity-60 grayscale",
                              selectedLocationType === option.value &&
                                !!error &&
                                "!border-red-500 !bg-red-50",
                              appConnected &&
                                selectedLocationType === option.value &&
                                "!border-green-500 !bg-green-50 shadow-green-200"
                            )}
                            disabled={isChecking}
                            onClick={() => {
                              if (
                                !appConnected ||
                                selectedLocationType !== option.value
                              ) {
                                handleLocationTypeChange(option.value);
                              }
                            }}
                          >
                            {isChecking &&
                            selectedLocationType === option.value ? (
                              <Loader size="sm" />
                            ) : (
                              <>
                                <img
                                  src={option.logo as string}
                                  alt={option.label}
                                  width="28"
                                  height="28"
                                  className="mb-2"
                                />
                                <span className="text-xs font-medium">
                                  {option.label}
                                </span>
                                {appConnected && selectedLocationType === option.value && (
                                  <span className="absolute top-1 right-1 text-green-500 text-lg">✓</span>
                                )}
                              </>
                            )}
                          </button>
                        ))}
                      </div>
                    </FormControl>

                    {error ? (
                      <FormMessage>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: error,
                          }}
                        />
                      </FormMessage>
                    ) : (
                      <FormMessage />
                    )}
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="bg-gray-50 border-t px-6 py-4 !mt-6 border-gray-200 rounded-b-[8px] gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="flex-1 h-12 text-base font-medium"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!isValid || isPending}
                className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>✨</span>
                    Create Event Type
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewEventDialog;
