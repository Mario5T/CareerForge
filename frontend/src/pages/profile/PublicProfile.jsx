import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Mail, Phone, Calendar, Download, User, Briefcase, GraduationCap } from 'lucide-react';
import publicProfileService from '../../services/publicProfile.service';

const PublicProfile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await publicProfileService.getPublicUserProfile(id);
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(typeof err === 'string' ? err : err?.error || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 animate-spin border-2 border-[#6A38C2] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">{error || 'Profile not found'}</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-[#6A38C2] text-white flex items-center justify-center text-2xl font-bold shrink-0">
            {profile.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">{profile.name}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge>{profile.role}</Badge>
              {profile.isActive === false && (
                <Badge variant="secondary">Inactive</Badge>
              )}
            </div>
            <div className="flex gap-4 text-sm text-gray-600 mt-2">
              {profile.email && (
                <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{profile.email}</span>
              )}
              {profile.phone && (
                <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{profile.phone}</span>
              )}
              {profile.createdAt && (
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {isOwnProfile ? (
            <Button asChild className="bg-[#6A38C2] hover:bg-[#5b30a6]">
              <Link to="/profile">Edit Profile</Link>
            </Button>
          ) : (
            <>
              {profile.email && (
                <Button asChild variant="outline">
                  <a href={`mailto:${profile.email}`}>Contact</a>
                </Button>
              )}
              {profile.resume && currentUser?.role !== 'COMPANY' && (
                <Button variant="outline" onClick={() => window.open(profile.resume, '_blank')}>
                  <Download className="h-4 w-4 mr-2" /> Resume
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {profile.bio && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </CardContent>
        </Card>
      )}

      {Array.isArray(profile.skills) && profile.skills.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <Badge key={idx} variant="outline">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {Array.isArray(profile.experience) && profile.experience.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.experience.map((exp) => (
                <div key={exp.id} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{exp.jobTitle}</h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ''} - {exp.currentlyWorking ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'N/A')}
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm mb-1">{exp.company}{exp.location ? ` • ${exp.location}` : ''}{exp.employmentType ? ` • ${exp.employmentType}` : ''}</div>
                  {exp.description && (
                    <p className="text-gray-700 text-sm mb-2">{exp.description}</p>
                  )}
                  {Array.isArray(exp.skillsUsed) && exp.skillsUsed.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {exp.skillsUsed.map((s, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {Array.isArray(profile.education) && profile.education.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Education</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.education.map((edu) => (
                <div key={edu.id} className="border-b last:border-0 pb-4 last:pb-0">
                  <h3 className="font-semibold">{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</h3>
                  <div className="text-gray-700 text-sm mb-1">{edu.university}</div>
                  <div className="text-sm text-gray-600">
                    {edu.startYear} - {edu.isPresent ? 'Present' : (edu.endYear || 'N/A')}
                  </div>
                  {edu.description && (
                    <p className="text-gray-700 text-sm mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PublicProfile;
