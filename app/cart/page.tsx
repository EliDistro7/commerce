"use client";

import {
  CustomButton,
  QuantityInput,
  QuantityInputCart,
  SectionTitle,
} from "@/components";
import Image from "next/image";
import React from "react";
import { FaCheck, FaClock, FaCircleQuestion, FaXmark } from "react-icons/fa6";
import { useProductStore } from "../_zustand/store";
import Link from "next/link";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

const CartPage = () => {
  const { products, removeFromCart, calculateTotals, total } = useProductStore();
  const { language } = useLanguage();

  // Bilingual content
  const translations = {
    pageTitle: {
      en: "Cart Page",
      sw: "Kikapu",
    },
    shoppingCart: {
      en: "Shopping Cart",
      sw: "Kikapu cha Ununuzi",
    },
    inStock: {
      en: "In stock",
      sw: "Ipo stoo",
    },
    shipsIn: {
      en: "Ships in 3 days",
      sw: "Inatumwa kwa siku 3",
    },
    orderSummary: {
      en: "Order summary",
      sw: "Muhtasari wa Oda",
    },
    subtotal: {
      en: "Subtotal",
      sw: "Jumla Ndogo",
    },
    shippingEstimate: {
      en: "Shipping estimate",
      sw: "Makadirio ya Usafirishaji",
    },
    taxEstimate: {
      en: "Tax estimate",
      sw: "Makadirio ya Kodi",
    },
    orderTotal: {
      en: "Order total",
      sw: "Jumla ya Oda",
    },
    checkout: {
      en: "CHECKOUT",
      sw: "LIPA",
    },
    learnMoreShipping: {
      en: "Learn more about how shipping is calculated",
      sw: "Jifunze zaidi jinsi usafirishaji unavyokokotolewa",
    },
    learnMoreTax: {
      en: "Learn more about how tax is calculated",
      sw: "Jifunze zaidi jinsi kodi inavyokokotolewa",
    },
    removeItem: {
      en: "Remove",
      sw: "Ondoa",
    },
    productRemoved: {
      en: "Product removed from the cart",
      sw: "Bidhaa imeondolewa kwenye kikapu",
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    calculateTotals();
    toast.success(translations.productRemoved[language]);
  };

  return (
    <div className="bg-accent-ivory">
      <SectionTitle title={translations.pageTitle[language]} path="Home | Cart" />
      <div className="bg-accent-ivory">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-heading tracking-tight text-primary-700 sm:text-4xl">
            {translations.shoppingCart[language]}
          </h1>
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                {translations.shoppingCart[language]}
              </h2>

              <ul
                role="list"
                className="divide-y divide-neutral-200 border-b border-t border-neutral-200 bg-white shadow-soft rounded-lg overflow-hidden"
              >
                {products.map((product) => (
                  <li key={product.id} className="flex py-6 sm:py-10 px-4">
                    <div className="flex-shrink-0">
                      <Image
                        width={192}
                        height={192}
                        src={product?.image ? `/${product.image}` : "/product_placeholder.jpg"}
                        alt="product image"
                        className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48 shadow-soft"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link
                                href={`#`}
                                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                              >
                                {product.title}
                              </Link>
                            </h3>
                          </div>
                          <p className="mt-1 text-sm font-medium text-secondary-600">
                            ${product.price}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <QuantityInputCart product={product} />
                          <div className="absolute right-0 top-0">
                            <button
                              onClick={() => handleRemoveItem(product.id)}
                              type="button"
                              className="-m-2 inline-flex p-2 text-neutral-400 hover:text-error-500 transition-colors"
                            >
                              <span className="sr-only">{translations.removeItem[language]}</span>
                              <FaXmark className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 flex space-x-2 text-sm text-neutral-700">
                        {1 ? (
                          <FaCheck
                            className="h-5 w-5 flex-shrink-0 text-success-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <FaClock
                            className="h-5 w-5 flex-shrink-0 text-neutral-300"
                            aria-hidden="true"
                          />
                        )}

                        <span>{1 ? translations.inStock[language] : translations.shipsIn[language]}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-lg bg-primary-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 shadow-layer border border-primary-100"
            >
              <h2
                id="summary-heading"
                className="text-lg font-display text-primary-700"
              >
                {translations.orderSummary[language]}
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-neutral-600">{translations.subtotal[language]}</dt>
                  <dd className="text-sm font-medium text-primary-700">
                    TZS {total}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
                  <dt className="flex items-center text-sm text-neutral-600">
                    <span>{translations.shippingEstimate[language]}</span>
                    <a
                      href="#"
                      className="ml-2 flex-shrink-0 text-neutral-400 hover:text-secondary-500 transition-colors"
                    >
                      <span className="sr-only">
                        {translations.learnMoreShipping[language]}
                      </span>
                      <FaCircleQuestion
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </a>
                  </dt>
                 
                </div>
              {/*  
              <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
                  <dt className="flex text-sm text-neutral-600">
                    <span>{translations.taxEstimate[language]}</span>
                    <a
                      href="#"
                      className="ml-2 flex-shrink-0 text-neutral-400 hover:text-secondary-500 transition-colors"
                    >
                      <span className="sr-only">
                        {translations.learnMoreTax[language]}
                      </span>
                      <FaCircleQuestion
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </a>
                  </dt>
                  <dd className="text-sm font-medium text-primary-700">
                    ${total / 5}
                  </dd>
                </div>
                */}
                <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
                  <dt className="text-base font-display text-primary-700">
                    {translations.orderTotal[language]}
                  </dt>
                  <dd className="text-base font-medium text-primary-700">
                    TZS {total === 0 ? 0 : Math.round(total + total / 5 )}
                  </dd>
                </div>
              </dl>
              {products.length > 0 && (
                <div className="mt-6">
                  <Link
                    href="/checkout"
                    className=" justify-center items-center w-full uppercase bg-secondary-500 px-4 py-3 text-base font-medium text-white rounded-lg shadow-glow hover:bg-secondary-600 transition-all focus:outline-none focus:ring-2 focus:ring-secondary-300"
                  >
                    <span>{translations.checkout[language]}</span>
                  </Link>
                </div>
              )}
            </section>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CartPage;