import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ENV } from "@/lib/get-env";
import { cn } from "@/lib/utils";
import { CopyIcon, Edit2Icon, Trash2Icon, ExternalLinkIcon, CalendarIcon } from "lucide-react";
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface PropsType {
  id: string;
  title: string;
  slug: string;
  duration: number;
  isPrivate: boolean;
  username: string;
  isPending: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  isDeleting?: boolean;
  description?: string;
}

const EventCard: FC<PropsType> = ({
  title,
  duration,
  slug,
  isPrivate = false,
  username,
  isPending,
  onToggle,
  onDelete,
  onEdit,
  isDeleting = false,
  description,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const event_link = `${ENV.VITE_APP_ORIGIN}/${username}/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(event_link)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast.success("Event link copied");
      })
      .catch((error) => {
        console.error("Failed to copy link:", error);
      });
  };
  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete();
  };

  return (
    <div className="group relative">
      <Card
        className={cn(
          `!p-0 !ring-0 w-full max-w-[400px]
        box-border min-h-[220px] border border-[#CCCCCC)] bg-white rounded-lg
        shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`,
          isPrivate && "bg-gray-50 opacity-75"
        )}
      >
        <CardContent className="relative flex flex-col p-0">
          <div
            className={cn(
              `bg-gradient-to-r from-blue-500 to-purple-600
          h-[6px] -mt-[1px] -mr-[1px] -ml-[1px] rounded-tl-lg rounded-tr-lg`,
              isPrivate && "from-gray-400 to-gray-500"
            )}
          ></div>
          <div className="flex items-center justify-between p-[12px_16px]">
            <div className="flex items-center gap-2">
              <CalendarIcon className={cn("w-5 h-5 text-blue-500", isPrivate && "text-gray-400")} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                  <Edit2Icon className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)} 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* {Event details} */}
          <div className="w-full flex flex-col p-[5px_16px_18px_16px]">
            <h2
              className={cn(
                `text-xl font-semibold text-gray-800 mb-1`,
                isPrivate && "text-gray-500"
              )}
            >
              {title}
            </h2>
            {description && (
              <p className={cn(
                "text-sm text-gray-600 mb-2 line-clamp-2",
                isPrivate && "text-gray-400"
              )}>
                {description}
              </p>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <span className={cn(
                "text-sm font-medium",
                isPrivate && "text-gray-400"
              )}>
                ?? {duration} minutes
              </span>
            </div>
            <Link
              target="_blank"
              to={event_link}
              rel="noopener noreferrer"
              className={cn(
                `pt-3 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 transition-colors`,
                isPrivate && "pointer-events-none opacity-60"
              )}
            >
              View booking page
              <ExternalLinkIcon className="w-3 h-3" />
            </Link>
          </div>
        </CardContent>
        <CardFooter
          className="p-[12px_16px] 
        border-t border-gray-200 h-full flex items-center justify-between bg-gray-50/50"
        >
          <Button
            variant="ghost"
            disabled={isPrivate}
            className="flex items-center gap-2 cursor-pointer font-medium text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50
            disabled:text-gray-400 disabled:bg-gray-100 disabled:opacity-100 transition-colors"
            onClick={handleCopyLink}
          >
            <CopyIcon className="w-4 h-4" />
            <span>{isCopied ? "? Copied!" : "Copy link"}</span>
          </Button>

          <Button
            variant="outline"
            className={cn(
              "!p-[8px_16px] text-sm font-medium !h-[37px] cursor-pointer disabled:pointer-events-none border-2 transition-all",
              isPrivate 
                ? "!border-green-500 !text-green-600 hover:bg-green-50" 
                : "!border-orange-500 !text-orange-600 hover:bg-orange-50"
            )}
            disabled={isPending}
            onClick={onToggle}
          >
            {isPending ? (
              <Loader size="sm" color="black" />
            ) : (
              <span>{isPrivate ? "?? Turn On" : "?? Turn Off"}</span>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event <strong>"{title}"</strong>. All associated bookings and data will be lost.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <Loader size="sm" color="white" />
                  Deleting...
                </span>
              ) : (
                "Delete Event"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventCard;
