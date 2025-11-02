import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { useStore } from "@/store/store";
import { loginMutationFn } from "@/lib/api";
import { PROTECTED_ROUTES } from "@/routes/common/routePaths";

// ✅ Import correct backend types
import { loginType, LoginResponseType, ApiError } from "@/types/api.type";

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

  // ✅ Fix types to match backend definitions
  const { mutate, isPending } = useMutation<
    LoginResponseType,
    ApiError,
    loginType
  >({
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

  // ✅ Email/Password Login
  const onSubmit = (values: SignInFormValues) => {
    if (isPending) return;
    mutate(values, {
      onSuccess: (data) => {
        // 🧩 Map API user type → Zustand expected user type
        setUser({
          id: data.user.id,
          name: data.user.name,
          username: data.user.username || data.user.name, // fallback for backend mismatch
          email: data.user.email,
          imageUrl: null,
        });


        setAccessToken(data.accessToken);
        setExpiresAt(data.expiresAt); // already a number now

        toast.success("Logged in successfully 🚀");
        navigate(PROTECTED_ROUTES.CALENDAR);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to login. Try again!");
      },
    });
  };

  // ✅ Google OAuth Login
  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse: TokenResponse) => {
      try {
        const googleAccessToken = tokenResponse.access_token;
        const apiUrl = import.meta.env.VITE_API_URL;

        const res = await fetch(`${apiUrl}/auth/google/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: googleAccessToken }),
        });

        if (!res.ok) throw new Error("Google login failed");
        const data: LoginResponseType = await res.json();

        setUser({
          id: data.user.id,
          name: data.user.name,
          username: data.user.username || data.user.name, // fallback for backend mismatch
          email: data.user.email,
          imageUrl: null,
        });

        setAccessToken(data.accessToken);
        setExpiresAt(data.expiresAt);

        toast.success("Logged in with Google 🎉");
        navigate(PROTECTED_ROUTES.CALENDAR);
      } catch (err) {
        console.error(err);
        toast.error("Google login failed. Please try again.");
      }
    },
    onError: () => toast.error("Google sign-in was cancelled or failed."),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-6 w-full", className)}
      >
        {/* Email */}
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

        {/* Password */}
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

        {/* Submit */}
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

        {/* Google */}
        <Button
          variant="outline"
          type="button"
          onClick={() => googleLogin()}
          className="w-full flex gap-2 items-center justify-center hover:bg-gray-50 transition-all"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </Button>
      </form>
    </Form>
  );
}
