"use client";
import { CustomButton, SectionTitle } from "@/components";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { language } = useLanguage();

  // Bilingual content
  const translations = {
    title: {
      en: "Create an Account",
      sw: "Fungua Akaunti",
    },
    subtitle: {
      en: "Join our community and start shopping",
      sw: "Jiunge na jamii yetu na anza kununua",
    },
    pageTitle: {
      en: "Register",
      sw: "Jisajili",
    },
    pagePath: {
      en: "Home | Register",
      sw: "Nyumbani | Jisajili",
    },
    firstName: {
      label: {
        en: "First Name",
        sw: "Jina la Kwanza",
      },
      placeholder: {
        en: "Your first name",
        sw: "Jina lako la kwanza",
      },
    },
    lastName: {
      label: {
        en: "Last Name",
        sw: "Jina la Familia",
      },
      placeholder: {
        en: "Your last name",
        sw: "Jina lako la familia",
      },
    },
    email: {
      label: {
        en: "Email Address",
        sw: "Anwani ya Barua Pepe",
      },
      placeholder: {
        en: "your.email@example.com",
        sw: "barua.pepe@mfano.com",
      },
    },
    password: {
      label: {
        en: "Password",
        sw: "Nenosiri",
      },
      placeholder: {
        en: "Choose a secure password",
        sw: "Chagua nenosiri salama",
      },
      requirement: {
        en: "Password must be at least 8 characters long",
        sw: "Nenosiri lazima liwe na angalau herufi 8",
      },
    },
    confirmPassword: {
      label: {
        en: "Confirm Password",
        sw: "Thibitisha Nenosiri",
      },
      placeholder: {
        en: "Re-enter your password",
        sw: "Ingiza tena nenosiri lako",
      },
    },
    terms: {
      en: "I agree to the",
      sw: "Nakubali",
    },
    termsOfService: {
      en: "Terms of Service",
      sw: "Masharti ya Huduma",
    },
    and: {
      en: "and",
      sw: "na",
    },
    privacyPolicy: {
      en: "Privacy Policy",
      sw: "Sera ya Faragha",
    },
    createAccount: {
      en: "Create Account",
      sw: "Fungua Akaunti",
    },
    alreadyHaveAccount: {
      en: "Already have an account?",
      sw: "Una akaunti tayari?",
    },
    signIn: {
      en: "Sign in",
      sw: "Ingia",
    },
    loading: {
      en: "Loading...",
      sw: "Inapakia...",
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
      passwordsNotEqual: {
        en: "Passwords are not equal",
        sw: "Manenosiri hayalingani",
      },
      emailInUse: {
        en: "The email already in use",
        sw: "Barua pepe tayari inatumika",
      },
      tryAgain: {
        en: "Error, try again",
        sw: "Hitilafu, jaribu tena",
      },
    },
    success: {
      registration: {
        en: "Registration successful",
        sw: "Usajili umefanikiwa",
      },
    },
  };

  useEffect(() => {
    // checking if user has already registered redirect to home page
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[2].value;
    const password = e.target[3].value;
    const confirmPassword = e.target[4].value;

    if (!isValidEmail(email)) {
      setError(translations.errors.invalidEmail[language]);
      toast.error(translations.errors.invalidEmail[language]);
      return;
    }

    if (!password || password.length < 8) {
      setError(translations.errors.invalidPassword[language]);
      toast.error(translations.errors.invalidPassword[language]);
      return;
    }

    if (confirmPassword !== password) {
      setError(translations.errors.passwordsNotEqual[language]);
      toast.error(translations.errors.passwordsNotEqual[language]);
      return;
    }

    try {
      // sending API request for registering user
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (res.status === 400) {
        toast.error(translations.errors.emailInUse[language]);
        setError(translations.errors.emailInUse[language]);
      }
      if (res.status === 200) {
        setError("");
        toast.success(translations.success.registration[language]);
        router.push("/login");
      }
    } catch (error) {
      toast.error(translations.errors.tryAgain[language]);
      setError(translations.errors.tryAgain[language]);
      console.log(error);
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent-ivory">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-4 text-primary-600 font-medium">{translations.loading[language]}</span>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-primary-50 to-accent-ivory min-h-screen">
      <SectionTitle title={translations.pageTitle[language]} path={translations.pagePath[language]} />
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
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-[520px]"
        >
          <div className="bg-white px-6 py-10 shadow-soft rounded-xl sm:px-12 border border-primary-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-primary-700"
                  >
                    {translations.firstName.label[language]}
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder={translations.firstName.placeholder[language]}
                      className="block w-full rounded-lg border-0 py-2.5 px-4 text-neutral-800 shadow-sm ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastname"
                    className="block text-sm font-medium leading-6 text-primary-700"
                  >
                    {translations.lastName.label[language]}
                  </label>
                  <div className="mt-2">
                    <input
                      id="lastname"
                      name="lastname"
                      type="text"
                      required
                      placeholder={translations.lastName.placeholder[language]}
                      className="block w-full rounded-lg border-0 py-2.5 px-4 text-neutral-800 shadow-sm ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

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
                    placeholder={translations.email.placeholder[language]}
                    className="block w-full rounded-lg border-0 py-2.5 px-4 text-neutral-800 shadow-sm ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-primary-700"
                >
                  {translations.password.label[language]}
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder={translations.password.placeholder[language]}
                    className="block w-full rounded-lg border-0 py-2.5 px-4 text-neutral-800 shadow-sm ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm transition-all duration-200"
                  />
                  <p className="mt-1 text-xs text-neutral-500">
                    {translations.password.requirement[language]}
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmpassword"
                  className="block text-sm font-medium leading-6 text-primary-700"
                >
                  {translations.confirmPassword.label[language]}
                </label>
                <div className="mt-2">
                  <input
                    id="confirmpassword"
                    name="confirmpassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder={translations.confirmPassword.placeholder[language]}
                    className="block w-full rounded-lg border-0 py-2.5 px-4 text-neutral-800 shadow-sm ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500 transition-colors"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="text-neutral-600"
                  >
                    {translations.terms[language]}{" "}
                    <a href="/terms" className="font-medium text-primary-500 hover:text-primary-600 transition-colors">
                      {translations.termsOfService[language]}
                    </a>{" "}
                    {translations.and[language]}{" "}
                    <a href="/privacy" className="font-medium text-primary-500 hover:text-primary-600 transition-colors">
                      {translations.privacyPolicy[language]}
                    </a>
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-lg bg-primary-500 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 transition-all duration-200 hover:shadow-md"
                >
                  {translations.createAccount[language]}
                </button>
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-3 rounded-lg bg-error-50 border border-error-100 text-error-700 text-center text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
            </form>
            
            <div className="mt-6 text-center text-sm text-neutral-500">
              {translations.alreadyHaveAccount[language]}{" "}
              <a href="/login" className="font-medium text-primary-500 hover:text-primary-600 transition-colors">
                {translations.signIn[language]}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;