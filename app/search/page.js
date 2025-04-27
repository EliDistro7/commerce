// app/search/page.tsx (Server Component)
import { ProductItem, SectionTitle } from "@/components";
import prisma from "@/utils/db";
import SearchPageClient from './SearchPageClient'

const translations = {
  en: {
    searchPage: "Search Page",
    homePath: "Home | Search",
    showingResultsFor: "Showing results for",
    noProductsFound: "No products found",
    tryDifferentSearch: "We couldn't find any products matching \"{{search}}\". Please try a different search term."
  },
  sw: {
    searchPage: "Ukurasa wa Kutafuta",
    homePath: "Nyumbani | Tafuta",
    showingResultsFor: "Inaonyesha matokeo ya",
    noProductsFound: "Hakuna bidhaa zilizopatikana",
    tryDifferentSearch: "Hatukuweza kupata bidhaa zinazofanana na \"{{search}}\". Tafadhali jaribu maneno mengine ya kutafuta."
  }
};

export default async function SearchPage({ searchParams: { search } } ) {
  let products = [];
  
  // If search query exists, find matching products
  if (search) {
    products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      },
    });
  } else {
    products = await prisma.product.findMany({ take: 10 });
  }

  return (
    <SearchPageClient 
      products={products} 
      search={search} 
      translations={translations.en} // Default to English, language handled client-side
    />
  );
}