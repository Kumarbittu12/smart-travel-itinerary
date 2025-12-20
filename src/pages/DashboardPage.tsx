import { useMemo, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  Map, 
  TrendingUp, 
  DollarSign,
  MapPin,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  Send,
  Eye,
  Filter,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateReviewStatus, addAdminComment } from '@/store/slices/itinerarySlice';
import { addNotification } from '@/store/slices/notificationSlice';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { DashboardStats, AdminDashboardFilters, Itinerary, TripReviewStatus } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const reviewStatusColors: Record<TripReviewStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  submitted: 'bg-sunset-light text-sunset',
  under_review: 'bg-ocean-light text-ocean',
  approved: 'bg-forest-light text-forest',
  rejected: 'bg-destructive/10 text-destructive',
};

const reviewStatusLabels: Record<TripReviewStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

const CHART_COLORS = ['hsl(174, 62%, 40%)', 'hsl(195, 80%, 45%)', 'hsl(25, 95%, 55%)', 'hsl(150, 50%, 40%)', 'hsl(350, 80%, 55%)'];

export const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items: itineraries } = useAppSelector((state) => state.itineraries);
  
  const [filters, setFilters] = useState<AdminDashboardFilters>({
    destination: '',
    budgetMin: 0,
    budgetMax: 100000,
    dateFrom: null,
    dateTo: null,
    reviewStatus: '',
  });
  
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [commentText, setCommentText] = useState('');
  const [suggestionText, setSuggestionText] = useState('');
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Generate dashboard stats
  const stats = useMemo((): DashboardStats => {
    const users = JSON.parse(localStorage.getItem('travel_users') || '[]');
    
    const destinationCounts: Record<string, number> = {};
    itineraries.forEach((i) => {
      destinationCounts[i.destination] = (destinationCounts[i.destination] || 0) + 1;
    });
    const popularDestinations = Object.entries(destinationCounts)
      .map(([destination, count]) => ({ destination, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    if (popularDestinations.length === 0) {
      popularDestinations.push(
        { destination: 'Paris, France', count: 24 },
        { destination: 'Tokyo, Japan', count: 18 },
        { destination: 'New York, USA', count: 15 },
        { destination: 'Bali, Indonesia', count: 12 },
        { destination: 'London, UK', count: 10 }
      );
    }

    const recentActivity = itineraries
      .slice(0, 10)
      .map((i) => ({
        action: i.reviewStatus === 'submitted' ? 'Submitted for review' : 'Created itinerary',
        user: i.userName || 'User',
        timestamp: i.updatedAt,
        details: i.title,
        type: i.reviewStatus,
      }));

    const itinerariesByMonth = [
      { month: 'Jan', count: 45 },
      { month: 'Feb', count: 52 },
      { month: 'Mar', count: 48 },
      { month: 'Apr', count: 61 },
      { month: 'May', count: 55 },
      { month: 'Jun', count: 67 + itineraries.length },
    ];

    const budgetDistribution = [
      { range: '$0-500', count: itineraries.filter((i) => i.budget <= 500).length || 25 },
      { range: '$500-1k', count: itineraries.filter((i) => i.budget > 500 && i.budget <= 1000).length || 45 },
      { range: '$1k-2k', count: itineraries.filter((i) => i.budget > 1000 && i.budget <= 2000).length || 35 },
      { range: '$2k-5k', count: itineraries.filter((i) => i.budget > 2000 && i.budget <= 5000).length || 20 },
      { range: '$5k+', count: itineraries.filter((i) => i.budget > 5000).length || 10 },
    ];

    const pendingReviews = itineraries.filter((i) => i.reviewStatus === 'submitted' || i.reviewStatus === 'under_review').length;
    const approvedItineraries = itineraries.filter((i) => i.reviewStatus === 'approved').length;
    const rejectedItineraries = itineraries.filter((i) => i.reviewStatus === 'rejected').length;

    return {
      totalUsers: Math.max(users.length, 156),
      activeUsers: Math.max(Math.floor(users.length * 0.7), 89),
      totalItineraries: Math.max(itineraries.length, 342),
      pendingReviews: Math.max(pendingReviews, 12),
      approvedItineraries: Math.max(approvedItineraries, 280),
      rejectedItineraries: Math.max(rejectedItineraries, 15),
      popularDestinations,
      recentActivity,
      itinerariesByMonth,
      budgetDistribution,
    };
  }, [itineraries]);

  // Filter itineraries for review
  const filteredItineraries = useMemo(() => {
    return itineraries.filter((i) => {
      if (filters.destination && !i.destination.toLowerCase().includes(filters.destination.toLowerCase())) return false;
      if (filters.budgetMin && i.budget < filters.budgetMin) return false;
      if (filters.budgetMax && i.budget > filters.budgetMax) return false;
      if (filters.reviewStatus && i.reviewStatus !== filters.reviewStatus) return false;
      return true;
    });
  }, [itineraries, filters]);

  const pendingItineraries = filteredItineraries.filter(
    (i) => i.reviewStatus === 'submitted' || i.reviewStatus === 'under_review'
  );

  const handleApprove = (itinerary: Itinerary) => {
    dispatch(updateReviewStatus({
      itineraryId: itinerary.id,
      status: 'approved',
      adminId: user?.id,
      adminName: user?.name,
    }));
    dispatch(addNotification({
      userId: itinerary.userId,
      type: 'approval',
      title: 'Itinerary Approved! 🎉',
      message: `Your itinerary "${itinerary.title}" has been approved by ${user?.name}.`,
      relatedItineraryId: itinerary.id,
    }));
    toast.success('Itinerary approved!');
  };

  const handleReject = (itinerary: Itinerary) => {
    dispatch(updateReviewStatus({
      itineraryId: itinerary.id,
      status: 'rejected',
      adminId: user?.id,
      adminName: user?.name,
    }));
    dispatch(addNotification({
      userId: itinerary.userId,
      type: 'rejection',
      title: 'Itinerary Needs Changes',
      message: `Your itinerary "${itinerary.title}" was not approved. Please review the admin feedback.`,
      relatedItineraryId: itinerary.id,
    }));
    toast.info('Itinerary marked for revision');
  };

  const handleAddComment = () => {
    if (!selectedItinerary || !commentText.trim()) return;
    
    dispatch(addAdminComment({
      itineraryId: selectedItinerary.id,
      adminId: user?.id || '',
      adminName: user?.name || 'Admin',
      message: commentText,
      suggestion: suggestionText || undefined,
    }));
    dispatch(addNotification({
      userId: selectedItinerary.userId,
      type: suggestionText ? 'suggestion' : 'comment',
      title: suggestionText ? 'New Suggestion from Admin' : 'New Comment from Admin',
      message: `${user?.name} left feedback on "${selectedItinerary.title}"`,
      relatedItineraryId: selectedItinerary.id,
    }));
    
    setCommentText('');
    setSuggestionText('');
    setIsCommentDialogOpen(false);
    toast.success('Comment added and traveler notified!');
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-ocean', bgColor: 'bg-ocean-light', trend: '+12%', trendUp: true },
    { title: 'Active Travelers', value: stats.activeUsers, icon: UserCheck, color: 'text-forest', bgColor: 'bg-forest-light', trend: '+8%', trendUp: true },
    { title: 'Total Itineraries', value: stats.totalItineraries, icon: Map, color: 'text-primary', bgColor: 'bg-primary/10', trend: '+23%', trendUp: true },
    { title: 'Pending Reviews', value: stats.pendingReviews, icon: Clock, color: 'text-sunset', bgColor: 'bg-sunset-light', trend: `${pendingItineraries.length}`, trendUp: false },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage travelers, review itineraries, and monitor platform activity</p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                  <Card className="border-0 shadow-soft card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                          <Icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${stat.trendUp ? 'text-forest' : 'text-sunset'}`}>
                          {stat.trendUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                          {stat.trend}
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="overview" className="gap-2"><TrendingUp className="h-4 w-4" />Overview</TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2"><FileText className="h-4 w-4" />Pending Reviews ({pendingItineraries.length})</TabsTrigger>
              <TabsTrigger value="all" className="gap-2"><Map className="h-4 w-4" />All Itineraries</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Charts */}
                <Card className="border-0 shadow-soft lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-forest" />
                      Itineraries Created (Last 6 Months)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={stats.itinerariesByMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                        <Bar dataKey="count" fill="hsl(174, 62%, 40%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Popular Destinations */}
                <Card className="border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Popular Destinations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.popularDestinations.map((dest, i) => (
                        <div key={dest.destination} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-muted-foreground w-5">{i + 1}.</span>
                            <span className="font-medium">{dest.destination}</span>
                          </div>
                          <Badge variant="secondary">{dest.count} trips</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Distribution Pie Chart */}
                <Card className="border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-ocean" />
                      Budget Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={stats.budgetDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="count" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                          {stats.budgetDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-2 mt-2 justify-center">
                      {stats.budgetDistribution.map((item, i) => (
                        <div key={item.range} className="flex items-center gap-1 text-xs">
                          <div className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS[i] }} />
                          {item.range}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-0 shadow-soft lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-sunset" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[250px]">
                      <div className="space-y-3">
                        {stats.recentActivity.map((activity, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-4 p-3 rounded-lg bg-muted/30">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">{activity.action}</span>
                                <span className="text-muted-foreground">by</span>
                                <span className="font-medium">{activity.user}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{activity.details}</p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              {pendingItineraries.length > 0 ? (
                <div className="space-y-4">
                  {pendingItineraries.map((itinerary) => (
                    <Card key={itinerary.id} className="border-0 shadow-soft">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{itinerary.title}</h3>
                              <Badge className={reviewStatusColors[itinerary.reviewStatus]}>
                                {reviewStatusLabels[itinerary.reviewStatus]}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{itinerary.destination}</span>
                              <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />${itinerary.budget.toLocaleString()}</span>
                              <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{itinerary.days.length} days</span>
                              <span>by {itinerary.userName || 'Unknown'}</span>
                            </div>
                            {itinerary.submittedAt && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Submitted {format(new Date(itinerary.submittedAt), 'MMM d, yyyy h:mm a')}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Link to={`/itineraries/${itinerary.id}`}>
                              <Button variant="outline" size="sm" className="gap-1"><Eye className="h-4 w-4" />View</Button>
                            </Link>
                            <Dialog open={isCommentDialogOpen && selectedItinerary?.id === itinerary.id} onOpenChange={(open) => { setIsCommentDialogOpen(open); if (open) setSelectedItinerary(itinerary); }}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-1"><MessageSquare className="h-4 w-4" />Comment</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add Feedback</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div>
                                    <Label>Comment</Label>
                                    <Textarea placeholder="Add your feedback..." value={commentText} onChange={(e) => setCommentText(e.target.value)} className="mt-1.5" />
                                  </div>
                                  <div>
                                    <Label>Suggestion (Optional)</Label>
                                    <Textarea placeholder="Add a specific suggestion the traveler can apply..." value={suggestionText} onChange={(e) => setSuggestionText(e.target.value)} className="mt-1.5" />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsCommentDialogOpen(false)}>Cancel</Button>
                                  <Button onClick={handleAddComment} disabled={!commentText.trim()} className="gap-2"><Send className="h-4 w-4" />Send</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button size="sm" variant="outline" className="gap-1 text-destructive hover:bg-destructive/10" onClick={() => handleReject(itinerary)}>
                              <XCircle className="h-4 w-4" />Reject
                            </Button>
                            <Button size="sm" className="gap-1 bg-forest hover:bg-forest/90" onClick={() => handleApprove(itinerary)}>
                              <CheckCircle className="h-4 w-4" />Approve
                            </Button>
                          </div>
                        </div>
                        {itinerary.adminComments.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium mb-2">Previous Comments ({itinerary.adminComments.length})</p>
                            <div className="space-y-2">
                              {itinerary.adminComments.slice(-2).map((comment) => (
                                <div key={comment.id} className="text-sm bg-muted/50 rounded p-2">
                                  <span className="font-medium">{comment.adminName}:</span> {comment.message}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-0 shadow-soft">
                  <CardContent className="py-16 text-center">
                    <CheckCircle className="h-16 w-16 mx-auto text-forest mb-4" />
                    <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
                    <p className="text-muted-foreground">No pending reviews at the moment.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* All Itineraries Tab */}
            <TabsContent value="all" className="space-y-6">
              {/* Filters */}
              <Card className="border-0 shadow-soft">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <Label className="text-xs">Destination</Label>
                      <Input placeholder="Search destination..." value={filters.destination} onChange={(e) => setFilters({ ...filters, destination: e.target.value })} className="mt-1" />
                    </div>
                    <div className="w-32">
                      <Label className="text-xs">Min Budget</Label>
                      <Input type="number" placeholder="0" value={filters.budgetMin || ''} onChange={(e) => setFilters({ ...filters, budgetMin: Number(e.target.value) })} className="mt-1" />
                    </div>
                    <div className="w-32">
                      <Label className="text-xs">Max Budget</Label>
                      <Input type="number" placeholder="100000" value={filters.budgetMax || ''} onChange={(e) => setFilters({ ...filters, budgetMax: Number(e.target.value) })} className="mt-1" />
                    </div>
                    <div className="w-40">
                      <Label className="text-xs">Review Status</Label>
                      <Select value={filters.reviewStatus} onValueChange={(value) => setFilters({ ...filters, reviewStatus: value })}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="All" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" onClick={() => setFilters({ destination: '', budgetMin: 0, budgetMax: 100000, dateFrom: null, dateTo: null, reviewStatus: '' })}>
                      <Filter className="h-4 w-4 mr-2" />Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Itinerary List */}
              <div className="space-y-3">
                {filteredItineraries.map((itinerary) => (
                  <Card key={itinerary.id} className="border-0 shadow-soft">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{itinerary.title}</h4>
                              <Badge className={reviewStatusColors[itinerary.reviewStatus]} variant="secondary">
                                {reviewStatusLabels[itinerary.reviewStatus]}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {itinerary.destination} • ${itinerary.budget.toLocaleString()} • {itinerary.days.length} days
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to={`/itineraries/${itinerary.id}`}>
                            <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredItineraries.length === 0 && (
                  <Card className="border-0 shadow-soft">
                    <CardContent className="py-12 text-center text-muted-foreground">
                      No itineraries match your filters.
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
