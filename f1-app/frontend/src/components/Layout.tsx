import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { LogOut, User, Coins } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-f1-red rounded-lg flex items-center justify-center font-f1 font-bold text-xl">
                PW
              </div>
              <div>
                <h1 className="font-f1 font-bold text-lg text-white">PitWall Pro</h1>
                <p className="text-xs text-gray-400">F1 Race Analytics</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-900/30 rounded-full border border-yellow-700">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold text-yellow-500">{user?.pitcoins || 0}</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full border border-gray-600">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">{user?.username}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
