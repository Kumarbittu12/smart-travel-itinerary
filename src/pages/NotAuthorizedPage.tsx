import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotAuthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative mb-8">
          <Shield className="h-24 w-24 mx-auto text-muted-foreground" />
          <div className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full" />
        </div>
        
        <h1 className="text-3xl font-display font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-8">
          You don't have permission to access this page. 
          Please contact an administrator if you believe this is an error.
        </p>
        
        <Link to="/itineraries">
          <Button className="btn-gradient gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go to My Trips
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotAuthorizedPage;
