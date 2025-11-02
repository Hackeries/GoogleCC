import PageTitle from "@/components/PageTitle";
import IntegrationCard from "./_components/integration-card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllIntegrationQueryFn } from "@/lib/api";
import { Loader } from "@/components/loader";
import { ErrorAlert } from "@/components/ErrorAlert";
import { useEffect } from "react";
import { toast } from "sonner";

const Integrations = () => {
  const queryClient = useQueryClient();
  
  // ? Real-time polling: refetch every 3 seconds to sync integration status
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["integration_list"],
    queryFn: getAllIntegrationQueryFn,
    refetchInterval: 3000, // Poll every 3 seconds for real-time sync
    refetchIntervalInBackground: false, // Only poll when tab is active
  });

  const integrations = data?.integrations || [];

  // ? Check for OAuth callback success/error in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const error = params.get("error");
    const appType = params.get("app_type");

    if (success === "true") {
      toast.success(`${appType === "google" ? "Google Meet & Calendar" : "Integration"} connected successfully! ??`);
      // Invalidate to force immediate refresh
      queryClient.invalidateQueries({ queryKey: ["integration_list"] });
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    } else if (error) {
      toast.error(`Failed to connect: ${error}`);
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [queryClient]);

  return (
    <div className="flex flex-col !gap-8 p-6">
      <div className="space-y-3">
        <PageTitle
          title="Integrations & Apps"
          subtitle="Connect your favorite apps and services to supercharge your workflow"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <p className="flex-1 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <span className="font-semibold">Pro Tip:</span> Connect Google Meet & Calendar to enable seamless scheduling and video conferencing
          </p>
          {/* Real-time sync indicator */}
          <div className="text-sm text-gray-600 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="font-semibold">Live Sync Active</span>
          </div>
        </div>
      </div>

      <ErrorAlert isError={isError} error={error} />

      <div className="relative flex flex-col gap-6">
        <section className="flex flex-col gap-6">
          {isFetching || isError ? (
            <div className="flex items-center justify-center min-h-[40vh] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
              <div className="text-center space-y-4">
                <Loader size="lg" color="black" />
                <p className="text-gray-600 font-medium">Loading integrations...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {integrations.map((integration, index) => (
                  <div 
                    key={integration.app_type}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    <IntegrationCard
                      isDisabled={
                        integration.app_type === "GOOGLE_MEET_AND_CALENDAR"
                          ? false
                          : true
                      }
                      appType={integration.app_type}
                      title={integration.title}
                      isConnected={integration.isConnected}
                    />
                  </div>
                ))}
              </div>
              {integrations.length === 0 && (
                <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                  <div className="mb-6 text-7xl">??</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No Integrations Found</h3>
                  <p className="text-gray-500">Check back later for new integrations</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Integrations;
