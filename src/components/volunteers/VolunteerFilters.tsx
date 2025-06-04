
"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, XCircle } from 'lucide-react';

interface VolunteerFiltersProps {
  onFilterChange: (filters: { searchTerm: string; province: string; city: string }) => void;
  provinces: string[]; // List of unique provinces from data
  cities: string[]; // List of unique cities from data (can be dynamic based on province)
}

const ALL_FILTER_VALUE = "_ALL_"; // Special value for "All" options

export default function VolunteerFilters({ onFilterChange, provinces, cities }: VolunteerFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onFilterChange({ 
      searchTerm, 
      province: selectedProvince === ALL_FILTER_VALUE ? '' : selectedProvince, 
      city: selectedCity === ALL_FILTER_VALUE ? '' : selectedCity 
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedProvince(''); // Clears to show placeholder
    setSelectedCity('');   // Clears to show placeholder
    onFilterChange({ searchTerm: '', province: '', city: '' });
  };
  
  // In a real app, cities might be filtered based on selectedProvince
  // For this mock, we assume all cities are passed

  return (
    <form onSubmit={handleSearch} className="p-4 md:p-6 bg-card shadow rounded-lg space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
      <div className="flex-grow">
        <label htmlFor="search-volunteer" className="block text-sm font-medium text-muted-foreground mb-1">Search by Name or Keyword</label>
        <div className="relative">
          <Input
            id="search-volunteer"
            type="text"
            placeholder="e.g., Dr. Rina, Bandung, Terapis"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <div>
        <label htmlFor="province-filter" className="block text-sm font-medium text-muted-foreground mb-1">Province</label>
        <Select 
          value={selectedProvince} 
          onValueChange={(value) => setSelectedProvince(value === ALL_FILTER_VALUE ? '' : value)}
        >
          <SelectTrigger id="province-filter" className="w-full md:w-[200px]">
            <SelectValue placeholder="All Provinces" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_FILTER_VALUE}>All Provinces</SelectItem>
            {provinces.map(province => (
              <SelectItem key={province} value={province}>{province}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="city-filter" className="block text-sm font-medium text-muted-foreground mb-1">City</label>
        <Select 
          value={selectedCity} 
          onValueChange={(value) => setSelectedCity(value === ALL_FILTER_VALUE ? '' : value)}
        >
          <SelectTrigger id="city-filter" className="w-full md:w-[200px]">
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_FILTER_VALUE}>All Cities</SelectItem>
             {cities.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4 md:pt-0">
        <Button type="submit" className="w-full md:w-auto">
          <Filter className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
        <Button type="button" variant="outline" onClick={handleClearFilters} className="w-full md:w-auto">
          <XCircle className="mr-2 h-4 w-4" /> Clear
        </Button>
      </div>
    </form>
  );
}
