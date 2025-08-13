"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type GoldRates = {
  rate24k: number;
  rate22k: number;
  lastUpdated: Date;
};

type GoldRateContextType = {
  goldRates: GoldRates;
  isLoading: boolean;
  error: string | null;
  updateRates: (rates: Partial<GoldRates>) => void;
};

const defaultRates: GoldRates = {
  rate24k: 241500,
  rate22k: 221450,
  lastUpdated: new Date()
};

const GoldRateContext = createContext<GoldRateContextType | undefined>(undefined);

export function GoldRateProvider({ children }: { children: React.ReactNode }) {
  const [goldRates, setGoldRates] = useState<GoldRates>(defaultRates);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In a real application, you would fetch the latest gold rates from an API
  useEffect(() => {
    // This is a placeholder for an actual API call
    // In production, you would implement a real API call here
    const fetchGoldRates = async () => {
      try {
        setIsLoading(true);
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would fetch from an actual API
        // const response = await fetch('https://api.example.com/gold-rates');
        // const data = await response.json();
        
        // For now, we'll use our default rates with a slight variation to simulate real data
        const simulatedRates = {
          rate24k: 241500 + Math.floor(Math.random() * 2000 - 1000), // Random fluctuation
          rate22k: 221450 + Math.floor(Math.random() * 2000 - 1000), // Random fluctuation
          lastUpdated: new Date()
        };
        
        setGoldRates(simulatedRates);
        setError(null);
      } catch (err) {
        setError('Failed to fetch gold rates');
        console.error('Error fetching gold rates:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoldRates();
    
    // Refresh rates every hour (in a real app)
    // const intervalId = setInterval(fetchGoldRates, 3600000);
    // return () => clearInterval(intervalId);
  }, []);

  const updateRates = (rates: Partial<GoldRates>) => {
    setGoldRates(prev => ({
      ...prev,
      ...rates,
      lastUpdated: new Date()
    }));
  };

  return (
    <GoldRateContext.Provider value={{ goldRates, isLoading, error, updateRates }}>
      {children}
    </GoldRateContext.Provider>
  );
}

export function useGoldRates() {
  const context = useContext(GoldRateContext);
  if (context === undefined) {
    throw new Error('useGoldRates must be used within a GoldRateProvider');
  }
  return context;
}