export const categoryMenuList = [
  {
    id: 1,
    title: "Ugali & Wali",
    src: "/ugali-samaki.webp",
    href: "/shop/ugali-wali"
  },
  {
    id: 2,
    title: "Nyama Choma",
    src: "/nyama-choma.webp",
    href: "/shop/nyama-choma"
  },
  {
    id: 3,
    title: "Mishkaki",
    src: "/mishkaki.webp",
    href: "/shop/mishkaki"
  },
  {
    id: 4,
    title: "Samaki wa Kupaka",
    src: "/fish-icon.png",
    href: "/shop/samaki"
  },
  {
    id: 5,
    title: "Chipsi Mayai",
    src: "/chipsi-mayai.webp",
    href: "/shop/chipsi-mayai"
  },
  {
    id: 6,
    title: "Pilau & Biryani",
    src: "/pilau-icon.png",
    href: "/shop/pilau-biryani"
  },
  {
    id: 7,
    title: "Supu & Mchuzi",
    src: "/soup-icon.png",
    href: "/shop/soups-stews"
  },
  {
    id: 8,
    title: "Viazi Karai",
    src: "/viazi-icon.png",
    href: "/shop/viazi-karai"
  },
  {
    id: 9,
    title: "Mandazi & Kaimati",
    src: "/mandazi-icon.png",
    href: "/shop/swahili-snacks"
  },
  {
    id: 10,
    title: "Uji na Vitumbua",
    src: "/uji-icon.png",
    href: "/shop/breakfast"
  },
  {
    id: 11,
    title: "Mboga za Kienyeji",
    src: "/vegetables-icon.png",
    href: "/shop/local-vegetables"
  },
  {
    id: 12,
    title: "Vinywaji",
    src: "/drinks-icon.png",
    href: "/shop/beverages"
  }
];

export const incentives = [
  {
    name: "Free Shipping",
    description:
      "Our shipping is completely free and that is completely good for our customers.",
    imageSrc: "/shipping icon.png",
  },
  {
    name: "24/7 Customer Support",
    description:
      "Our support is working all day and night to answer any question you have.",
    imageSrc: "/support icon.png",
  },
  {
    name: "Fast Shopping Cart",
    description:
      "We have super fast shopping experience and you will enjoy it.",
    imageSrc: "/fast shopping icon.png",
  },
];

export const navigation = {
  sale: [
    { name: "Discounts", href: "#" },
    { name: "News", href: "#" },
    { name: "Register Discounts", href: "#" },
  ],
  about: [
    { name: "About Singitronic", href: "#" },
    { name: "Work With Us", href: "#" },
    { name: "Company Profile", href: "#" },
  ],
  buy: [
    { name: "Singitronic Loyalty Card", href: "#" },
    { name: "Terms Of Use", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Complaints", href: "#" },
    { name: "Partners", href: "#" },
  ],
  help: [
    { name: "Contact", href: "#" },
    { name: "How to Buy at Singitronic", href: "#" },
    { name: "FAQ", href: "#" },
  ],
};

export const isValidNameOrLastname = (input: string) => {
  // Simple name or lastname regex format check
  const regex = /^[a-zA-Z\s]+$/;
  return regex.test(input);
};

export const isValidEmailAddressFormat = (input: string) => {
  // simple email address format check
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(input);
};

export const isValidCardNumber = (input: string) => {
  // Remove all non-digit characters
  const cleanedInput = input.replace(/[^0-9]/g, "");
  // test for credit card number between 13 and 19 characters
  const regex = /^\d{13,19}$/;
  return regex.test(cleanedInput);
}

export const isValidCreditCardExpirationDate = (input: string) => {
  // simple expiration date format check
  const regex = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
  return regex.test(input);
};

export const isValidCreditCardCVVOrCVC = (input: string) => {
  // simple CVV or CVC format check
  const regex = /^[0-9]{3,4}$/;
  return regex.test(input);
};
