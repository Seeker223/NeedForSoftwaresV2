import { Link, useSearchParams } from "react-router-dom";
import Search from "./Search";

const SideMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (e) => {
    if (searchParams.get("sort") !== e.target.value) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        sort: e.target.value,
      });
    }
  };
  const handleCategoryChange = (category) => {
    if (searchParams.get("cat") !== category) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        cat:category,
      });
    }
  };


  return (
    <div className="px-4 h-max sticky top-8 bg-white/80 border border-slate-200/70 rounded-3xl p-4 shadow-card">
      <h1 className="mb-4 text-sm font-semibold text-slate-700">Search</h1>
      <Search />
      <h1 className="mt-8 mb-4 text-sm font-semibold text-slate-700">Filter</h1>
      <div className="flex flex-col gap-2 text-sm">
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="newest"
            className="appearance-none w-4 h-4 border-[1.5px] border-brand-700 cursor-pointer rounded-sm bg-white checked:bg-brand-700"
          />
          Newest
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="popular"
            className="appearance-none w-4 h-4 border-[1.5px] border-brand-700 cursor-pointer rounded-sm bg-white checked:bg-brand-700"
          />
          Most Popular
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="trending"
            className="appearance-none w-4 h-4 border-[1.5px] border-brand-700 cursor-pointer rounded-sm bg-white checked:bg-brand-700"
          />
          Trending
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="oldest"
            className="appearance-none w-4 h-4 border-[1.5px] border-brand-700 cursor-pointer rounded-sm bg-white checked:bg-brand-700"
          />
          Oldest
        </label>
      </div>
      <h1 className="mt-8 mb-4 text-sm font-semibold text-slate-700">Categories</h1>
      <div className="flex flex-col gap-2 text-sm">
        <span className="cursor-pointer text-slate-600 hover:text-brand-700 transition" onClick={()=>handleCategoryChange("general")}>All</span>
        <span className="cursor-pointer text-slate-600 hover:text-brand-700 transition" onClick={()=>handleCategoryChange("web-design")}>Web Design</span>
        <span className="cursor-pointer text-slate-600 hover:text-brand-700 transition" onClick={()=>handleCategoryChange("development")}>Development</span>
        <span className="cursor-pointer text-slate-600 hover:text-brand-700 transition" onClick={()=>handleCategoryChange("databases")}>Databases</span>
        <span className="cursor-pointer text-slate-600 hover:text-brand-700 transition" onClick={()=>handleCategoryChange("seo")}>Search Engines</span>
        <span className="cursor-pointer text-slate-600 hover:text-brand-700 transition" onClick={()=>handleCategoryChange("marketing")}>Marketing</span>
      </div>
    </div>
  );
};

export default SideMenu;
