// src/App.jsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import SidebarMenu from './components/SidebarMenu';
import Header from './components/Header';

import Home from './pages/Home';


export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header onMenuClick={() => setMenuOpen(true)} />

        <div className="flex flex-1">
          <SidebarMenu open={menuOpen} setOpen={setMenuOpen} />

          <main className="flex-1 bg-gray-50 p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              
              

               
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
