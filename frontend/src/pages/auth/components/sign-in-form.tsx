// pages/auth/components/sign-in-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Command, Eye, EyeOff, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "@/routes/common/routePaths";
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
import { motion } from "framer-motion";
import { useState } from "react";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm({
  className,
  ...props
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("flex flex-col gap-6 w-full", className)}
      {...props}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-md mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-3">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg"
            >
              <Command className="size-6" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-[#0a2540]">
              Welcome back to Google Cal 1.1
            </h2>
            <p className="text-sm text-gray-500">
              Log in to access your calendar and meetings.
            </p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
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
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
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
            </div>

            {/* Submit Button */}
            <motion.div whileTap={{ scale: 0.98 }}>
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
            </motion.div>

            {/* Divider */}
            <div className="relative text-center text-sm text-muted-foreground">
              <span className="bg-white px-2 relative z-10">Or</span>
              <div className="absolute left-0 top-1/2 w-full border-t border-gray-200 z-0" />
            </div>

            {/* Google Sign In */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <Button
                variant="outline"
                className="w-full flex gap-2 items-center justify-center hover:bg-gray-100"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </Button>
            </motion.div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to={AUTH_ROUTES.SIGN_UP}
                className="text-blue-600 font-medium hover:underline"
              >
                Sign up
              </Link>
            </div>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
