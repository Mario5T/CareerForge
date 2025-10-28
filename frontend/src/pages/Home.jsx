import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Find Your Dream Job or Top Talent
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Connect with the best opportunities and candidates in the tech industry.
          Whether you're looking for your next career move or your next hire,
          we've got you covered.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button asChild>
            <Link to="/jobs">Find Jobs</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/auth/register">Post a Job</Link>
          </Button>
        </div>
      </div>
      <section className="mt-20">
        <h2 className="text-2xl font-semibold mb-6">Featured Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="font-medium text-lg">Frontend Developer</h3>
            <p className="text-gray-600 mt-1">TechCorp • New York, NY</p>
            <p className="mt-3 text-sm text-gray-500 line-clamp-2">
              We're looking for an experienced Frontend Developer to join our team...
            </p>
            <Button variant="link" className="mt-4 p-0 h-auto">
              View Details
            </Button>
          </div>
        </div>
      </section>
      <section className="mt-20">
        <h2 className="text-2xl font-semibold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Create a Profile',
              description: 'Sign up and create your professional profile in minutes.'
            },
            {
              title: 'Find Opportunities',
              description: 'Browse through thousands of job listings or candidates.'
            },
            {
              title: 'Apply or Hire',
              description: 'Apply to jobs with one click or post your own job listing.'
            }
          ].map((step, index) => (
            <div key={index} className="text-center p-6 border rounded-lg">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {index + 1}
              </div>
              <h3 className="font-medium text-lg mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
