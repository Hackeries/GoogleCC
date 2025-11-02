// pages/auth/components/sign-up-form.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Command, Eye, EyeOff, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
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

// ✅ Validation schema
const signUpSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm({
  className,
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useMutation({
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

  const onSubmit = (values: SignUpFormValues) => {
    if (isPending) return;
    mutate(values, {
      onSuccess: () => {
        toast.success("🎉 Account created successfully!");
        navigate(AUTH_ROUTES.SIGN_IN);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to register");
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("flex flex-col gap-6 w-full", className)}
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
              Create your Google Cal 1.1 account
            </h2>
            <p className="text-sm text-gray-500">
              Start organizing your meetings efficiently.
            </p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col gap-6"
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
                      placeholder="Aviral Joshi"
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
                        placeholder="Enter a strong password"
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
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
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
                    <UserPlus className="mr-2 h-4 w-4" /> Sign up
                  </>
                )}
              </Button>
            </motion.div>

            {/* Divider */}
            <div className="relative text-center text-sm text-muted-foreground">
              <span className="bg-white px-2 relative z-10">Or</span>
              <div className="absolute left-0 top-1/2 w-full border-t border-gray-200 z-0" />
            </div>

            {/* Google OAuth (placeholder for now) */}
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
                Sign up with Google
              </Button>
            </motion.div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to={AUTH_ROUTES.SIGN_IN}
                className="text-blue-600 font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
