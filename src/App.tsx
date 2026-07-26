import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { Nav } from '@/lib/ui/Nav';
import { Badge } from '@/lib/ui/Badge';
import Dashboard from '@/pages/Dashboard';
import CoinDetail from '@/pages/CoinDetail';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Nav
          brand={
            <Link to="/" className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-foreground/80">
              <Activity size={18} />
              <span>Pulse</span>
            </Link>
          }
          actions={
            <Badge variant="outline" className="gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
              Live
            </Badge>
          }
        />
        <main className="py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/coin/:id" element={<CoinDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
