import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-neutral-200 bg-white p-4">
      <nav className="space-y-2 text-sm">
        <Link href="/" className="block rounded-md px-3 py-2 hover:bg-neutral-100">
          Dashboard
        </Link>
        <Link href="/products" className="block rounded-md px-3 py-2 hover:bg-neutral-100">
          Products
        </Link>
        <Link href="/orders" className="block rounded-md px-3 py-2 hover:bg-neutral-100">
          Orders
        </Link>
        <Link href="/inventory" className="block rounded-md px-3 py-2 hover:bg-neutral-100">
          Inventory
        </Link>
        <Link href="/settings" className="block rounded-md px-3 py-2 hover:bg-neutral-100">
          Settings
        </Link>
      </nav>
    </aside>
  );
}
