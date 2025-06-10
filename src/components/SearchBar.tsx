import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { SearchFilters } from '@/types/transaction';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [transactionId, setTransactionId] = useState('');
  const [riskIndicator, setRiskIndicator] = useState<string>('All');
  const [status, setStatus] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    const filters: SearchFilters = {};
    
    if (transactionId.trim()) {
      filters.transactionId = transactionId.trim();
    }
    
    if (riskIndicator !== 'All') {
      filters.riskIndicator = riskIndicator as 'High' | 'Normal';
    }
    
    if (status !== 'All') {
      filters.status = status as 'flagged' | 'reviewed' | 'dismissed';
    }
    
    onSearch(filters);
  };

  const handleClear = () => {
    setTransactionId('');
    setRiskIndicator('All');
    setStatus('All');
    onSearch({});
  };

  const hasActiveFilters = transactionId || riskIndicator !== 'All' || status !== 'All';

  return (
    <Card className="p-6 mb-6">
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by Transaction ID..."
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button 
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClear}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium mb-2 block">Risk Level</label>
              <Select value={riskIndicator} onValueChange={setRiskIndicator}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Risk Levels</SelectItem>
                  <SelectItem value="High">High Risk</SelectItem>
                  <SelectItem value="Normal">Normal Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}