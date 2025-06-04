
"use client"; 

import React, { useState, useMemo, useEffect } from 'react';
import VolunteerCard from '@/components/volunteers/VolunteerCard';
import VolunteerFilters from '@/components/volunteers/VolunteerFilters';
import type { Volunteer } from '@/lib/types';
import { Frown } from 'lucide-react'; // Removed Users as it's in parent

interface VolunteersPageContentProps {
  initialVolunteers: Volunteer[];
}

export default function VolunteersPageContent({ initialVolunteers }: VolunteersPageContentProps) {
  const [allVolunteers, setAllVolunteers] = useState<Volunteer[]>(initialVolunteers);
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>(initialVolunteers);
  
  useEffect(() => {
    setAllVolunteers(initialVolunteers);
    setFilteredVolunteers(initialVolunteers);
  }, [initialVolunteers]);

  const uniqueProvinces = useMemo(() => {
    const provinces = new Set(allVolunteers.map(v => v.province).filter(Boolean));
    return Array.from(provinces).sort();
  }, [allVolunteers]);

  const uniqueCities = useMemo(() => {
    const cities = new Set(allVolunteers.map(v => v.city).filter(Boolean));
    return Array.from(cities).sort();
  }, [allVolunteers]);

  const handleFilterChange = (filters: { searchTerm: string; province: string; city: string }) => {
    let result = allVolunteers;

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(v => 
        v.name.toLowerCase().includes(term) ||
        (v.experience && v.experience.toLowerCase().includes(term)) ||
        v.bio?.toLowerCase().includes(term) ||
        v.specialization?.some(s => s.toLowerCase().includes(term))
      );
    }

    if (filters.province) {
      result = result.filter(v => v.province === filters.province);
    }

    if (filters.city) {
      result = result.filter(v => v.city === filters.city);
    }
    
    setFilteredVolunteers(result);
  };

  return (
    <>
      <VolunteerFilters 
        onFilterChange={handleFilterChange} 
        provinces={uniqueProvinces}
        cities={uniqueCities}
      />

      {filteredVolunteers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVolunteers.map((volunteer) => (
            <VolunteerCard key={volunteer.id} volunteer={volunteer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card shadow rounded-lg">
          <Frown className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">No Volunteers Found</h2>
          <p className="text-muted-foreground">Try adjusting your search filters or check back later.</p>
        </div>
      )}
    </>
  );
}
