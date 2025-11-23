import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Mail, Phone, Calendar, Download, User, Briefcase, GraduationCap, MapPin, Globe, Loader2, AlertCircle } from 'lucide-react';
import publicProfileService from '../../services/publicProfile.service';
import { useToast } from '../../components/ui/use-toast';

const PublicUserProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
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
        setError(err.message || 'Failed to load profile');
        toast({
          title: "Error",
          description: "Unable to load user profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
            <div>
              <h3 className="text-lg font-semibold">Profile Not Found</h3>
              <p className="text-muted-foreground mt-2">
                {error || "This user profile doesn't exist or isn't public."}
              </p>
            </div>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/20 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {profile.name}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">{profile.bio}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    {profile.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.createdAt && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {profile.resume ? (
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={(() => {
                      if (profile.resume.startsWith('http')) return profile.resume;
                      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
                      const BASE_URL = API_URL.replace('/api/v1', '');
                      // Ensure no double slashes if path starts with /
                      const cleanPath = profile.resume.startsWith('/') ? profile.resume.slice(1) : profile.resume;
                      return `${BASE_URL}/${cleanPath}`;
                    })()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download CV
                  </a>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  No Resume Attached
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>About</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {profile.bio || "No bio available."}
                </p>
              </CardContent>
            </Card>

            {/* Experience Section */}
            {profile.experience && profile.experience.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5" />
                    <span>Experience</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-border pl-4 pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{exp.jobTitle}</h4>
                          <p className="text-muted-foreground">{exp.company}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                          </p>
                        </div>
                        <Badge variant="secondary">{exp.employmentType}</Badge>
                      </div>
                      {exp.description && (
                        <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Education Section */}
            {profile.education && profile.education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5" />
                    <span>Education</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{edu.degree}</h4>
                        <p className="text-muted-foreground">{edu.university}</p>
                        <p className="text-sm text-muted-foreground">
                          {edu.startYear} - {edu.isPresent ? 'Present' : edu.endYear}
                        </p>
                        {edu.fieldOfStudy && (
                          <Badge variant="outline" className="mt-1">{edu.fieldOfStudy}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicUserProfile;
