import { Link } from "react-router-dom";
import Search from "./Search";

const MainCategories = () => {
  return (
    <div className="hidden md:flex bg-white/80 backdrop-blur rounded-3xl xl:rounded-full p-4 shadow-card items-center justify-center gap-8 border border-slate-200/60">
      {/* links */}
      <div className="flex-1 flex items-center justify-between flex-wrap">
        <Link
          to="/posts"
          className="bg-brand-700 text-white rounded-full px-4 py-2 shadow-soft hover:bg-brand-800 transition"
        >
          All Posts
        </Link>
        <Link
          to="/posts?cat=web-design"
          className="hover:bg-brand-50 rounded-full px-4 py-2 transition"
        >
          Web Design
        </Link>
        <Link
          to="/posts?cat=development"
          className="hover:bg-brand-50 rounded-full px-4 py-2 transition"
        >
          Development
        </Link>
        <Link
          to="/posts?cat=databases"
          className="hover:bg-brand-50 rounded-full px-4 py-2 transition"
        >
          Databases
        </Link>
        <Link
          to="/posts?cat=seo"
          className="hover:bg-brand-50 rounded-full px-4 py-2 transition"
        >
          Search Engines
        </Link>
        <Link
          to="/posts?cat=marketing"
          className="hover:bg-brand-50 rounded-full px-4 py-2 transition"
        >
          Marketing
        </Link>
      </div>
      <span className="text-xl font-medium text-slate-300">|</span>
      {/* search */}
      <Search/>
    </div>
  );
};

export default MainCategories;
