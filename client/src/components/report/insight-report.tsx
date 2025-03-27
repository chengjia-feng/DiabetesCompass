import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { type ReportWithInsights } from '@shared/schema';

interface ReportResponse {
  success: boolean;
  report: ReportWithInsights;
  startup: any;
}

const InsightReport: React.FC<{ reportId: string }> = ({ reportId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data, error, isError } = useQuery<ReportResponse>({ 
    queryKey: [`/api/report/${reportId}`],
  });

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
    
    if (isError) {
      toast({
        variant: "destructive",
        title: "Error Loading Report",
        description: error instanceof Error ? error.message : "Failed to load report data",
      });
      setIsLoading(false);
    }
  }, [data, isError, error, toast]);

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#322459]"></div>
        <p className="mt-4 text-lg text-gray-700">Generating your insight report...</p>
      </div>
    );
  }

  if (isError || !data || !data.success) {
    return (
      <Card className="bg-white p-6 my-8 rounded-xl shadow-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-red-600 mb-4">Error Loading Report</h3>
            <p className="mb-4 text-gray-700">
              We encountered an issue loading your report. Please try again or start a new assessment.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-[#322459] hover:bg-[#3D1667] text-white"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { report, startup } = data;

  return (
    <div className="space-y-10">
      {/* Innovation Objective */}
      <Card className="bg-white rounded-xl shadow-md">
        <CardContent className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-[#3D1667] mb-4">Innovation Objective</h3>
          <p className="text-gray-700">{report.innovationObjective}</p>
        </CardContent>
      </Card>

      {/* Section 1: Insights from Patients */}
      <Card className="bg-white rounded-xl shadow-md">
        <CardContent className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-[#3D1667] mb-4">Section 1: Insights from Patients</h3>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-[#322459]">Narrative Summary</h4>
            <p className="mt-2 text-gray-700">{report.patientInsightsSummary}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-[#322459]">Theme Table</h4>
            <div className="mt-2 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theme</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supporting Quote</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary Insight</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.patientThemes.map((theme, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{theme.theme}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">"{theme.quote}"</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{theme.insight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Startup Failure Insights */}
      <Card className="bg-white rounded-xl shadow-md">
        <CardContent className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-[#3D1667] mb-4">Section 2: Startup Failure Insights</h3>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-[#322459]">Narrative Summary</h4>
            <p className="mt-2 text-gray-700">{report.failureInsightsSummary}</p>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-[#322459]">Failure Table</h4>
            <div className="mt-2 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Failed Startup</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sector</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason for Failure</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theme</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.failureData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.startup}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{item.year}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{item.sector}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{item.reason}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{item.theme}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-[#322459]">Takeaway</h4>
            <p className="mt-2 text-gray-700">{report.failureTakeaway}</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Patient Sentiment Patterns */}
      <Card className="bg-white rounded-xl shadow-md">
        <CardContent className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-[#3D1667] mb-4">Section 3: Patient Sentiment Patterns</h3>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-[#322459]">Narrative Summary</h4>
            <p className="mt-2 text-gray-700">{report.sentimentSummary}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-[#322459]">Sentiment Table</h4>
            <div className="mt-2 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theme</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Example Quote</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Design Implication</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.sentimentThemes.map((theme, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{theme.theme}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">"{theme.quote}"</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{theme.implication}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Human-Centered Design Recommendations */}
      <Card className="bg-white rounded-xl shadow-md">
        <CardContent className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-[#3D1667] mb-4">Section 4: Human-Centered Design Recommendations</h3>
          
          <ul className="space-y-3 mt-2 text-gray-700 list-disc pl-5">
            {report.designRecommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Section 5: Feasibility & Usefulness Assessment */}
      <Card className="bg-white rounded-xl shadow-md">
        <CardContent className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-[#3D1667] mb-4">Section 5: Feasibility & Usefulness Assessment</h3>
          
          <div className="flex flex-col md:flex-row md:space-x-8 mb-6">
            <div className="mb-4 md:mb-0 flex-1">
              <h4 className="text-lg font-semibold text-[#322459]">Feasibility Score</h4>
              <div className="mt-2 flex items-center">
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div 
                      key={index}
                      className={`h-4 w-4 rounded-full ${
                        index < report.feasibilityScore 
                          ? 'bg-[#322459]' 
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">{report.feasibilityScore} out of 5</span>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-[#322459]">Usefulness / Impact Score</h4>
              <div className="mt-2 flex items-center">
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div 
                      key={index}
                      className={`h-4 w-4 rounded-full ${
                        index < report.usefulnessScore 
                          ? 'bg-[#F28705]' 
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">{report.usefulnessScore} out of 5</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-700">{report.assessmentSummary}</p>
        </CardContent>
      </Card>

      {/* Section 6: Resources and Next Steps */}
      <Card className="bg-white rounded-xl shadow-md">
        <CardContent className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-[#3D1667] mb-4">Section 6: Resources and Next Steps</h3>
          
          <ul className="space-y-3 mt-2 text-gray-700">
            <li>
              <a href="#" className="text-[#322459] hover:text-[#3D1667] underline">HCD Guide: Diabetes Management Applications</a>
            </li>
            <li>
              <a href="#" className="text-[#322459] hover:text-[#3D1667] underline">COMPASS Personas (in development)</a>
            </li>
            <li>
              <a href="#" className="text-[#322459] hover:text-[#3D1667] underline">Interview Protocol (available on request)</a>
            </li>
            <li>
              <a href="#" className="text-[#322459] hover:text-[#3D1667] underline">Diabetes App UX Best Practices</a>
            </li>
          </ul>
          
          <div className="mt-8 text-center">
            <Button className="bg-[#322459] hover:bg-[#3D1667] text-white">
              Schedule Consultation
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center py-4">
        <Link href="/#startup-form">
          <Button 
            variant="outline"
            className="text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Start a New Assessment
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InsightReport;
