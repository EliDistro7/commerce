"use client";
import { CustomButton, SectionTitle } from "@/components";
import { isValidEmailAddressFormat } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const { data: session, status: sessionStatus } = useSession();
  const { language } = useLanguage();

  // Bilingual content
  const translations = {
    title: {
      en: "Welcome Back",
      sw: "Karibu Tena",
    },
    subtitle: {
      en: "Sign in to your account to continue",
      sw: "Ingia kwenye akaunti yako kuendelea",
    },
    email: {
      label: {
        en: "Email address",
        sw: "Anwani ya barua pepe",
      },
      placeholder: {
        en: "Your email address",
        sw: "Anwani yako ya barua pepe",
      },
    },
    password: {
      label: {
        en: "Password",
        sw: "Nenosiri",
      },
      placeholder: {
        en: "Your password",
        sw: "Nenosiri lako",
      },
    },
    forgotPassword: {
      en: "Forgot password?",
      sw: "Umesahau nenosiri?",
    },
    rememberMe: {
      en: "Remember me",
      sw: "Nikumbuke",
    },
    signIn: {
      en: "Sign in",
      sw: "Ingia",
    },
    orContinueWith: {
      en: "Or continue with",
      sw: "Au endelea na",
    },
    dontHaveAccount: {
      en: "Don't have an account?",
      sw: "Huna akaunti?",
    },
    signUp: {
      en: "Sign up",
      sw: "Jisajili",
    },
    errors: {
      invalidEmail: {
        en: "Email is invalid",
        sw: "Barua pepe si sahihi",
      },
      invalidPassword: {
        en: "Password is invalid",
        sw: "Nenosiri si sahihi",
      },
      invalidCredentials: {
        en: "Invalid email or password",
        sw: "Barua pepe au nenosiri si sahihi",
      },
    },
    success: {
      login: {
        en: "Successful login",
        sw: "Umeingia kwa mafanikio",
      },
    },
  };

  useEffect(() => {
    // if user has already logged in redirect to home page
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmailAddressFormat(email)) {
      setError(translations.errors.invalidEmail[language]);
      toast.error(translations.errors.invalidEmail[language]);
      return;
    }

    if (!password || password.length < 8) {
      setError(translations.errors.invalidPassword[language]);
      toast.error(translations.errors.invalidPassword[language]);
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(translations.errors.invalidCredentials[language]);
      toast.error(translations.errors.invalidCredentials[language]);
      if (res?.url) router.replace("/");
    } else {
      setError("");
      toast.success(translations.success.login[language]);
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent-ivory">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-primary-50 to-accent-ivory min-h-screen">
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sm:mx-auto sm:w-full sm:max-w-md"
        >
          <h2 className="mt-6 text-center text-3xl font-heading font-semibold leading-9 tracking-tight text-primary-700">
            {translations.title[language]}
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-600">
            {translations.subtitle[language]}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]"
        >
          <div className="bg-white px-6 py-10 shadow-soft rounded-xl sm:px-12 border border-primary-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-primary-700"
                >
                  {translations.email.label[language]}
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-lg border-0 py-2.5 px-4 text-neutral-800 shadow-sm ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm transition-all duration-200"
                    placeholder={translations.email.placeholder[language]}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-primary-700"
                  >
                    {translations.password.label[language]}
                  </label>
                  <div className="text-sm leading-6">
                    <a
                      href="#"
                      className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
                    >
                      {translations.forgotPassword[language]}
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-lg border-0 py-2.5 px-4 text-neutral-800 shadow-sm ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm transition-all duration-200"
                    placeholder={translations.password.placeholder[language]}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500 transition-colors"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-3 block text-sm leading-6 text-neutral-600"
                >
                  {translations.rememberMe[language]}
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-lg bg-primary-500 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 transition-all duration-200 hover:shadow-md"
                >
                  {translations.signIn[language]}
                </button>
              </div>
            </form>

            <div>
              <div className="relative mt-10">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-neutral-500">
                    {translations.orContinueWith[language]}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-neutral-800 shadow-sm hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 transition-all duration-200"
                  onClick={() => signIn("google")}
                >
                  <FcGoogle className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Google
                  </span>
                </button>

                <button
                  className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#24292F] px-3 py-2.5 text-white shadow-sm hover:bg-[#1a1f24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] transition-all duration-200"
                  onClick={() => signIn("github")}
                >
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    GitHub
                  </span>
                </button>
              </div>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-3 rounded-lg bg-error-50 border border-error-100 text-error-700 text-center text-sm"
                >
                  {error}
                </motion.div>
              )}
              
              <div className="mt-6 text-center text-sm text-neutral-500">
                {translations.dontHaveAccount[language]}{" "}
                <a href="/register" className="font-medium text-primary-500 hover:text-primary-600 transition-colors">
                  {translations.signUp[language]}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;