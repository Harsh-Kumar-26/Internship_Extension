import { Brain, Zap, BarChart3, ArrowRight, Moon, Sun } from "lucide-react"; // Added Sun icon
import { RegisterModal, LoginModal } from "./Auth";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [logintab, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);
  
  // Theme Toggle State
  const [isDark, setIsDark] = useState(false);

  // Toggle Theme Logic
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Apply 'dark' class to html element when state changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');// important hai hai 
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleSignIn = () => {
    setLogin(true);
  };

  const handleGetStarted = () => {
    setSignup(true);
  };

  return (
    // Added dark background colors
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-900/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden transition-colors duration-300">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          {/* Dark mode text color */}
          <span className="text-xl font-bold text-slate-900 dark:text-white">InternMatch</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
          
          <button
            onClick={handleSignIn}
            className="px-6 py-2 text-slate-900 hover:text-blue-500 dark:text-slate-200 dark:hover:text-blue-400 transition-colors font-medium"
          >
            Sign In
          </button>
          <button
            onClick={handleGetStarted}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 font-medium transition-colors shadow-lg shadow-blue-500/20"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              Find Your Perfect{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Internship or Intern
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              One stop solution for job seekers and job creators
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGetStarted}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-5 text-lg font-medium transition-colors shadow-lg shadow-blue-500/25"
            >
              Start Exploring
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visual Element (The Profile Match Card) */}
        <div className="relative h-96 lg:h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-3xl blur-3xl" />
          
          {/* Main Card Dark Mode: bg-slate-800 border-slate-700 */}
          <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-xl transition-colors duration-300">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">Your AI Profile Match</p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full w-4/5" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">94% Match</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                    <Zap className="w-3 h-3 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">Skills Aligned</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">5 of your top skills match</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center mt-0.5">
                    <BarChart3 className="w-3 h-3 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">Growth Potential</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">High impact learning role</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-4 mb-16 ">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">How It Works</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Our AI analyzes your profile and recommends internships with the highest match potential
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: "AI Profile Analysis",
              description: "Our ML model analyzes your skills, interests, academic background, and career goals",
            },
            {
              icon: Zap,
              title: "Smart Matching",
              description: "Get personalized recommendations based on real-time job market data and trends",
            },
            {
              icon: BarChart3,
              title: "Success Metrics",
              description: "Track your application progress and see detailed insights about each opportunity",
            },
          ].map((feature, idx) => (
            <div key={idx} className="group relative">
              {/* Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500 shadow-lg shadow-black/50" />
              
              {/* Feature Card Dark Mode: bg-slate-800 border-slate-700 */}
              <div className="relative h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 space-y-4 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:border-blue-200 dark:group-hover:border-blue-500/50">
                
                <feature.icon className="w-12 h-12 text-blue-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:text-cyan-500" />
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Ready to Find Your Internship?</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Join thousands of students using AI to discover their perfect internship match
          </p>
        </div>
        <button
          onClick={handleGetStarted}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-full px-10 py-7 text-lg font-medium transition-all shadow-lg shadow-blue-500/25"
        >
          Get Started For Free
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <LoginModal open={logintab} onClose={() => setLogin(false)} />
      <RegisterModal open={signup} onClose={() => setSignup(false)} />

      {/* Footer Strip */}
      <div className="bg-blue-400 dark:bg-slate-800 w-full min-h-20 transition-colors"></div>
    </div>
  );
}