"use client";

import { useGoldRates } from "@/context/GoldRateContext";

type GoldRateDisplayProps = {
  variant?: 'default' | 'compact' | 'hero';
  className?: string;
};

export default function GoldRateDisplay({ variant = 'default', className = '' }: GoldRateDisplayProps) {
  const { goldRates, isLoading } = useGoldRates();
  
  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-primary">Today's Gold Rate</h2>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center">
          <div className="bg-card/30 backdrop-blur-sm px-6 py-3 rounded-lg border border-primary/20">
            <p className="text-sm text-white/70">24k Gold</p>
            <p className="text-xl font-bold text-primary">
              {isLoading ? 'Loading...' : `PKR ${goldRates.rate24k.toLocaleString()}`}
            </p>
          </div>
          <div className="bg-card/30 backdrop-blur-sm px-6 py-3 rounded-lg border border-primary/20">
            <p className="text-sm text-white/70">22k Gold</p>
            <p className="text-xl font-bold text-primary">
              {isLoading ? 'Loading...' : `PKR ${goldRates.rate22k.toLocaleString()}`}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === 'compact') {
    return (
      <div className={`flex flex-row gap-4 ${className}`}>
        <div>
          <span className="text-xs text-muted-foreground block">24k</span>
          <span className="font-medium text-primary">
            {isLoading ? 'Loading...' : `PKR ${goldRates.rate24k.toLocaleString()}`}
          </span>
        </div>
        <div>
          <span className="text-xs text-muted-foreground block">22k</span>
          <span className="font-medium text-primary">
            {isLoading ? 'Loading...' : `PKR ${goldRates.rate22k.toLocaleString()}`}
          </span>
        </div>
      </div>
    );
  }
  
  // Default variant
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between text-lg">
        <span className="font-medium text-muted-foreground">24k Gold</span>
        <span className="font-bold text-foreground">
          {isLoading ? 'Loading...' : `PKR ${goldRates.rate24k.toLocaleString()}`}
        </span>
      </div>
      <div className="flex justify-between text-lg">
        <span className="font-medium text-muted-foreground">22k Gold</span>
        <span className="font-bold text-foreground">
          {isLoading ? 'Loading...' : `PKR ${goldRates.rate22k.toLocaleString()}`}
        </span>
      </div>
      <div className="text-xs text-muted-foreground text-right mt-2">
        Last updated: {goldRates.lastUpdated.toISOString().split('T')[0]}
      </div>
    </div>
  );
}