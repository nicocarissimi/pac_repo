'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Clock } from "lucide-react"
import axios from 'axios';
import useCategories from '@/hooks/useCategories';
import { CategoryInterface } from '@/libs/definitions';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import Router from 'next/router';

export default function DramaPreferences() {
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isShrinking, setIsShrinking] = useState(false);
  const [isTimeConfirmed, setIsTimeConfirmed] = useState(false); // Track time confirmation
  const { data: dramaTechniques = [], mutate } = useCategories()
  const [time, setTime] = useState(30)
  const timeOptions = [5, 15, 30, 60, 120]

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 500);
    const timer2 = setTimeout(() => setIsShrinking(true), 3000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleTechniqueToggle = (techniqueName: string) => {
    setSelectedTechniques(prev =>
      prev.includes(techniqueName)
        ? prev.filter(name => name !== techniqueName) 
        : [...prev, techniqueName]
    );
  };


  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    const preferences = {
      learning_time: time,
      categories: selectedTechniques
    }
    console.log(preferences)
    await axios.post('/api/preferences',{
      ...preferences
    })
    setIsSubmitting(false);
    setIsSuccess(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    Router.push("/")
  };
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
    }
  }
  const handleConfirm = () => {
    if (time > 0) {
      setIsTimeConfirmed(true);
    }
  };
  const handleGoBack = () =>{
    setIsTimeConfirmed(false)
  }

  return (
    <div className="min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Transitioning "Welcome to" and logo */}
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${
          isShrinking ? 'top-1/4 left-1/2 transform scale-75' : ''
        }`}
      >
        <h1
          className={`text-3xl font-bold text-center mb-4 opacity-0 transition-opacity duration-1000 ${
            showContent ? 'opacity-100' : ''
          }`}
        >
          Welcome to
        </h1>
        <div
          className={`flex justify-center mb-4 opacity-0 transition-opacity duration-1000 ${
            showContent ? 'opacity-100 delay-500' : ''
          }`}
        >
          <img src="/images/logo.png" className="lg:h-28" alt="Logo" />
        </div>
      </div>

      {/* Flex container to hold the go-back arrow and time selection */}
      <div
        className={`transition-all duration-1000 flex w-full max-w-3xl ${
          isShrinking ? 'opacity-100 translate-y-[-1/2]' : 'opacity-0 translate-y-[200px]'
        }`}
      >
        {/* Go back button */}
        {isTimeConfirmed && (
          <div className='justify-end'>
          <Button
            variant="ghost"
            size="icon"
            className=""
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Go back</span>
          </Button>
          </div>
        )}

        {/* Time Selection Section */}
        {!isTimeConfirmed && (
          <div className="w-full max-w-md mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-bold text-center text-secondary">
              How long do you plan to stay?
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-6 h-6 text-secondary" />
              <span className="text-3xl font-bold text-secondary">{formatTime(time)}</span>
            </div>
            <Slider
              value={[time]}
              onValueChange={(value) => setTime(value[0])}
              max={120}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between">
              {timeOptions.map((option) => (
                <Button
                  key={option}
                  variant={time === option ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTime(option)}
                  className="px-3 py-1 bg-primary"
                >
                  {formatTime(option)}
                </Button>
              ))}
            </div>
            <Button
              className="w-full text-white hover:bg-zinc-500 bg-red-800 text-background rounded-full text-xl font-semibold disabled:bg-red-900 disabled:text-zinc-400"
              size="lg"
              onClick={handleConfirm}
            >
              Confirm Time
            </Button>
          </div>
        )}
      </div>

      {/* Category Selection Section */}
      {isTimeConfirmed && (
        <div
          className={`transition-all duration-1000 ${
            isTimeConfirmed ? 'opacity-100 translate-y-[-3/4]' : 'opacity-0 translate-y-[200px]'
          }`}
        >
          <p className="text-center text-zinc-400 mb-8">
            Select the drama techniques you're most interested in exploring during our sessions.
          </p>
          <ScrollArea className="h-[350px] w-full rounded-md overflow-y-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {dramaTechniques.map((technique: CategoryInterface) => (
                <Card
                  key={technique.id}
                  className={`cursor-pointer transition-all text-background bg-zinc-800 hover:bg-zinc-600 border-0 ${
                    selectedTechniques.includes(technique.name) ? 'ring-2 ring-red-600' : ''
                  }`}
                  onClick={() => handleTechniqueToggle(technique.name)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <h2 className="text-sm font-medium">{technique.name}</h2>
                    <Checkbox
                      checked={selectedTechniques.includes(technique.name)}
                      onCheckedChange={() => handleTechniqueToggle(technique.name)}
                      className="ml-2 border-0"
                      aria-label={`Select ${technique.name}`}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

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
      )}
    </div>
  );
}
