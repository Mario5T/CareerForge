import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2 } from "lucide-react";
import { logout, selectCurrentUser, selectIsAuthenticated } from "../../store/slices/auth/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
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
            <li><Link to="/jobs" className="hover:text-[#6A38C2] transition-colors">Jobs</Link></li>
            <li><Link to="/companies" className="hover:text-[#6A38C2] transition-colors">Companies</Link></li>
          </ul>
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/auth/login"><Button variant="outline">Login</Button></Link>
              <Link to="/auth/register"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.avatar || "https://github.com/shadcn.png"}
                    alt={user?.name || "User"}
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="">
                  <div className="flex gap-4 space-y-2">
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={user?.avatar || "https://github.com/shadcn.png"}
                        alt={user?.name || "User"}
                      />
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user?.name || "User"}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user?.email || ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col my-2 text-gray-600">
                    <div className="flex w-fit items-center gap-2 cursor-pointer" onClick={() => navigate('/profile')}>
                      <User2 />
                      <Button variant="link">View Profile</Button>
                    </div>
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
