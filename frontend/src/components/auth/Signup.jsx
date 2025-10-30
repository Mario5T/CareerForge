import React from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Signup = () => {
    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center max-w-7xl mx-auto">
                <form
                    action=""
                    className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
                >
                    <h1 className="font-bold text-xl mb-5">Sign Up</h1>
                    <div className="my-2">
                        <Label>Full Name</Label>
                        <Input type="text" placeholder="John Doe" />
                    </div>
                    <div className="my-2">
                        <Label>Email</Label>
                        <Input type="email" placeholder="johndoe@gmail.com" />
                    </div>
                    <div className="my-2">
                        <Label>Phone Number</Label>
                        <Input type="text" placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <div className="my-2">
                        <Label>Password</Label>
                        <Input type="password" placeholder="Enter your Password" />
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="w-full">
                            <Label className="block mb-2">Select Role</Label>
                            <RadioGroup className='flex flex-wrap items-center gap-4'>
                                <div className="flex items-center space-x-2">
                                    <Input 
                                    type="radio"
                                    name="role"
                                    value="Student"
                                    className="cursor-pointer"
                                    />
                                    <Label htmlFor="option-one">Student</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input 
                                    type="radio"
                                    name="role"
                                    value="Employer"
                                    className="cursor-pointer"
                                    />
                                    <Label htmlFor="option-two">Employer</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input 
                                    type="radio"
                                    name="role"
                                    value="Company"
                                    className="cursor-pointer"
                                    />
                                    <Label htmlFor="option-three">Company</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input 
                                    type="radio"
                                    name="role"
                                    value="Admin"
                                    className="cursor-pointer"
                                    />
                                    <Label htmlFor="option-four">Admin</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="w-full">
                            <Label className="block mb-2">Profile Image</Label>
                            <Input
                            accept="image/*"
                            type="file"
                            className="cursor-pointer"
                            />
                        </div>
                    </div>
                    <Button type="submit" variant="default" className="w-full my-4">Sign Up</Button>
                    <span className="text-sm">Already have an Account? <Link to="/auth/login" className="text-violet-600">Login</Link></span>
                </form>
            </div>
        </div>
    );
};

export default Signup;
