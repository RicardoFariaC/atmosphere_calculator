import { Calculator, FileQuestion, LineChart, Table } from "lucide-react";

export default function NavBar() {
  return (
      <aside className="w-auto">
      <nav className="bg-zinc-900 space-y-2 sticky top-3 p-6 m-3 rounded-md">
        <a href="/" className="flex items-center gap-2 hover:bg-slate-300 hover:bg-opacity-20 py-4 px-2 rounded-md">
          <Calculator />
          Calculator
        </a>
        <a href="/nav/table" className="flex items-center gap-2 hover:bg-slate-300 hover:bg-opacity-20 py-4 px-2 rounded-md">
          <Table />
          Table
        </a>
        <a href="/nav/graph" className="flex items-center gap-2 hover:bg-slate-300 hover:bg-opacity-20 py-4 px-2 rounded-md">
          <LineChart />
          Graphs
        </a>
        <a href="/nav/help" className="flex items-center gap-2 hover:bg-slate-300 hover:bg-opacity-20 py-4 px-2 rounded-md">
          <FileQuestion />
          Help
        </a>
      </nav>
    </aside>
  );
}