import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Welcome to AppName</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The most powerful platform for managing your business operations.
              Simple, efficient, and secure.
            </p>
            <div className="space-x-4">
              <Link to="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Us?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Easy to Use",
                  description:
                    "Intuitive interface designed for the best user experience",
                },
                {
                  title: "Secure",
                  description:
                    "Enterprise-grade security to protect your valuable data",
                },
                {
                  title: "Scalable",
                  description:
                    "Grows with your business, from startup to enterprise",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 bg-background rounded-lg shadow-sm"
                >
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;