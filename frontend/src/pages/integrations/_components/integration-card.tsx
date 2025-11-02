/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { connectAppIntegrationQueryFn } from "@/lib/api";
import {
  IntegrationAppEnum,
  IntegrationAppType,
  IntegrationDescriptions,
  IntegrationLogos,
} from "@/lib/types";
import { PlusIcon } from "lucide-react";

interface IntegrationCardProps {
  appType: IntegrationAppType;
  title: string;
  isConnected?: boolean;
  isDisabled?: boolean;
}

interface ImageWrapperProps {
  src: string;
  alt: string;
  height?: number;
  width?: number;
  className?: string;
}

const SUCCESS_MESSAGES: Record<any, string> = {
  [IntegrationAppEnum.GOOGLE_MEET_AND_CALENDAR]:
    "Google Calendar connected successfully!",
};

const ERROR_MESSAGES: Record<any, string> = {
  [IntegrationAppEnum.GOOGLE_MEET_AND_CALENDAR]:
    "Failed to connect Google Calendar. Please try again.",
};

const IntegrationCard = ({
  appType,
  title,
  isConnected = false,
  isDisabled = false,
}: IntegrationCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<IntegrationAppType | null>(
    null
  );

  const logos = IntegrationLogos[appType];
  const description = IntegrationDescriptions[appType];

  const handleConnect = async (appType: IntegrationAppType) => {
    setSelectedType(appType);
    setIsLoading(true);
    try {
      // ✅ Fixed: use redirectUrl instead of url
      const { redirectUrl } = await connectAppIntegrationQueryFn(appType);
      console.log(SUCCESS_MESSAGES[appType], redirectUrl);
      setSelectedType(null);
      window.location.href = redirectUrl;
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to connect Google Calendar:", error);
      toast.error(ERROR_MESSAGES[appType]);
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-2 border-gray-200 hover:border-blue-400">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative flex w-full items-center justify-between p-6">
        <div className="flex flex-col gap-5">
          {Array.isArray(logos) ? (
            <div className="flex items-center gap-4">
              <ImageWrapper src={logos[0]} alt="Google Meet logo" className="shadow-lg" />
              <span className="mx-1 text-blue-500">
                <PlusIcon className="w-6 h-6" />
              </span>
              <ImageWrapper src={logos[1]} alt="Google Calendar logo" className="shadow-lg" />
            </div>
          ) : (
            <ImageWrapper src={logos} alt={`${title} logo`} className="shadow-lg" />
          )}
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{title}</CardTitle>
            <CardDescription className="text-base text-gray-600">{description}</CardDescription>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          {isConnected ? (
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 blur-lg opacity-30 animate-pulse"></div>
              <div
                className="relative inline-flex items-center 
                  justify-center min-h-[48px] text-base
                  border-2 border-green-500
                  bg-green-50
                  text-green-700
                  px-6 rounded-full font-bold w-[180px] shadow-md"
              >
                ✓ Connected
              </div>
            </div>
          ) : (
            <Button
              onClick={() => handleConnect(appType)}
              variant="unstyled"
              className={`relative shrink-0 inline-flex items-center 
                justify-center min-h-[48px] text-base font-bold
                px-6 rounded-full w-[180px] disabled:pointer-events-none
                transition-all duration-300 shadow-lg
                ${
                  isDisabled
                    ? "pointer-events-none opacity-60 border-2 border-gray-300 text-gray-500 bg-gray-100"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:shadow-2xl hover:scale-105"
                }`}
              aria-disabled={isDisabled}
              disabled={isLoading}
            >
              {isLoading && selectedType === appType ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  <span>Connecting...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isDisabled ? (
                    <>🔒 Not available</>
                  ) : (
                    <>🔗 Connect Now</>
                  )}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export const ImageWrapper: React.FC<ImageWrapperProps> = ({
  src,
  alt,
  height = 30,
  width = 30,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-center rounded-full size-[60px] shadow-xl border-2 border-white hover:scale-110 transition-transform duration-300 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        height={height}
        width={width}
        className="object-cover"
      />
    </div>
  );
};

export default IntegrationCard;
