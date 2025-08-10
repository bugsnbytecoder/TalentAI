import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Star, Trophy, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TopRecruiters() {
  // Mock top recruiters data
  const topRecruiters = [
    {
      id: "1",
      full_name: "Sarah Mitchell",
      company: "TechCorp Inc",
      recruiter_score: 892,
      developer_rating: 4.8,
      active_jobs: 5,
      badges: ["Top Hirer", "Fast Response"],
      verified: true
    },
    {
      id: "2", 
      full_name: "Michael Rodriguez",
      company: "StartupHub",
      recruiter_score: 867,
      developer_rating: 4.7,
      active_jobs: 3,
      badges: ["Quality First"],
      verified: true
    },
    {
      id: "3",
      full_name: "Emily Chen",
      company: "Global Solutions Ltd",
      recruiter_score: 834,
      developer_rating: 4.6,
      active_jobs: 4,
      badges: ["Diversity Champion"],
      verified: true
    }
  ];

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Top Recruiters
          </CardTitle>
          <Link href="/devranking">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 rounded-lg">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {topRecruiters.map((recruiter, index) => (
            <div key={recruiter.id} className="flex flex-col md:flex-row justify-between md:items-center gap-4 p-4 border border-slate-200 rounded-xl hover:shadow-lg transition-shadow duration-300">
              
              {/* Left side: Info */}
              <div className="flex items-center gap-4 flex-grow">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                    index === 1 ? 'bg-slate-300 text-slate-700' :
                    index === 2 ? 'bg-orange-400 text-orange-900' : 'bg-slate-100 text-slate-600'
                  }`}>
                    #{index + 1}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900">{recruiter.full_name}</h3>
                    {recruiter.verified && <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Verified</Badge>}
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-2">{recruiter.company}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium text-slate-700">{recruiter.developer_rating}</span>
                    </div>
                    <span className="text-slate-500 hidden sm:inline">•</span>
                    <span className="font-medium text-emerald-600">{recruiter.active_jobs} active jobs</span>
                  </div>
                </div>
              </div>

              {/* Right side: Score and Action */}
              <div className="flex flex-row md:flex-col items-center justify-between md:justify-center md:items-end gap-2 w-full md:w-auto flex-shrink-0 pt-4 md:pt-0 border-t md:border-none border-slate-100">
                <div className="bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-200 rounded-lg px-3 py-1">
                  <span className="font-bold text-emerald-800 text-sm">{recruiter.recruiter_score}</span>
                </div>
                <Link href={`/recruiterprofile`}>
                  <Button size="sm" variant="outline" className="rounded-lg border-slate-300 hover:bg-slate-50">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
