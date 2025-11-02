import PageTitle from "@/components/PageTitle";
import IntegrationCard from "./_components/integration-card";
import { useQuery } from "@tanstack/react-query";
import { getAllIntegrationQueryFn } from "@/lib/api";
import { Loader } from "@/components/loader";
import { ErrorAlert } from "@/components/ErrorAlert";

const Integrations = () => {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["integration_list"],
    queryFn: getAllIntegrationQueryFn,
  });

  const integrations = data?.integrations || [];

  return (
    <div className="flex flex-col !gap-8 p-6">
      <div className="space-y-3">
        <PageTitle
          title="?? Integrations & Apps"
          subtitle="Connect your favorite apps and services to supercharge your workflow"
        />
        <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-4">
          ?? <span className="font-semibold">Pro Tip:</span> Connect Google Meet & Calendar to enable seamless scheduling and video conferencing
        </p>
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
