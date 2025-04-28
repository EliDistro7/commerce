const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

// Demo Categories
const demoCategories = [
  {
    id: "7a241318-624f-48f7-9921-1818f6c20d85",
    name: "main-dishes",
  },
  {
    id: "313eee86-bc11-4dc1-8cb0-6b2c2a2a1ccb",
    name: "traditional-stews",
  },
  {
    id: "782e7829-806b-489f-8c3a-2689548d7153",
    name: "street-food",
  },
  {
    id: "a6896b67-197c-4b2a-b5e2-93954474d8b4",
    name: "grilled-meats",
  },
  {
    id: "4c2cc9ec-7504-4b7c-8ecd-2379a854a423",
    name: "rice-dishes",
  },
  {
    id: "8d2a091c-4b90-4d60-b191-114b895f3e54",
    name: "snacks",
  },
  {
    id: "1cb9439a-ea47-4a33-913b-e9bf935bcc0b",
    name: "bbq",
  },
  {
    id: "ada699e5-e764-4da0-8d3e-18a8c8c5ed24",
    name: "soups",
  },
  {
    id: "d30b85e2-e544-4f48-8434-33fe0b591579",
    name: "salads",
  },
  {
    id: "6c3b8591-b01e-4842-bce1-2f5585bf3a28",
    name: "spiced-dishes",
  },
  {
    id: "659a91b9-3ff6-47d5-9830-5e7ac905b961",
    name: "breads",
  },
  {
    id: "3117a1b0-6369-491e-8b8b-9fdd5ad9912e",
    name: "breakfast",
  },
  {
    id: "da6413b4-22fd-4fbb-9741-d77580dfdcd5",
    name: "vegetarian"
  },
  {
    id: "ss6412b4-22fd-4fbb-9741-d77580dfdcd2",
    name: "seafood"
  },
  {
    id: "fs6412b4-22fd-4fbb-9741-d77512dfdfa3",
    name: "beverages"
  }
];

