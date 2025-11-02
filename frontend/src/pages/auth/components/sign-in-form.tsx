// pages/auth/components/sign-in-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePaths";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useStore } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import { loginMutationFn } from "@/lib/api";
import { toast } from "sonner";
import { Loader } from "@/components/loader";
import { useState } from "react";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm({
  className,
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const { setUser, setAccessToken, setExpiresAt } = useStore();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: SignInFormValues) => {
    if (isPending) return;
    mutate(values, {
      onSuccess: (data) => {
        setUser(data.user);
        setAccessToken(data.accessToken);
        setExpiresAt(data.expiresAt);
        toast.success("Logged in successfully 🚀");
        navigate(PROTECTED_ROUTES.CALENDAR);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to login");
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-5 w-full", className)}
      >
        {/* Email Field */}
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label className="font-medium text-sm">Email address</Label>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="you@example.com"
                  className="transition-all focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label className="font-medium text-sm">Password</Label>
              <div className="relative">
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10 transition-all focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-gray-500" />
                  ) : (
                    <Eye size={16} className="text-gray-500" />
                  )}
                </Button>
              </div>
              <div className="text-right text-xs mt-1">
                <Link
                  to="#"
                  className="text-blue-600 hover:underline hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          disabled={isPending}
          type="submit"
          className="w-full font-semibold tracking-wide"
        >
          {isPending ? (
            <Loader color="white" />
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" /> Sign in
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative text-center text-sm text-muted-foreground">
          <span className="bg-white px-3 relative z-10">Or continue with</span>
          <div className="absolute left-0 top-1/2 w-full border-t border-gray-200 z-0" />
        </div>

        {/* Google Sign In */}
        <Button
          variant="outline"
          type="button"
          className="w-full flex gap-2 items-center justify-center hover:bg-gray-50 transition-all"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Google
        </Button>
      </form>
    </Form>
  );
}
