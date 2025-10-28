import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuth } from './store/slices/auth/authSlice';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
// Temporarily comment out components causing errors
// import Dashboard from './pages/dashboard/Dashboard';
// import Profile from './pages/profile/Profile';
// import Jobs from './pages/jobs/Jobs';
// import JobDetails from './pages/jobs/JobDetails';
// import Companies from './pages/companies/Companies';
// import CompanyDetails from './pages/companies/CompanyDetails';
import NotFound from './pages/NotFound';

import ProtectedRoute from './components/auth/ProtectedRoute';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      // Temporarily comment out job routes
      // {
      //   path: 'jobs',
      //   children: [
      //     {
      //       index: true,
      //       element: <Jobs />,
      //     },
      //     {
      //       path: ':id',
      //       element: <JobDetails />,
      //     },
      //   ],
      // },
      // {
      //   path: 'companies',
      //   children: [
      //     {
      //       index: true,
      //       element: <Companies />,
      //     },
      //     {
      //       path: ':id',
      //       element: <CompanyDetails />,
      //     },
      //   ],
      // },
      // {
      //   path: 'profile',
      //   element: (
      //     <ProtectedRoute>
      //       <Profile />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: 'dashboard',
      //   element: (
      //     <ProtectedRoute>
      //       <Dashboard />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <ProtectedRoute requireAuth={false}>
            <Register />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </Provider>
  );
}

export default App;
