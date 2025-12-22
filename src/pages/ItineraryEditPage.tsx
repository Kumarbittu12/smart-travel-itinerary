import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentItinerary, updateItinerary } from '@/store/slices/itinerarySlice';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft,
  Loader2,
  Save,
  MapPin,
  DollarSign,
  Camera,
  Mountain,
  Waves
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const itinerarySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  destination: z.string().min(2, 'Please enter a destination'),
  description: z.string().optional(),
  budget: z.number().min(1, 'Budget must be greater than 0'),
  status: z.enum(['draft', 'planned', 'ongoing', 'completed']),
  preferences: z.array(z.enum(['sightseeing', 'adventure', 'relaxation'])),
});

type ItineraryFormData = z.infer<typeof itinerarySchema>;

const preferenceOptions = [
  { id: 'sightseeing', label: 'Sightseeing', icon: Camera },
  { id: 'adventure', label: 'Adventure', icon: Mountain },
  { id: 'relaxation', label: 'Relaxation', icon: Waves },
];

export const ItineraryEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentItinerary, items } = useAppSelector((state) => state.itineraries);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(setCurrentItinerary(id));
    }
    return () => {
      dispatch(setCurrentItinerary(null));
    };
  }, [id, items, dispatch]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ItineraryFormData>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: {
      preferences: [],
    },
  });

  // Update form when itinerary loads
  useEffect(() => {
    if (currentItinerary) {
      reset({
        title: currentItinerary.title,
        destination: currentItinerary.destination,
        description: currentItinerary.description || '',
        budget: currentItinerary.budget,
        status: currentItinerary.status,
        preferences: currentItinerary.preferences,
      });
    }
  }, [currentItinerary, reset]);

  const selectedPreferences = watch('preferences');
  const selectedStatus = watch('status');

  const onSubmit = async (data: ItineraryFormData) => {
    if (!currentItinerary) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    dispatch(updateItinerary({
      id: currentItinerary.id,
      updates: {
        title: data.title,
        destination: data.destination,
        description: data.description,
        budget: data.budget,
        status: data.status,
        preferences: data.preferences,
      },
    }));

    setIsLoading(false);
    toast.success('Itinerary updated!');
    navigate(`/itineraries/${currentItinerary.id}`);
  };

  if (!currentItinerary) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </MainLayout>
    );
  }

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
              <h1 className="text-3xl font-display font-bold">Edit Trip</h1>
              <p className="text-muted-foreground">Update your itinerary details</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Trip Details</CardTitle>
                <CardDescription>Update basic information about your trip</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Trip Title</Label>
                  <Input id="title" {...register('title')} />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="destination" className="pl-10" {...register('destination')} />
                  </div>
                  {errors.destination && (
                    <p className="text-sm text-destructive">{errors.destination.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" rows={3} {...register('description')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={selectedStatus}
                    onValueChange={(value: any) => setValue('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Budget */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Budget</CardTitle>
                <CardDescription>
                  Current spending: ${currentItinerary.totalCost.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
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
                <CardTitle className="text-lg">Travel Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {preferenceOptions.map((pref) => {
                    const Icon = pref.icon;
                    const isSelected = selectedPreferences?.includes(pref.id as any);
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
                            const current = selectedPreferences || [];
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
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

export default ItineraryEditPage;
