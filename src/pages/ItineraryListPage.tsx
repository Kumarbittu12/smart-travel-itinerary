import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setFilters, resetFilters, deleteItinerary } from '@/store/slices/itinerarySlice';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign,
  Filter,
  ArrowUpDown,
  Trash2,
  Edit,
  Eye,
  Plane
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Itinerary } from '@/types';

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  planned: 'bg-ocean-light text-ocean',
  ongoing: 'bg-sunset-light text-sunset',
  completed: 'bg-forest-light text-forest',
};

export const ItineraryListPage = () => {
  const dispatch = useAppDispatch();
  const { items, filters } = useAppSelector((state) => state.itineraries);
  const { user } = useAppSelector((state) => state.auth);
  const [searchDebounce, setSearchDebounce] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchDebounce }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchDebounce, dispatch]);

  // Filter user's itineraries
  const userItineraries = items.filter(i => i.userId === user?.id);

  // Apply filters and sorting
  const filteredItineraries = useMemo(() => {
    let result = [...userItineraries];

    // Search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(i => 
        i.title.toLowerCase().includes(searchLower) ||
        i.destination.toLowerCase().includes(searchLower)
      );
    }

    // Destination filter
    if (filters.destination) {
      result = result.filter(i => 
        i.destination.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      result = result.filter(i => i.status === filters.status);
    }

    // Budget range
    result = result.filter(i => 
      i.budget >= filters.budgetRange.min && i.budget <= filters.budgetRange.max
    );

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case 'budget':
          comparison = a.budget - b.budget;
          break;
        case 'destination':
          comparison = a.destination.localeCompare(b.destination);
          break;
        case 'created':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [userItineraries, filters]);

  const handleDelete = (id: string) => {
    dispatch(deleteItinerary(id));
    toast.success('Itinerary deleted successfully');
  };

  const uniqueDestinations = [...new Set(userItineraries.map(i => i.destination))];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">My Trips</h1>
            <p className="text-muted-foreground">
              {userItineraries.length} {userItineraries.length === 1 ? 'itinerary' : 'itineraries'} total
            </p>
          </div>
          <Link to="/itineraries/new">
            <Button className="btn-gradient gap-2">
              <Plus className="h-4 w-4" />
              Plan New Trip
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trips..."
                  value={searchDebounce}
                  onChange={(e) => setSearchDebounce(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value: any) => dispatch(setFilters({ sortBy: value }))}
                >
                  <SelectTrigger className="w-40">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created">Date Created</SelectItem>
                    <SelectItem value="date">Trip Date</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="destination">Destination</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid md:grid-cols-3 gap-4 pt-4 mt-4 border-t">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Destination</label>
                      <Select
                        value={filters.destination}
                        onValueChange={(value) => dispatch(setFilters({ destination: value === 'all' ? '' : value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All destinations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All destinations</SelectItem>
                          {uniqueDestinations.map(dest => (
                            <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Status</label>
                      <Select
                        value={filters.status}
                        onValueChange={(value) => dispatch(setFilters({ status: value === 'all' ? '' : value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="planned">Planned</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="ghost"
                        onClick={() => dispatch(resetFilters())}
                        className="w-full"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Itineraries Grid */}
        {filteredItineraries.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredItineraries.map((itinerary, i) => (
                <ItineraryCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  index={i}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState hasItineraries={userItineraries.length > 0} />
        )}
      </div>
    </MainLayout>
  );
};

interface ItineraryCardProps {
  itinerary: Itinerary;
  index: number;
  onDelete: (id: string) => void;
}

const ItineraryCard = ({ itinerary, index, onDelete }: ItineraryCardProps) => {
  const daysCount = itinerary.days.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="group h-full card-hover overflow-hidden border-0 shadow-soft">
        {/* Cover Image or Gradient */}
        <div 
          className="h-32 relative"
          style={{ 
            background: itinerary.coverImage 
              ? `url(${itinerary.coverImage}) center/cover`
              : 'var(--gradient-ocean)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          <Badge className={`absolute top-3 right-3 ${statusColors[itinerary.status]}`}>
            {itinerary.status}
          </Badge>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-1">{itinerary.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">{itinerary.destination}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-ocean" />
            <span>
              {format(new Date(itinerary.startDate), 'MMM d')} - {format(new Date(itinerary.endDate), 'MMM d, yyyy')}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 text-forest" />
              <span>${itinerary.budget.toLocaleString()}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {daysCount} {daysCount === 1 ? 'day' : 'days'}
            </span>
          </div>

          {/* Budget Progress */}
          <div className="pt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Spent</span>
              <span className={itinerary.totalCost > itinerary.budget ? 'text-destructive' : 'text-muted-foreground'}>
                ${itinerary.totalCost.toLocaleString()} / ${itinerary.budget.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  itinerary.totalCost > itinerary.budget ? 'bg-destructive' : 'bg-primary'
                }`}
                style={{ width: `${Math.min((itinerary.totalCost / itinerary.budget) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link to={`/itineraries/${itinerary.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full gap-1">
                <Eye className="h-3.5 w-3.5" />
                View
              </Button>
            </Link>
            <Link to={`/itineraries/${itinerary.id}/edit`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full gap-1">
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Itinerary?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete "{itinerary.title}". This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(itinerary.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EmptyState = ({ hasItineraries }: { hasItineraries: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16"
  >
    <div className="relative mb-6">
      <Plane className="h-16 w-16 mx-auto text-muted-foreground" />
      <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
    </div>
    <h3 className="text-xl font-semibold mb-2">
      {hasItineraries ? 'No matching trips found' : 'No trips yet'}
    </h3>
    <p className="text-muted-foreground mb-6">
      {hasItineraries 
        ? 'Try adjusting your filters or search terms'
        : 'Start planning your first adventure!'
      }
    </p>
    {!hasItineraries && (
      <Link to="/itineraries/new">
        <Button className="btn-gradient gap-2">
          <Plus className="h-4 w-4" />
          Create Your First Trip
        </Button>
      </Link>
    )}
  </motion.div>
);

export default ItineraryListPage;
