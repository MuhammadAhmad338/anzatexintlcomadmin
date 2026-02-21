import Header from "../components/header";
import Sidebar from "../components/sidebar";
import Footer from "../components/footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-neutral-50">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
