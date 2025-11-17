import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { LogOut, User2, Building2, Briefcase, Users } from "lucide-react";
import { logout, selectCurrentUser, selectIsAuthenticated } from "../../store/slices/auth/authSlice";
import companyService from "../../services/company.service";
import ThemeToggle from "../ThemeToggle";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [companyLogo, setCompanyLogo] = useState(null);

  // Fetch company logo for COMPANY role users
  useEffect(() => {
    const fetchCompanyLogo = async () => {
      if (user?.role === 'COMPANY') {
        try {
          const response = await companyService.getMyCompany();
          if (response.data.hasCompany && response.data.company?.logo) {
            setCompanyLogo(response.data.company.logo);
          } else {
            setCompanyLogo(null);
          }
        } catch (error) {
          console.error('Error fetching company logo:', error);
          setCompanyLogo(null);
        }
      } else {
        setCompanyLogo(null);
      }
    };

    fetchCompanyLogo();

    // Refresh logo when window gains focus (after updating profile)
    const handleFocus = () => {
      if (user?.role === 'COMPANY') {
        fetchCompanyLogo();
      }
    };

    // Listen for company logo updates
    const handleLogoUpdate = () => {
      if (user?.role === 'COMPANY') {
        fetchCompanyLogo();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('companyLogoUpdated', handleLogoUpdate);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('companyLogoUpdated', handleLogoUpdate);
    };
  }, [user?.role, user?.id]);

  // Determine avatar source based on role
  const getAvatarSrc = () => {
    if (user?.role === 'COMPANY' && companyLogo) {
      return companyLogo;
    }
    return user?.avatar || "https://github.com/shadcn.png";
  };
  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-background/80 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        <div>
          <Link to="/">
            <h1 className="text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity">
              Career<span className="text-[#6A38C2]">Forge</span>
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            <li><Link to="/" className="hover:text-[#6A38C2] transition-colors">Home</Link></li>
            
            {/* Company-specific navigation */}
            {user?.role === 'COMPANY' ? (
              <>
                <li><Link to="/company/profile" className="hover:text-[#6A38C2] transition-colors">Company Profile</Link></li>
                <li><Link to="/company/jobs" className="hover:text-[#6A38C2] transition-colors">Manage Jobs</Link></li>
                <li><Link to="/company/recruiters" className="hover:text-[#6A38C2] transition-colors">Recruiters</Link></li>
                <li><Link to="/company/applications" className="hover:text-[#6A38C2] transition-colors">Applications</Link></li>
              </>
            ) : user?.role === 'RECRUITER' ? (
              <>
                <li><Link to="/employer" className="hover:text-[#6A38C2] transition-colors">Dashboard</Link></li>
                <li><Link to="/employer/jobs" className="hover:text-[#6A38C2] transition-colors">Manage Jobs</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/jobs" className="hover:text-[#6A38C2] transition-colors">Jobs</Link></li>
                <li><Link to="/companies" className="hover:text-[#6A38C2] transition-colors">Companies</Link></li>
              </>
            )}
          </ul>
          <ThemeToggle />
          {!isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/auth/login" className="text-sm font-medium hover:text-[#6A38C2] transition-colors">Login</Link>
              <Link to="/auth/register" className="text-sm font-medium text-[#6A38C2] hover:text-[#5b30a6] transition-colors">Signup</Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <div className="cursor-pointer w-12 h-12 rounded-lg overflow-hidden border-2 border-border hover:border-[#6A38C2] transition-colors">
                  <img
                    src={getAvatarSrc()}
                    alt={user?.name || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="">
                  <div className="flex gap-4 space-y-2">
                    <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-border shrink-0">
                      <img
                        src={getAvatarSrc()}
                        alt={user?.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{user?.name || "User"}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user?.email || ""}
                      </p>
                      {user?.role && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-[#6A38C2] text-white rounded">
                          {user.role === 'COMPANY' ? 'Company Owner' : user.role}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col my-2 text-gray-600">
                    {user?.role === 'COMPANY' ? (
                      <>
                        <div className="flex w-fit items-center gap-2 cursor-pointer" onClick={() => navigate('/company/profile')}>
                          <Building2 className="w-4 h-4" />
                          <Button variant="link">Company Profile</Button>
                        </div>
                        <div className="flex w-fit items-center gap-2 cursor-pointer" onClick={() => navigate('/company/jobs')}>
                          <Briefcase className="w-4 h-4" />
                          <Button variant="link">Manage Jobs</Button>
                        </div>
                        <div className="flex w-fit items-center gap-2 cursor-pointer" onClick={() => navigate('/company/recruiters')}>
                          <Users className="w-4 h-4" />
                          <Button variant="link">Recruiters</Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex w-fit items-center gap-2 cursor-pointer" onClick={() => navigate('/profile')}>
                        <User2 />
                        <Button variant="link">View Profile</Button>
                      </div>
                    )}
                    <div className="flex w-fit items-center gap-2 cursor-pointer" onClick={() => {
                      dispatch(logout());
                      navigate('/');
                    }}>
                      <LogOut />
                      <Button variant="link">Logout</Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
