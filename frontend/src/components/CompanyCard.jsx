import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Building2, MapPin, Star, ArrowRight } from 'lucide-react';

const CompanyCard = React.memo(({ company }) => {
  return (
    <Card className="group animate-in fade-in-0 slide-in-from-bottom-2 duration-300 hover:shadow-lg transition-all hover:-translate-y-0.5">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-primary/10 p-3 rounded-lg transition-transform duration-300 group-hover:scale-105">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              <Link to={`/companies/${company.id}`} className="hover:underline">
                {company.name}
              </Link>
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{company.location}</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {company.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            {company.industry}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {company.size} employees
          </Badge>
          {company.isHiring && (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
              Hiring Now
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="font-medium">{company.rating}</span>
            <span className="text-muted-foreground ml-1">
              ({company.jobs} {company.jobs === 1 ? 'job' : 'jobs'})
            </span>
          </div>
          
          <Button variant="outline" size="sm" asChild>
            <Link to={`/companies/${company.id}`}>
              View Details <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

CompanyCard.displayName = 'CompanyCard';

export default CompanyCard;