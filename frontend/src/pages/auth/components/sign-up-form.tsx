import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes/common/routePaths";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { registerMutationFn } from "@/lib/api";
import { toast } from "sonner";
import { Loader } from "@/components/loader";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { LoginResponseType } from "@/types/api.type";

// -------------------------
// 🧩 Validation Schema
// -------------------------
const signUpSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

// -------------------------
// 🧠 Component
// -------------------------
export function SignUpForm({
  className,
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Strict typing for mutation
  const { mutate, isPending } = useMutation<
    LoginResponseType,
    Error,
    SignUpFormValues
  >({
    mutationFn: registerMutationFn,
  });

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // ✅ Email/Password Signup
  const onSubmit = (values: SignUpFormValues) => {
    if (isPending) return;
    mutate(values, {
      onSuccess: () => {
        toast.success("🎉 Account created successfully!");
        navigate(AUTH_ROUTES.SIGN_IN);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to register");
      },
    });
  };

  // ✅ Google OAuth Signup
  const handleGoogleSignup = async (credentialResponse: CredentialResponse) => {
    const credential = credentialResponse?.credential;
    if (!credential) {
      toast.error("Google signup failed — no credentials received.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      });

      const data: LoginResponseType = await res.json();
      if (!res.ok) throw new Error(data?.message || "Google signup failed");

      toast.success("Signed up with Google 🎉");
      navigate(AUTH_ROUTES.SIGN_IN);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google signup failed";
      toast.error(message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-5 w-full", className)}
      >
        {/* Name */}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label className="font-medium text-sm">Full Name</Label>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="John Doe"
                  className="transition-all focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    placeholder="Create a strong password"
                    className="pr-10 transition-all focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-gray-500" />
                  ) : (
                    <Eye size={16} className="text-gray-500" />
                  )}
                </Button>
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
              <UserPlus className="mr-2 h-4 w-4" /> Create account
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative text-center text-sm text-muted-foreground">
          <span className="bg-white px-3 relative z-10">Or continue with</span>
          <div className="absolute left-0 top-1/2 w-full border-t border-gray-200 z-0" />
        </div>

        {/* Google OAuth */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSignup}
            onError={() => toast.error("Google sign-up failed")}
            shape="rectangular"
            size="large"
            theme="outline"
          />
        </div>
      </form>
    </Form>
  );
}