import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Building2, MapPin, Link2, Users, Briefcase, Globe, Calendar } from 'lucide-react';
import companyService from '../../services/company.service';

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await companyService.getCompanyById(id);
        // API returns { success, message, data }
        setCompany(res.data);
      } catch (err) {
        setError(typeof err === 'string' ? err : err?.error || 'Failed to load company');
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 animate-spin border-2 border-[#6A38C2] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">{error || 'Company not found'}</p>
      </div>
    );
  }

  const logoFallback = (
    <div className="w-16 h-16 rounded-lg bg-[#6A38C2] text-white flex items-center justify-center text-2xl font-bold">
      {company.name?.charAt(0)?.toUpperCase() || 'C'}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          {logoFallback}
          <div>
            <h1 className="text-3xl font-bold mb-1">{company.name}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
              {company.industry && (
                <Badge variant="outline">{company.industry}</Badge>
              )}
              {company.location && (
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{company.location}</span>
              )}
              {company.website && (
                <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#6A38C2] hover:underline">
                  <Globe className="h-4 w-4" />{company.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 md:w-auto w-full">
          <Card>
            <CardContent className="pt-4 pb-4 px-4 text-center">
              <div className="text-xs text-gray-600">Open Jobs</div>
              <div className="text-2xl font-bold">{company.jobs?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 px-4 text-center">
              <div className="text-xs text-gray-600">Recruiters</div>
              <div className="text-2xl font-bold">{company.employers?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 px-4 text-center">
              <div className="text-xs text-gray-600">Founded</div>
              <div className="text-2xl font-bold">—</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* About */}
      {company.description && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About {company.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{company.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2"><Briefcase className="h-5 w-5" /> Open Jobs</h2>
          </div>
          {company.jobs && company.jobs.length > 0 ? (
            company.jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        <Link to={`/jobs/${job.id}`} className="hover:underline">{job.title}</Link>
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2 text-sm">
                        {job.jobType && <Badge variant="outline">{String(job.jobType).replace('_',' ')}</Badge>}
                        {job.experienceLevel && <Badge variant="outline">{job.experienceLevel}</Badge>}
                        {job.location && (
                          <span className="flex items-center gap-1 text-gray-600"><MapPin className="h-4 w-4" />{job.location}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">Posted {new Date(job.createdAt).toLocaleDateString()}</div>
                    </div>
                    <Button variant="outline" asChild>
                      <Link to={`/jobs/${job.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card><CardContent className="p-6 text-gray-600">No active jobs</CardContent></Card>
          )}
        </div>

        {/* Recruiters */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Users className="h-5 w-5" /> Recruiters</h2>
          {company.employers && company.employers.length > 0 ? (
            company.employers.map((emp) => (
              <Card key={emp.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#6A38C2] text-white flex items-center justify-center font-semibold">
                        {emp.user?.name?.charAt(0)?.toUpperCase() || 'R'}
                      </div>
                      <div>
                        <div className="font-semibold">{emp.user?.name}</div>
                      </div>
                    </div>
                    {emp.user?.id && (
                      <Button variant="outline" asChild>
                        <Link to={`/profiles/${emp.user.id}`}>View</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card><CardContent className="p-6 text-gray-600">Recruiter information not available</CardContent></Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
