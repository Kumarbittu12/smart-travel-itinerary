import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Compass, 
  Map, 
  Calendar, 
  DollarSign, 
  Share2, 
  ArrowRight,
  Plane,
  Mountain,
  Palmtree,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Calendar,
    title: 'Day-by-Day Planning',
    description: 'Create detailed itineraries with activities, timings, and locations for each day of your trip.',
  },
  {
    icon: DollarSign,
    title: 'Budget Tracking',
    description: 'Monitor your spending in real-time with automatic expense calculations and budget alerts.',
  },
  {
    icon: Map,
    title: 'Smart Organization',
    description: 'Keep all your travel details in one place - notes, media, reservations, and more.',
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share your itineraries with travel companions or export them for offline access.',
  },
];

const destinations = [
  { name: 'Paris', icon: '🗼', color: 'bg-sunset-light' },
  { name: 'Tokyo', icon: '🏯', color: 'bg-ocean-light' },
  { name: 'Bali', icon: '🌴', color: 'bg-forest-light' },
  { name: 'New York', icon: '🗽', color: 'bg-secondary' },
];

const Index = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ background: 'var(--gradient-hero)' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--ocean)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--sunset)/0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Compass className="h-4 w-4" />
                Smart Travel Planning Made Simple
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
                Plan Your Perfect
                <span className="block gradient-text">Adventure</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Create stunning itineraries, track your budget in real-time, and organize every detail 
                of your journey with our intelligent travel planner.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to={isAuthenticated ? '/itineraries/new' : '/register'}>
                  <Button size="lg" className="btn-gradient text-lg px-8 h-12 gap-2">
                    Start Planning
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to={isAuthenticated ? '/itineraries' : '/login'}>
                  <Button size="lg" variant="outline" className="text-lg px-8 h-12">
                    {isAuthenticated ? 'View My Trips' : 'Sign In'}
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Floating Icons */}
            <div className="relative mt-16 h-32 hidden md:block">
              <motion.div
                className="absolute left-[10%] top-0"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="p-4 rounded-2xl bg-card shadow-medium">
                  <Plane className="h-8 w-8 text-ocean" />
                </div>
              </motion.div>
              <motion.div
                className="absolute left-[40%] top-8"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="p-4 rounded-2xl bg-card shadow-medium">
                  <Mountain className="h-8 w-8 text-forest" />
                </div>
              </motion.div>
              <motion.div
                className="absolute right-[30%] top-0"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="p-4 rounded-2xl bg-card shadow-medium">
                  <Palmtree className="h-8 w-8 text-sunset" />
                </div>
              </motion.div>
              <motion.div
                className="absolute right-[10%] top-8"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="p-4 rounded-2xl bg-card shadow-medium">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold mb-4">Popular Destinations</h2>
            <p className="text-muted-foreground">Start planning your next adventure</p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {destinations.map((dest, i) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Link to={isAuthenticated ? '/itineraries/new' : '/register'}>
                  <Card className={`card-hover cursor-pointer ${dest.color} border-0`}>
                    <CardContent className="flex items-center gap-3 p-4">
                      <span className="text-2xl">{dest.icon}</span>
                      <span className="font-medium">{dest.name}</span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you plan, organize, and enjoy every trip
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Card className="h-full card-hover border-0 shadow-soft">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 overflow-hidden">
              <div 
                className="relative p-8 md:p-16"
                style={{ background: 'var(--gradient-ocean)' }}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLThoLTJ2LTRoMnY0em0tOCA4aC0ydi00aDJ2NHptMC04aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
                <div className="relative text-center text-primary-foreground">
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    Ready to Start Your Journey?
                  </h2>
                  <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
                    Join thousands of travelers who plan smarter with TravelWise
                  </p>
                  <Link to={isAuthenticated ? '/itineraries/new' : '/register'}>
                    <Button size="lg" variant="secondary" className="text-lg px-8 h-12 gap-2">
                      {isAuthenticated ? 'Create New Trip' : 'Get Started Free'}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
