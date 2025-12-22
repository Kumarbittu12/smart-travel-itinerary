import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentItinerary, deleteActivity, addActivity, submitForReview, applySuggestion, togglePublic } from '@/store/slices/itinerarySlice';
import { addNotification } from '@/store/slices/notificationSlice';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  Share2,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Plus,
  Trash2,
  Copy,
  Download,
  Camera,
  Mountain,
  Waves,
  Utensils,
  Car,
  Home,
  MoreHorizontal,
  Send,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
  Lock,
  Check,
  FileText
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Activity, TripReviewStatus } from '@/types';

const categoryIcons: Record<string, any> = {
  sightseeing: Camera,
  adventure: Mountain,
  relaxation: Waves,
  food: Utensils,
  transport: Car,
  accommodation: Home,
  other: MoreHorizontal,
};

const categoryColors: Record<string, string> = {
  sightseeing: 'bg-ocean-light text-ocean',
  adventure: 'bg-forest-light text-forest',
  relaxation: 'bg-sunset-light text-sunset',
  food: 'bg-secondary text-secondary-foreground',
  transport: 'bg-muted text-muted-foreground',
  accommodation: 'bg-primary/10 text-primary',
  other: 'bg-muted text-muted-foreground',
};

const reviewStatusColors: Record<TripReviewStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  submitted: 'bg-sunset-light text-sunset',
  under_review: 'bg-ocean-light text-ocean',
  approved: 'bg-forest-light text-forest',
  rejected: 'bg-destructive/10 text-destructive',
};

const reviewStatusIcons: Record<TripReviewStatus, any> = {
  draft: FileText,
  submitted: Send,
  under_review: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

const reviewStatusLabels: Record<TripReviewStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted for Review',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Needs Changes',
};

