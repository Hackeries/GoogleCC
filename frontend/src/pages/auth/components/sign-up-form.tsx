import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Command, Eye, EyeOff } from "lucide-react";
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

// ✅ Zod Schema
const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm({
  className,
  ...props
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
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit = (values: SignUpFormValues) => {
    if (isPending) return;
    mutate(values, {
      onSuccess: () => {
        toast.success("🎉 Registered successfully!");
        navigate(AUTH_ROUTES.SIGN_IN);
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.message || "Failed to sign up");
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn("flex flex-col gap-6 w-full", className)}
      {...props}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* 🔹 Header */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-col items-center gap-3"
          >
            <Link
              to="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <motion.div
                whileHover={{ rotate: 15 }}
                className="flex aspect-square size-10 items-center justify-center 
                rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
              >
                <Command className="size-5" />
              </motion.div>
              <span className="sr-only">GCC</span>
            </Link>
            <h2 className="text-2xl font-bold text-[#0a2540] text-center">
              Create your account
            </h2>
            <p className="text-sm text-gray-500 text-center">
              Start scheduling your meetings!
            </p>
          </motion.div>

          {/* 🔹 Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white flex flex-col gap-5 rounded-xl p-8 shadow-md border border-gray-200"
          >
            {/* Email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="font-semibold text-sm">Email</Label>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="www.myalgorise.in"
                      className="focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="font-semibold text-sm">Full Name</Label>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="ItssAJ"
                      className="focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password with toggle */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="font-semibold text-sm">Password</Label>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Bennett@#89293428"
                        className="focus:ring-2 focus:ring-primary focus:border-primary pr-10 transition-all"
                      />
                    </FormControl>
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-800"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex items-center justify-end">
              <Button
                disabled={isPending}
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 transition-all"
              >
                {isPending ? <Loader size="sm" color="white" /> : "Sign Up"}
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to={AUTH_ROUTES.SIGN_IN}
                className="underline underline-offset-4 text-primary hover:text-primary/80"
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
