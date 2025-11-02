import { SignUpForm } from "./components/sign-up-form";
import { motion } from "framer-motion";
import { Command } from "lucide-react";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[450px]"
      >
        {/* Header / Logo */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
          >
            <Command className="size-6" />
          </motion.div>

          <h1 className="text-2xl font-bold text-[#0a2540] text-center">
            Create your GCC account
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Start managing your calendar efficiently.
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <SignUpForm />
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-primary font-medium underline underline-offset-4 hover:text-primary/80"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
