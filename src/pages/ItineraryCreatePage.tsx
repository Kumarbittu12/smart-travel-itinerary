import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createItinerary } from '@/store/slices/itinerarySlice';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { 
  CalendarIcon, 
  MapPin, 
  DollarSign, 
  Loader2, 
  ArrowLeft,
  Sparkles,
  Mountain,
  Waves,
  Camera
} from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { DayPlan, Activity } from '@/types';

const itinerarySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  destination: z.string().min(2, 'Please enter a destination'),
  description: z.string().optional(),
  budget: z.number().min(1, 'Budget must be greater than 0'),
  preferences: z.array(z.enum(['sightseeing', 'adventure', 'relaxation'])),
});

type ItineraryFormData = z.infer<typeof itinerarySchema>;

const preferenceOptions = [
  { id: 'sightseeing', label: 'Sightseeing', icon: Camera, description: 'Museums, landmarks, tours' },
  { id: 'adventure', label: 'Adventure', icon: Mountain, description: 'Hiking, sports, activities' },
  { id: 'relaxation', label: 'Relaxation', icon: Waves, description: 'Beaches, spas, leisure' },
];

// Mock activity generator
const generateActivities = (preferences: string[], dayNumber: number): Activity[] => {
  const activities: Activity[] = [];
  const baseActivities = {
    sightseeing: [
      { name: 'City Walking Tour', location: 'City Center', cost: 25, category: 'sightseeing' as const },
      { name: 'Museum Visit', location: 'Art District', cost: 15, category: 'sightseeing' as const },
      { name: 'Historic Landmark', location: 'Old Town', cost: 10, category: 'sightseeing' as const },
    ],
    adventure: [
      { name: 'Hiking Trail', location: 'National Park', cost: 20, category: 'adventure' as const },
      { name: 'Water Sports', location: 'Beach Area', cost: 50, category: 'adventure' as const },
      { name: 'Bike Tour', location: 'Countryside', cost: 35, category: 'adventure' as const },
    ],
    relaxation: [
      { name: 'Spa Treatment', location: 'Wellness Center', cost: 80, category: 'relaxation' as const },
      { name: 'Beach Day', location: 'Coastal Area', cost: 15, category: 'relaxation' as const },
      { name: 'Garden Visit', location: 'Botanical Gardens', cost: 12, category: 'relaxation' as const },
    ],
  };

  let startHour = 9;
  preferences.forEach((pref) => {
    const prefActivities = baseActivities[pref as keyof typeof baseActivities] || [];
    const activity = prefActivities[dayNumber % prefActivities.length];
    if (activity) {
      const duration = Math.floor(Math.random() * 120) + 60; // 1-3 hours
      activities.push({
        id: uuidv4(),
        name: activity.name,
        description: `Enjoy ${activity.name.toLowerCase()} at ${activity.location}`,
        startTime: `${String(startHour).padStart(2, '0')}:00`,
        endTime: `${String(startHour + Math.ceil(duration / 60)).padStart(2, '0')}:00`,
        duration,
        location: activity.location,
        cost: activity.cost + Math.floor(Math.random() * 20),
        category: activity.category,
      });
      startHour += Math.ceil(duration / 60) + 1;
    }
  });

  // Add meals
  activities.push({
    id: uuidv4(),
    name: 'Lunch',
    description: 'Local cuisine experience',
    startTime: '12:30',
    endTime: '14:00',
    duration: 90,
    location: 'Local Restaurant',
    cost: 25 + Math.floor(Math.random() * 15),
    category: 'food',
  });

  activities.push({
    id: uuidv4(),
    name: 'Dinner',
    description: 'Evening dining',
    startTime: '19:00',
    endTime: '21:00',
    duration: 120,
    location: 'Restaurant District',
    cost: 40 + Math.floor(Math.random() * 20),
    category: 'food',
  });

  return activities.sort((a, b) => a.startTime.localeCompare(b.startTime));
};

export const ItineraryCreatePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ItineraryFormData>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: {
      preferences: [],
    },
  });

  const selectedPreferences = watch('preferences');

  const onSubmit = async (data: ItineraryFormData) => {
    if (!dateRange.from || !dateRange.to) {
      toast.error('Please select travel dates');
      return;
    }

    if (!user) {
      toast.error('Please log in first');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate days with activities
    const numDays = differenceInDays(dateRange.to, dateRange.from) + 1;
    const days: DayPlan[] = [];

    for (let i = 0; i < numDays; i++) {
      const dayDate = addDays(dateRange.from, i);
      const activities = generateActivities(data.preferences, i);
      days.push({
        id: uuidv4(),
        date: dayDate.toISOString(),
        dayNumber: i + 1,
        activities,
        totalCost: activities.reduce((sum, a) => sum + a.cost, 0),
      });
    }

    dispatch(createItinerary({
      userId: user.id,
      userName: user.name,
      title: data.title,
      destination: data.destination,
      description: data.description,
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
      budget: data.budget,
      preferences: data.preferences,
      days,
      status: 'planned',
    }));

    setIsLoading(false);
    toast.success('Itinerary created successfully!');
    navigate('/itineraries');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold">Plan New Trip</h1>
              <p className="text-muted-foreground">Create your perfect itinerary</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Trip Details</CardTitle>
                <CardDescription>Basic information about your trip</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Trip Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Summer in Paris"
                    {...register('title')}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="destination"
                      placeholder="Where are you going?"
                      className="pl-10"
                      {...register('destination')}
                    />
                  </div>
                  {errors.destination && (
                    <p className="text-sm text-destructive">{errors.destination.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add notes about your trip..."
                    rows={3}
                    {...register('description')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dates */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Travel Dates</CardTitle>
                <CardDescription>When are you traveling?</CardDescription>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        "Select your travel dates"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date()}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {dateRange.from && dateRange.to && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {differenceInDays(dateRange.to, dateRange.from) + 1} days trip
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Budget */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Budget</CardTitle>
                <CardDescription>Set your spending limit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="0"
                    className="pl-10"
                    {...register('budget', { valueAsNumber: true })}
                  />
                </div>
                {errors.budget && (
                  <p className="text-sm text-destructive mt-2">{errors.budget.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-sunset" />
                  Travel Preferences
                </CardTitle>
                <CardDescription>We'll generate activities based on your interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {preferenceOptions.map((pref) => {
                    const Icon = pref.icon;
                    const isSelected = selectedPreferences.includes(pref.id as any);
                    return (
                      <label
                        key={pref.id}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            const current = selectedPreferences;
                            if (checked) {
                              setValue('preferences', [...current, pref.id as any]);
                            } else {
                              setValue('preferences', current.filter(p => p !== pref.id));
                            }
                          }}
                          className="sr-only"
                        />
                        <Icon className={cn("h-8 w-8", isSelected ? "text-primary" : "text-muted-foreground")} />
                        <span className="font-medium">{pref.label}</span>
                        <span className="text-xs text-muted-foreground text-center">{pref.description}</span>
                      </label>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 btn-gradient" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Trip...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Itinerary
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ItineraryCreatePage;
