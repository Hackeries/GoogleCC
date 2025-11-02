import { SignInForm } from "./components/sign-in-form";
import { motion } from "framer-motion";
import { Command } from "lucide-react";
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex aspect-square size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-2xl"
          >
            <Command className="size-7" />
          </motion.div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-gray-600">
              Sign in to access your calendar and manage meetings
            </p>
          </div>
        </div>

        {/* Sign In Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8"
        >
          <SignInForm />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6 text-sm text-gray-600"
        >
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
          >
            Sign up
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignIn;
