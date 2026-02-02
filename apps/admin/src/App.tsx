import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import AuthenticatedRoutes from './guard/AuthenticatedRoutes';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import SignIn from './components/SignIn/SignIn';
import NetworkStatusGuard from './guard/NetworkStatusGuard';
import { Toaster } from 'sonner';
import Sidebar from './pages/Sidebar';
import { UserSessionProvider } from './context/UserContext';
import UserPage from './pages/User';
import ProductPage from './pages/Products';
import { ThemeProvider } from './utils/theme-provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      // staleTime: 0,
      // gcTime: 0,
    },
  },
});

function App() {
  const dir: 'rtl' | 'ltr' = 'ltr';

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div dir={dir}>
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <NetworkStatusGuard>
            <Router>
              <AuthProvider>
                <Routes>
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />

                  <Route element={<AuthenticatedRoutes />}>
                    <Route element={<UserSessionProvider />}>
                      <Route element={<Sidebar dir={dir} />}>
                        <Route path="/" element={<Home />} />
                        <Route index path="/profile" element={<Profile />} />
                        <Route path="users/" element={<UserPage />} />
                        <Route path="products/" element={<ProductPage />} />
                      </Route>
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            </Router>
          </NetworkStatusGuard>
        </QueryClientProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