// Demo Products
// Demo Products
const demoProducts = [
  {
    id: "1",
    title: "Ugali na Samaki",
    price: 6000,
    rating: 5,
    description: "Traditional maize porridge served with grilled fish",
    mainImage: "ugali-samaki.webp",
    slug: "ugali-na-samaki",
    manufacturer: "Swahili Chef",
    categoryId: "7a241318-624f-48f7-9921-1818f6c20d85", // Main Dishes
    inStock: 1,
  },
  {
    id: "2",
    title: "Supu ya Ndizi",
    price: 3000,
    rating: 4,
    description: "Plantain banana stew with coconut milk",
    mainImage: "ndizi-stew.webp",
    slug: "mchuzi-wa-ndizi",
    manufacturer: "Zanzibar Foods",
    categoryId: "313eee86-bc11-4dc1-8cb0-6b2c2a2a1ccb", // Traditional Stews
    inStock: 1,
  },
  {
    id: "3",
    title: "Chipsi Mayai",
    price: 2500,
    rating: 5,
    description: "Popular street food of fries and eggs omelette",
    mainImage: "chipsi-mayai.webp",
    slug: "chipsi-mayai",
    manufacturer: "Street Bites",
    categoryId: "782e7829-806b-489f-8c3a-2689548d7153", // Street Food
    inStock: 1,
  },
  {
    id: "4",
    title: "Nyama Choma",
    price: 8000,
    rating: 5,
    description: "Grilled meat served with kachumbari salad",
    mainImage: "nyama-choma.webp",
    slug: "nyama-choma",
    manufacturer: "Arusha Grill",
    categoryId: "a6896b67-197c-4b2a-b5e2-93954474d8b4", // Grilled Meats
    inStock: 1,
  },
  {
    id: "5",
    title: "Wali wa Nazi",
    price: 3000,
    rating: 4,
    description: "Coconut rice with tropical spices",
    mainImage: "wali-wa-nazi.webp",
    slug: "wali-wa-nazi",
    manufacturer: "Coastal Kitchen",
    categoryId: "4c2cc9ec-7504-4b7c-8ecd-2379a854a423", // Rice Dishes
    inStock: 1,
  },
  {
    id: "6",
    title: "Mandazi",
    price: 200,
    rating: 4,
    description: "Sweet fried dough triangles - perfect with coffee",
    mainImage: "mandazi.webp",
    slug: "mandazi",
    manufacturer: "Mama Ashanti",
    categoryId: "8d2a091c-4b90-4d60-b191-114b895f3e54", // Snacks
    inStock: 1,
  },
  {
    id: "7",
    title: "Mishkaki",
    price: 500,
    rating: 5,
    description: "Marinated meat skewers grilled over charcoal",
    mainImage: "mishikaki.webp",
    slug: "mishkaki",
    manufacturer: "Zanzibar Street Grill",
    categoryId: "1cb9439a-ea47-4a33-913b-e9bf935bcc0b", // BBQ
    inStock: 1,
  },
  {
    id: "8",
    title: "Supu ya Ndizi",
    price: 4000,
    rating: 4,
    description: "Creamy green banana soup with local spices",
    mainImage: "supu-ndizi.webp",
    slug: "supu-ya-ndizi",
    manufacturer: "Healthy Choice",
    categoryId: "ada699e5-e764-4da0-8d3e-18a8c8c5ed24", // Soups
    inStock: 1,
  },
  {
    id: "9",
    title: "Kachumbari",
    price: 500,
    rating: 5,
    description: "Fresh tomato and onion salad with lime dressing",
    mainImage: "kachumbari.webp",
    slug: "kachumbari",
    manufacturer: "Fresh Salads Co",
    categoryId: "d30b85e2-e544-4f48-8434-33fe0b591579", // Salads
    inStock: 1,
  },
  {
    id: "10",
    title: "Pilau ya Kuku",
    price: 6000,
    rating: 5,
    description: "Spiced rice with chicken and raisins",
    mainImage: "pilau-kuku.webp",
    slug: "pilau-ya-kuku",
    manufacturer: "Swahili Chef",
    categoryId: "6c3b8591-b01e-4842-bce1-2f5585bf3a28", // Spiced Dishes
    inStock: 1,
  },
  {
    id: "11",
    title: "Chapati",
    price: 500,
    rating: 5,
    description: "Flaky fried flatbread - perfect with stews",
    mainImage: "chapati.webp",
    slug: "chapati",
    manufacturer: "Mama Nia",
    categoryId: "659a91b9-3ff6-47d5-9830-5e7ac905b961", // Breads
    inStock: 1,
  },
  {
    id: "12",
    title: "Uji wa Mtama",
    price: 1000,
    rating: 4,
    description: "Traditional finger millet porridge with peanut butter",
    mainImage: "uji-wa-mtama.webp",
    slug: "uji-wa-mtama",
    manufacturer: "Healthy Start",
    categoryId: "3117a1b0-6369-491e-8b8b-9fdd5ad9912e", // Breakfast
    inStock: 1,
  }
];

