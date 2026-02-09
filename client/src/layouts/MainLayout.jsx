import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-40 mx-auto max-w-7xl min-h-screen text-slate-900">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
