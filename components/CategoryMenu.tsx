"use client";
import Link from "next/link";
import Image from "next/image";
import { categoryMenuList } from "@/lib/utils";

const CategoryMenu = () => {
  return (
    <section className="bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-primary-800 text-center mb-8">
          Explore Tanzanian Flavors
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categoryMenuList.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group bg-white border-2 border-neutral-200 rounded-xl p-6 hover:border-primary-500 
                       transition-all duration-300 hover:shadow-layer flex flex-col items-center"
              aria-label={`Explore ${category.title}`}
            >
              <div className="mb-4 p-3 bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center
                            group-hover:bg-primary-100 transition-colors">
                <Image
                  src={category.src}
                  alt={category.title}
                  width={48}
                  height={48}
                  className="w-8 h-8 object-contain"
                />
              </div>
              
              <h3 className="font-semibold text-neutral-800 text-center mb-1 group-hover:text-primary-600 transition-colors">
                {category.title}
              </h3>
              <p className="text-sm text-secondary-600 font-medium">
                Explore →
              </p>
            </Link>
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center">
          <div className="h-1 w-24 bg-primary-500 rounded-full" />
          <div className="h-1 w-24 bg-accent-chili rounded-full mx-4" />
          <div className="h-1 w-24 bg-accent-turmeric rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default CategoryMenu;