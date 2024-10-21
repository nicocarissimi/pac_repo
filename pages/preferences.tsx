'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const dramaTechniques = [
  { id: 'improvisation', label: 'Improvisation' },
  { id: 'method-acting', label: 'Method Acting' },
  { id: 'mime', label: 'Mime' },
  { id: 'stanislavski', label: 'Stanislavski System' },
  { id: 'viewpoints', label: 'Viewpoints' },
  { id: 'meisner', label: 'Meisner Technique' },
  { id: 'physical-theatre', label: 'Physical Theatre' },
  { id: 'commedia', label: `Commedia dell'Arte` },
];

export default function DramaPreferences() {
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isShrinking, setIsShrinking] = useState(false);

  useEffect(() => {
    // Trigger the first animation after a short delay
    const timer1 = setTimeout(() => setShowContent(true), 500);
    
    // Trigger the shrinking transition after 3 seconds
    const timer2 = setTimeout(() => setIsShrinking(true), 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleTechniqueToggle = (techniqueId: string) => {
    setSelectedTechniques(prev =>
      prev.includes(techniqueId)
        ? prev.filter(id => id !== techniqueId)
        : [...prev, techniqueId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);

  };

  return (
    <div className="min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Transitioning "Welcome to" and logo */}
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${
          isShrinking ? 'top-72 left-1/2 transform scale-75' : ''
        }`}
      >
        {/* Welcome text */}
        <h1
          className={`text-3xl font-bold text-center mb-4 opacity-0 transition-opacity duration-1000 ${
            showContent ? 'opacity-100' : ''
          }`}
        >
          Welcome to
        </h1>
        {/* Logo */}
        <div
          className={`flex justify-center mb-4 opacity-0 transition-opacity duration-1000 ${
            showContent ? 'opacity-100 delay-500' : ''
          }`}
        >
          <img src="/images/logo.png" className="lg:h-28" alt="Logo" />
        </div>
      </div>

      {/* The form content below the shrinking animation */}
      <div
        className={`transition-all duration-1000 ${
          isShrinking ? 'opacity-100 translate-y-[-80px]' : 'opacity-0 translate-y-[200px]'
        }`}
      >
        <p className="text-center text-zinc-400 mb-8">
          Select the drama techniques you're most interested in exploring during our sessions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {dramaTechniques.map((technique) => (
            <Card
              key={technique.id}
              className={`cursor-pointer transition-all text-background bg-zinc-800 hover:bg-zinc-600 border-0 ${
                selectedTechniques.includes(technique.id) ? 'ring-2 ring-red-600' : ''
              }`}
              onClick={() => handleTechniqueToggle(technique.id)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <h2 className="text-sm font-medium">{technique.label}</h2>
                <Checkbox
                  checked={selectedTechniques.includes(technique.id)}
                  onCheckedChange={() => handleTechniqueToggle(technique.id)}
                  className="ml-2 border-0"
                  aria-label={`Select ${technique.label}`}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {isSuccess ? (
          <div className="text-center text-green-400 font-medium mb-4">
            Your preferences have been saved successfully!
          </div>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={selectedTechniques.length === 0 || isSubmitting}
            className="w-full text-white hover:bg-zinc-500 bg-red-800 text-background rounded-full text-xl font-semibold disabled:bg-red-900 disabled:text-zinc-400"
          >
            {isSubmitting ? 'Saving...' : 'Save Preferences'}
          </Button>
        )}

        {selectedTechniques.length === 0 && !isSuccess && (
          <p className="text-center text-zinc-500 mt-4">
            Please select at least one technique to continue.
          </p>
        )}
      </div>
    </div>
  );
}
