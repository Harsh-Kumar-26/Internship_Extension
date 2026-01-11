
import { Brain, Zap, BarChart3, ArrowRight } from "lucide-react";
import {RegisterModal, LoginModal } from "./Auth";
import { useState } from "react";


export default function HomePage() {

const [ logintab,setLogin] = useState(false);
const [signup,setSignup]=useState(false);



  const handleSignIn = () => {
    setLogin(true)
  }

  const handleGetStarted = () => {
     setSignup(true)
  }

  const handleLearnMore = () => {
    alert("Navigate to Learn More page")
  }


    return( <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-900/20 overflow-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">InternMatch</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSignIn}
            className="px-6 py-2 text-slate-900 hover:text-blue-500 transition-colors font-medium"
          >
            Sign In
          </button>
          <button
            onClick={handleGetStarted}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 font-medium transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Find Your Perfect{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Internship
              </span>
            </h1>
            <p className="text-xl text-slate-600">
              AI-powered recommendations tailored to your skills, interests, and career goals. Discover internships that
              match your unique profile.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGetStarted}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 py-6 text-lg font-medium transition-colors"
            >
              Start Exploring
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleLearnMore}
              className="flex items-center justify-center gap-2 border-2 border-slate-300 hover:border-blue-500 text-slate-900 hover:text-blue-500 rounded-full px-8 py-6 text-lg font-medium transition-colors bg-transparent"
            >
              Learn More
            </button>
          </div>

          {/* Social Proof */}
          <div className="pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-600 mb-3">Trusted by students from</p>
            <div className="flex items-center gap-6 flex-wrap opacity-70">
              <span className="font-semibold text-slate-900">Stanford</span>
              <span className="font-semibold text-slate-900">MIT</span>
              <span className="font-semibold text-slate-900">Berkeley</span>
              <span className="font-semibold text-slate-900">CMU</span>
            </div>
          </div>
        </div>

        {/* Visual Element */}
        <div className="relative h-96 lg:h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Your AI Profile Match</p>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full w-4/5" />
                </div>
                <p className="text-sm font-semibold text-slate-900">94% Match</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                    <Zap className="w-3 h-3 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Skills Aligned</p>
                    <p className="text-xs text-slate-600">5 of your top skills match</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center mt-0.5">
                    <BarChart3 className="w-3 h-3 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Growth Potential</p>
                    <p className="text-xs text-slate-600">High impact learning role</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-slate-900">How It Works</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
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
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white border border-slate-200 rounded-2xl p-8 space-y-4">
                <feature.icon className="w-12 h-12 text-blue-500" />
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-slate-900">Ready to Find Your Internship?</h2>
          <p className="text-lg text-slate-600">
            Join thousands of students using AI to discover their perfect internship match
          </p>
        </div>
        <button
          onClick={handleGetStarted}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-full px-10 py-7 text-lg font-medium transition-all"
        >
          Get Started For Free
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
 <LoginModal
        open={logintab}
        onClose={() => setLogin(false)}
      />
      <RegisterModal  open={signup} 
      onClose={()=>setSignup(false)}/>

    </div>)
 }