export const ItineraryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentItinerary, items } = useAppSelector((state) => state.itineraries);
  const { user } = useAppSelector((state) => state.auth);
  const [selectedDay, setSelectedDay] = useState<string>('day-1');
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [activityDayId, setActivityDayId] = useState<string>('');
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(setCurrentItinerary(id));
    }
    return () => {
      dispatch(setCurrentItinerary(null));
    };
  }, [id, items, dispatch]);

  if (!currentItinerary) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Itinerary not found</p>
          <Link to="/itineraries">
            <Button className="mt-4">Back to Trips</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const budgetProgress = (currentItinerary.totalCost / currentItinerary.budget) * 100;
  const isOverBudget = currentItinerary.totalCost > currentItinerary.budget;
  const StatusIcon = reviewStatusIcons[currentItinerary.reviewStatus];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(currentItinerary, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `${currentItinerary.title.replace(/\s+/g, '_')}.json`);
    linkElement.click();
    toast.success('Itinerary exported!');
  };

  const handleDeleteActivity = (dayId: string, activityId: string) => {
    dispatch(deleteActivity({ itineraryId: currentItinerary.id, dayId, activityId }));
    toast.success('Activity removed');
  };

  const handleAddActivity = (formData: any) => {
    const newActivity: Omit<Activity, 'id'> = {
      name: formData.name,
      description: formData.description || '',
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration: 60,
      location: formData.location,
      cost: Number(formData.cost),
      category: formData.category,
    };

    dispatch(addActivity({
      itineraryId: currentItinerary.id,
      dayId: activityDayId,
      activity: newActivity,
    }));

    setIsAddActivityOpen(false);
    toast.success('Activity added!');
  };

  const handleSubmitForReview = () => {
    dispatch(submitForReview(currentItinerary.id));
    // Notify admins (in real app, this would go to all admins)
    const admins = JSON.parse(localStorage.getItem('travel_users') || '[]').filter((u: any) => u.role === 'admin');
    admins.forEach((admin: any) => {
      dispatch(addNotification({
        userId: admin.id,
        type: 'submission',
        title: 'New Itinerary Submitted',
        message: `${user?.name} submitted "${currentItinerary.title}" for review.`,
        relatedItineraryId: currentItinerary.id,
      }));
    });
    setIsSubmitDialogOpen(false);
    toast.success('Itinerary submitted for admin review!');
  };

  const handleApplySuggestion = (commentId: string) => {
    dispatch(applySuggestion({ itineraryId: currentItinerary.id, commentId }));
    toast.success('Suggestion applied!');
  };

  const handleTogglePublic = () => {
    dispatch(togglePublic(currentItinerary.id));
    toast.success(currentItinerary.isPublic ? 'Itinerary is now private' : 'Itinerary is now public');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
            <div className="flex items-start gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/itineraries')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-3xl font-display font-bold">{currentItinerary.title}</h1>
                  <Badge className={reviewStatusColors[currentItinerary.reviewStatus]}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {reviewStatusLabels[currentItinerary.reviewStatus]}
                  </Badge>
                  {currentItinerary.isPublic && (
                    <Badge variant="outline" className="gap-1">
                      <Globe className="h-3 w-3" />
                      Public
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {currentItinerary.destination}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(currentItinerary.startDate), 'MMM d')} - {format(new Date(currentItinerary.endDate), 'MMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {currentItinerary.days.length} days
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {currentItinerary.reviewStatus === 'draft' && (
                <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2 border-sunset text-sunset hover:bg-sunset/10">
                      <Send className="h-4 w-4" />
                      Submit for Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Submit for Admin Review</DialogTitle>
                      <DialogDescription>
                        Your itinerary will be reviewed by our travel experts. They may provide suggestions or approve it.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground">
                        Once submitted, you can still make edits, but admin feedback will help improve your trip plan.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleSubmitForReview} className="gap-2 bg-sunset hover:bg-sunset/90">
                        <Send className="h-4 w-4" />
                        Submit
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="outline" onClick={handleCopyLink} className="gap-2">
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copy Link</span>
              </Button>
              <Button variant="outline" onClick={handleExportJSON} className="gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Link to={`/itineraries/${currentItinerary.id}/edit`}>
                <Button className="btn-gradient gap-2">
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Admin Feedback Panel */}
              {currentItinerary.adminComments.length > 0 && (
                <Card className="border-0 shadow-soft border-l-4 border-l-ocean">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-ocean" />
                      Admin Feedback ({currentItinerary.adminComments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-[300px]">
                      <div className="space-y-4">
                        {currentItinerary.adminComments.map((comment) => (
                          <div key={comment.id} className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="font-medium">{comment.adminName}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              {comment.isApplied && (
                                <Badge variant="secondary" className="text-xs">
                                  <Check className="h-3 w-3 mr-1" />
                                  Applied
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm">{comment.message}</p>
                            {comment.suggestion && (
                              <div className="mt-3 p-3 bg-ocean-light rounded-lg">
                                <p className="text-xs font-medium text-ocean mb-1">Suggestion:</p>
                                <p className="text-sm">{comment.suggestion}</p>
                                {!comment.isApplied && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-2 text-xs"
                                    onClick={() => handleApplySuggestion(comment.id)}
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Mark as Applied
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {/* Budget Warning */}
              {isOverBudget && (
                <Card className="border-0 shadow-soft border-l-4 border-l-destructive bg-destructive/5">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <div>
                        <p className="font-medium text-destructive">Budget Exceeded!</p>
                        <p className="text-sm text-muted-foreground">
                          You're ${(currentItinerary.totalCost - currentItinerary.budget).toLocaleString()} over your budget.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Day Tabs */}
              <Card className="border-0 shadow-soft">
                <Tabs value={selectedDay} onValueChange={setSelectedDay}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Day-by-Day Itinerary</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="w-full">
                      <TabsList className="inline-flex h-auto gap-2 bg-transparent p-0 mb-4">
                        {currentItinerary.days.map((day) => (
                          <TabsTrigger
                            key={day.id}
                            value={`day-${day.dayNumber}`}
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2"
                          >
                            <div className="text-center">
                              <div className="text-xs opacity-70">Day {day.dayNumber}</div>
                              <div className="text-sm font-medium">
                                {format(new Date(day.date), 'MMM d')}
                              </div>
                            </div>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </ScrollArea>

                    {currentItinerary.days.map((day) => (
                      <TabsContent key={day.id} value={`day-${day.dayNumber}`} className="mt-0">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold">
                                {format(new Date(day.date), 'EEEE, MMMM d, yyyy')}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {day.activities.length} activities • ${day.totalCost.toLocaleString()} total
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              onClick={() => {
                                setActivityDayId(day.id);
                                setIsAddActivityOpen(true);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                              Add
                            </Button>
                          </div>

                          {day.activities.length > 0 ? (
                            <div className="relative">
                              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border" />

                              {day.activities.map((activity, idx) => {
                                const Icon = categoryIcons[activity.category] || MoreHorizontal;
                                return (
                                  <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="relative flex gap-4 pb-4"
                                  >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${categoryColors[activity.category]}`}>
                                      <Icon className="h-5 w-5" />
                                    </div>

                                    <div className="flex-1 bg-muted/30 rounded-lg p-4 group">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium text-muted-foreground">
                                              {activity.startTime} - {activity.endTime}
                                            </span>
                                          </div>
                                          <h4 className="font-medium">{activity.name}</h4>
                                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                              <MapPin className="h-3.5 w-3.5" />
                                              {activity.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                              <DollarSign className="h-3.5 w-3.5" />
                                              {activity.cost}
                                            </span>
                                          </div>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                                          onClick={() => handleDeleteActivity(day.id, activity.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <p>No activities planned for this day</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 gap-1"
                                onClick={() => {
                                  setActivityDayId(day.id);
                                  setIsAddActivityOpen(true);
                                }}
                              >
                                <Plus className="h-4 w-4" />
                                Add Activity
                              </Button>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    ))}
                  </CardContent>
                </Tabs>
              </Card>

              {/* Notes & Media */}
              {currentItinerary.description && (
                <Card className="border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{currentItinerary.description}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Review Status Card */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <StatusIcon className="h-5 w-5 text-primary" />
                    Trip Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`p-4 rounded-lg ${reviewStatusColors[currentItinerary.reviewStatus]}`}>
                    <p className="font-medium">{reviewStatusLabels[currentItinerary.reviewStatus]}</p>
                    {currentItinerary.reviewedBy && (
                      <p className="text-sm mt-1">Reviewed by {currentItinerary.reviewedBy}</p>
                    )}
                  </div>

                  <Separator />

                  {/* Visibility Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {currentItinerary.isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      <span className="text-sm font-medium">
                        {currentItinerary.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                    <Switch
                      checked={currentItinerary.isPublic}
                      onCheckedChange={handleTogglePublic}
                    />
                  </div>
                  {currentItinerary.isPublic && currentItinerary.shareLink && (
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      <p className="font-medium mb-1">Share Link:</p>
                      <p className="truncate">{currentItinerary.shareLink}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Budget Summary */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-forest" />
                    Budget Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Total Budget</span>
                      <span className="font-semibold">${currentItinerary.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Spent</span>
                      <span className={`font-semibold ${isOverBudget ? 'text-destructive' : ''}`}>
                        ${currentItinerary.totalCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className={`font-semibold ${isOverBudget ? 'text-destructive' : 'text-forest'}`}>
                        ${(currentItinerary.budget - currentItinerary.totalCost).toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(budgetProgress, 100)} 
                      className={`h-2 ${isOverBudget ? '[&>div]:bg-destructive' : ''}`}
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      {budgetProgress.toFixed(0)}% of budget used
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">Daily Expenses</h4>
                    <div className="space-y-2">
                      {currentItinerary.days.map((day) => (
                        <div key={day.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Day {day.dayNumber}</span>
                          <span>${day.totalCost.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trip Progress */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-sunset" />
                    Trip Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentItinerary.days.map((day, idx) => {
                      const today = new Date();
                      const dayDate = new Date(day.date);
                      const isPast = dayDate < today;
                      const isToday = dayDate.toDateString() === today.toDateString();
                      
                      return (
                        <div key={day.id} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            isPast ? 'bg-forest text-forest-foreground' : 
                            isToday ? 'bg-sunset text-sunset-foreground' : 
                            'bg-muted text-muted-foreground'
                          }`}>
                            {isPast ? <Check className="h-4 w-4" /> : day.dayNumber}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${isToday ? 'text-sunset' : ''}`}>
                              Day {day.dayNumber} {isToday && '(Today)'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {day.activities.length} activities
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Add Activity Dialog */}
          <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Activity</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAddActivity(Object.fromEntries(formData));
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Activity Name</Label>
                  <Input id="name" name="name" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" className="mt-1.5" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input id="startTime" name="startTime" type="time" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input id="endTime" name="endTime" type="time" required className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" required className="mt-1.5" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cost">Cost ($)</Label>
                    <Input id="cost" name="cost" type="number" min="0" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" defaultValue="sightseeing">
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sightseeing">Sightseeing</SelectItem>
                        <SelectItem value="adventure">Adventure</SelectItem>
                        <SelectItem value="relaxation">Relaxation</SelectItem>
                        <SelectItem value="food">Food & Dining</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="accommodation">Accommodation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddActivityOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Activity</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ItineraryDetailsPage;
