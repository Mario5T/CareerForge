import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/auth/authSlice';

const Footer = () => {
  const user = useSelector(selectCurrentUser);
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">CareerForge</h3>
            <p className="text-gray-400">Find your dream job or the perfect candidate with our platform.</p>
          </div>
          {(!user || (user.role !== 'COMPANY' && user.role !== 'RECRUITER')) && (
            <div>
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li><Link to="/jobs" className="text-gray-400 hover:text-white">Browse Jobs</Link></li>
                <li><Link to="/companies" className="text-gray-400 hover:text-white">Companies</Link></li>
                <li><Link to="/profile" className="text-gray-400 hover:text-white">My Profile</Link></li>
              </ul>
            </div>
          )}
          {user?.role === 'COMPANY' && (
            <div>
              <h4 className="font-semibold mb-4">For Company</h4>
              <ul className="space-y-2">
                <li><Link to="/company/profile" className="text-gray-400 hover:text-white">Company Profile</Link></li>
                <li><Link to="/company/recruiters" className="text-gray-400 hover:text-white">Manage Recruiters</Link></li>
                <li><Link to="/company/jobs" className="text-gray-400 hover:text-white">Manage Jobs</Link></li>
              </ul>
            </div>
          )}
          {(!user || user?.role === 'RECRUITER') && (
            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white">Post a Job</Link></li>
                <li><Link to="/dashboard/applicants" className="text-gray-400 hover:text-white">View Applicants</Link></li>
              </ul>
            </div>
          )}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} CareerForge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
