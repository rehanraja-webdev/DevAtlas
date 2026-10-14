import { PublicNavbar } from "./PublicNavbar.jsx";
import { PublicFooter } from "./PublicFooter.jsx";

export const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <PublicNavbar />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
};
