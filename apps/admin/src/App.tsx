import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import SignIn from './components/SignIn/SignIn';
import { AuthProvider } from './context/AuthContext';
import { UserSessionProvider } from './context/UserContext';
import AuthenticatedRoutes from './guard/AuthenticatedRoutes';
import NetworkStatusGuard from './guard/NetworkStatusGuard';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Sidebar from './pages/Sidebar';
import SignUp from './pages/SignUp';
import UserPage from './pages/User';
// import ProductPage from './pages/Products';
import { ScrollToTop } from './components/helpers/ScrollToTop';
import { ThemeProvider } from './utils/theme-provider';
// import Product2Page from './pages/Products2';

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
              <ScrollToTop />
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
                        {/* <Route path="products/" element={<ProductPage />} /> */}
                        {/* <Route path="products2/" element={<Product2Page />} /> */}
                        {/* <Route path="notification/" element={<NotificationPage />} /> */}
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