// Demo Users
const demoUsers = [
  {
    id: "user-1",
    email: "admin@example.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
  {
    id: "user-2",
    email: "user@example.com",
    password: bcrypt.hashSync("user123", 10),
    role: "user",
  },
  {
    id: "user-3",
    email: "customer@example.com",
    password: bcrypt.hashSync("customer123", 10),
    role: "user",
  }
];

// Demo Images
const demoImages = [
  {
    imageID: "img-1",
    productID: "1",
    image: "ugali-samaki-detail-1.webp"
  },
  {
    imageID: "img-2",
    productID: "1",
    image: "ugali-samaki-detail-2.webp"
  },
  {
    imageID: "img-3",
    productID: "4",
    image: "nyama-choma-detail-1.webp"
  }
];

// Demo Orders
// Demo Orders
const demoOrders = [
  {
    id: "order-1",
    name: "John",
    lastname: "Doe",
    phone: "+255712345678",
    email: "john@example.com",
    company: "ABC Company",
    adress: "123 Kariakoo Street",
    apartment: "Apt 4B",
    postalCode: "12345",
    city: "Dar es Salaam",
    country: "Tanzania",
    status: "delivered",
    total: 6400, // Updated total (6000 for Ugali na Samaki + 200×2 for Mandazi)
    orderNotice: "Please deliver to the security desk"
  },
  {
    id: "order-2",
    name: "Sarah",
    lastname: "Johnson",
    phone: "+255723456789",
    email: "sarah@example.com",
    company: "",
    adress: "456 Mwenge Road",
    apartment: "",
    postalCode: "54321",
    city: "Arusha",
    country: "Tanzania",
    status: "processing",
    total: 9500, // Updated total (8000 for Nyama Choma + 500×3 for Kachumbari)
    orderNotice: null
  }
];
// Demo Order Products
const demoOrderProducts = [
  {
    id: "op-1",
    customerOrderId: "order-1",
    productId: "1",
    quantity: 1
  },
  {
    id: "op-2",
    customerOrderId: "order-1",
    productId: "6",
    quantity: 2
  },
  {
    id: "op-3",
    customerOrderId: "order-2",
    productId: "4",
    quantity: 1
  },
  {
    id: "op-4",
    customerOrderId: "order-2",
    productId: "9",
    quantity: 3
  }
];

// Demo Notifications
const demoNotifications = [
  {
    id: "notif-1",
    userId: "user-2",
    text: "Your order has been shipped!",
    type: "info",
    read: false
  },
  {
    id: "notif-2",
    userId: "user-3",
    text: "New products are available in our store!",
    type: "promo",
    read: true
  },
  {
    id: "notif-3",
    userId: "user-1",
    text: "New order needs your approval",
    type: "alert",
    read: false
  }
];

// Demo Wishlist Items
const demoWishlistItems = [
  {
    id: "wish-1",
    productId: "4",
    userId: "user-2"
  },
  {
    id: "wish-2",
    productId: "7",
    userId: "user-2"
  },
  {
    id: "wish-3",
    productId: "10",
    userId: "user-3"
  }
];

async function insertDemoData() {
  try {
    // Categories
    for (const category of demoCategories) {
      await prisma.category.upsert({
        where: { id: category.id },
        update: {},
        create: category,
      });
    }
    console.log("Demo categories inserted successfully!");
    
    // Products
    for (const product of demoProducts) {
      await prisma.product.upsert({
        where: { id: product.id },
        update: {},
        create: product,
      });
    }
    console.log("Demo products inserted successfully!");
    
    // Users
    for (const user of demoUsers) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: user,
      });
    }
    console.log("Demo users inserted successfully!");
    
    // Images
    for (const image of demoImages) {
      await prisma.image.upsert({
        where: { imageID: image.imageID },
        update: {},
        create: image,
      });
    }
    console.log("Demo images inserted successfully!");
    
    // Orders
    for (const order of demoOrders) {
      await prisma.customer_order.upsert({
        where: { id: order.id },
        update: {},
        create: order,
      });
    }
    console.log("Demo orders inserted successfully!");
    
    // Order Products
    for (const orderProduct of demoOrderProducts) {
      await prisma.customer_order_product.upsert({
        where: { id: orderProduct.id },
        update: {},
        create: orderProduct,
      });
    }
    console.log("Demo order products inserted successfully!");
    
    // Notifications
    for (const notification of demoNotifications) {
      await prisma.notification.upsert({
        where: { id: notification.id },
        update: {},
        create: notification,
      });
    }
    console.log("Demo notifications inserted successfully!");
    
    // Wishlist Items
    for (const wishlistItem of demoWishlistItems) {
      await prisma.wishlist.upsert({
        where: { id: wishlistItem.id },
        update: {},
        create: wishlistItem,
      });
    }
    console.log("Demo wishlist items inserted successfully!");
    
    console.log("All demo data inserted successfully!");
  } catch (error) {
    console.error("Error inserting demo data:", error);
    throw error;
  }
}

insertDemoData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });