/* eslint-disable @typescript-eslint/no-explicit-any */
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { XIcon } from "lucide-react";
import TimeSelector from "@/components/TimeSelector";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DayAvailabilityProps {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  index: number;
  form: any;
  dayMapping: Record<string, string>;
  onRemove: (day: string) => void;
  onTimeSelect: (
    day: string,
    field: "startTime" | "endTime",
    time: string
  ) => void;
}

const DayAvailability = ({
  day,
  isAvailable,
  index,
  form,
  dayMapping,
  onRemove,
  onTimeSelect,
}: DayAvailabilityProps) => {
  const errors = form.formState.errors?.days?.[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-8 p-3 px-0 border-b border-gray-100 last:border-0 min-h-[48px]"
    >
      {/* Day + Toggle */}
      <div className="w-[110px] flex items-center mt-1">
        <Switch
          checked={isAvailable}
          onCheckedChange={(checked) => {
            form.setValue(`days.${index}.isAvailable`, checked);
            if (!checked) {
              form.setValue(`days.${index}.startTime`, "09:00");
              form.setValue(`days.${index}.endTime`, "17:00");
            }
          }}
          aria-label={`Toggle availability for ${dayMapping[day]}`}
        />
        <Label className="ml-3 text-sm font-semibold uppercase text-[#0a2540] tracking-wide">
          {dayMapping[day]}
        </Label>
      </div>

      {/* If available — show time inputs */}
      {isAvailable ? (
        <div className="flex flex-1 items-center gap-3 relative">
          {/* Start Time */}
          <FormField
            name={`days.${index}.startTime`}
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-[120px]">
                <FormControl>
                  <TimeSelector
                    name={`days.${index}.startTime`}
                    defaultValue={field.value}
                    timeGap={form.watch("timeGap")}
                    register={form.register}
                    className={cn(
                      "border border-gray-300 rounded-md",
                      errors?.startTime && "!border-destructive"
                    )}
                    onSelect={(time) => onTimeSelect(day, "startTime", time)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Separator className="h-6 w-[1px] bg-gray-300" />

          {/* End Time */}
          <FormField
            name={`days.${index}.endTime`}
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-[120px]">
                <FormControl>
                  <TimeSelector
                    name={`days.${index}.endTime`}
                    defaultValue={field.value}
                    timeGap={form.watch("timeGap")}
                    register={form.register}
                    className={cn(
                      "border border-gray-300 rounded-md",
                      errors?.endTime && "!border-destructive"
                    )}
                    onSelect={(time) => onTimeSelect(day, "endTime", time)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Remove button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onRemove(day)}
            className="ml-auto flex items-center justify-center size-[36px] rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
            aria-label={`Remove ${dayMapping[day]} availability`}
          >
            <XIcon className="w-4 h-4" />
          </motion.button>

          {/* Validation message */}
          {(errors?.startTime || errors?.endTime) && (
            <FormMessage className="absolute top-full mt-1 text-xs text-destructive">
              {errors?.startTime?.message || errors?.endTime?.message}
            </FormMessage>
          )}
        </div>
      ) : (
        <span className="text-sm text-gray-500 italic mt-1">Unavailable</span>
      )}
    </motion.div>
  );
};

export default DayAvailability;
