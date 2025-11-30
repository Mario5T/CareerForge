import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuth } from './store/slices/auth/authSlice';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OAuthCallback from './pages/auth/OAuthCallback';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/profile/Profile';
import Jobs from './pages/jobs/Jobs';
import JobDetails from './pages/jobs/JobDetails';
import Companies from './pages/companies/Companies';
import CompanyDetails from './pages/companies/CompanyDetails';
import NotFound from './pages/NotFound';
import PostJob from './pages/employer/PostJob';
import ManageJobs from './pages/employer/ManageJobs';
import EmployerHomepage from './pages/employer/Homepaage';
import EmployerProfile from './pages/employer/EmployerProfile';
import JobApplicants from './pages/employer/JobApplicants';
import EditJob from './pages/employer/EditJob';
import CompanyProfile from './pages/company/CompanyProfile';
import CompanyJobs from './pages/company/CompanyJobs';
import CompanyRecruiters from './pages/company/CompanyRecruiters';
import CompanyApplications from './pages/company/CompanyApplications';
import PublicProfile from './pages/profile/PublicProfile';
import PublicUserProfile from './pages/profile/PublicUserProfile';
import PublicRecruiterProfile from './pages/profile/PublicRecruiterProfile';
import PublicCompanyProfile from './pages/profile/PublicCompanyProfile';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactUs from './pages/ContactUs';

import ProtectedRoute from './components/auth/ProtectedRoute';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(checkAuth());
    }
  }, []);

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
      {
        path: 'jobs',
        children: [
          {
            index: true,
            element: <Jobs />,
          },
          {
            path: ':id',
            element: <JobDetails />,
          },
        ],
      },
      {
        path: 'companies',
        element: <Companies />,
      },
      {
        path: 'companies/:id',
        element: <CompanyDetails />,
      },
      {
        path: 'profiles/:id',
        element: <PublicProfile />,
      },
      {
        path: 'public/user/:id',
        element: <PublicUserProfile />,
      },
      {
        path: 'public/recruiter/:id',
        element: <PublicRecruiterProfile />,
      },
      {
        path: 'public/company/:id',
        element: <PublicCompanyProfile />,
      },
      {
        path: 'terms',
        element: <TermsOfService />,
      },
      {
        path: 'privacy',
        element: <PrivacyPolicy />,
      },
      {
        path: 'contact',
        element: <ContactUs />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'employer',
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <EmployerHomepage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'profile',
            element: (
              <ProtectedRoute>
                <EmployerProfile />
              </ProtectedRoute>
            ),
          },
          {
            path: 'jobs',
            element: (
              <ProtectedRoute>
                <ManageJobs />
              </ProtectedRoute>
            ),
          },
          {
            path: 'post-job',
            element: (
              <ProtectedRoute>
                <PostJob />
              </ProtectedRoute>
            ),
          },
          {
            path: 'jobs/:jobId/applicants',
            element: (
              <ProtectedRoute>
                <JobApplicants />
              </ProtectedRoute>
            ),
          },
          {
            path: 'jobs/:jobId/edit',
            element: (
              <ProtectedRoute>
                <EditJob />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'company',
        children: [
          {
            path: 'profile',
            element: (
              <ProtectedRoute>
                <CompanyProfile />
              </ProtectedRoute>
            ),
          },
          {
            path: 'jobs',
            element: (
              <ProtectedRoute>
                <CompanyJobs />
              </ProtectedRoute>
            ),
          },
          {
            path: 'recruiters',
            element: (
              <ProtectedRoute>
                <CompanyRecruiters />
              </ProtectedRoute>
            ),
          },
          {
            path: 'applications',
            element: (
              <ProtectedRoute>
                <CompanyApplications />
              </ProtectedRoute>
            ),
          },
        ],
      },
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
      {
        path: 'callback',
        element: <OAuthCallback />,
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
