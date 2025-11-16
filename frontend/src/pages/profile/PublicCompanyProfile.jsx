import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Building2, MapPin, Globe, Users, Briefcase, Mail, Phone, Calendar, Star, ExternalLink, Loader2, AlertCircle, Award, TrendingUp } from 'lucide-react';
import publicProfileService from '../../services/publicProfile.service';
import { useToast } from '../../components/ui/use-toast';

const PublicCompanyProfile = () => {
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
        const data = await publicProfileService.getPublicCompanyProfile(id);
        setProfile(data);
      } catch (err) {
        setError(err.message || 'Failed to load company profile');
        toast({
          title: "Error",
          description: "Unable to load company profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading company profile...</p>
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
              <h3 className="text-lg font-semibold">Company Profile Not Found</h3>
              <p className="text-muted-foreground mt-2">
                {error || "This company profile doesn't exist or isn't public."}
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
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Company Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-2xl font-bold">{profile.name}</CardTitle>
                    {profile.verified && (
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground mt-1">{profile.tagline}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4" />
                      <span>{profile.industry}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{profile.size}</span>
                    </div>
                    {profile.founded && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Founded {profile.founded}</span>
                      </div>
                    )}
                  </div>
                  {profile.rating && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{profile.rating}</span>
                      <span className="text-sm text-muted-foreground">({profile.reviewCount} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                <Button size="sm">
                  <Briefcase className="h-4 w-4 mr-2" />
                  View Jobs
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Company */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>About</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {profile.description || "No description available."}
                </p>
                {profile.mission && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Mission</h4>
                    <p className="text-sm text-muted-foreground italic">{profile.mission}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Open Positions */}
            {profile.openPositions && profile.openPositions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-5 w-5" />
                      <span>Open Positions</span>
                    </div>
                    <Badge variant="secondary">{profile.openPositions.length} jobs</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.openPositions.map((job, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{job.title}</h4>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Briefcase className="h-4 w-4" />
                              <span>{job.type}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{job.department}</span>
                            </div>
                            {job.salary && (
                              <span className="text-green-600 font-medium">{job.salary}</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.skills?.slice(0, 4).map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {job.skills?.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{job.skills.length - 4} more
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {job.description}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Company Culture */}
            {profile.culture && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Company Culture</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.culture.values && profile.culture.values.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Core Values</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.culture.values.map((value, index) => (
                            <Badge key={index} variant="outline">
                              {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.culture.benefits && profile.culture.benefits.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Benefits & Perks</h4>
                        <div className="space-y-1">
                          {profile.culture.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <Award className="h-3 w-3 text-green-500" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {profile.culture.description && (
                    <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                      {profile.culture.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Leadership Team */}
            {profile.leadership && profile.leadership.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Leadership Team</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.leadership.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.title}</p>
                          {member.linkedin && (
                            <a 
                              href={member.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.headquarters}</span>
                  </div>
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
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Company Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Employees</span>
                  <Badge variant="secondary">{profile.stats?.employees || 'N/A'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Founded</span>
                  <Badge variant="secondary">{profile.founded || 'N/A'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <Badge variant="secondary">{profile.stats?.revenue || 'N/A'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Growth Rate</span>
                  <Badge variant="secondary">{profile.stats?.growthRate || 'N/A'}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            {profile.social && Object.keys(profile.social).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.social.linkedin && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {profile.social.twitter && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Twitter
                      </a>
                    </Button>
                  )}
                  {profile.social.facebook && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={profile.social.facebook} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Facebook
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Technologies */}
            {profile.technologies && profile.technologies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline">
                        {tech}
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

export default PublicCompanyProfile;
