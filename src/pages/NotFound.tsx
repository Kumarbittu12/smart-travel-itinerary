import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="text-center max-w-md">
        <MapPin className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-6xl font-display font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Lost Your Way?</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button className="btn-gradient gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
