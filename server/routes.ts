import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  startupFormSchema, 
  diabetesTypes, 
  selfManagementFeatures, 
  aiFeatures,
  clinicalFeatures,
  peerFeatures,
  type ReportWithInsights
} from "@shared/schema";

// Sample data for reports (used for demonstration purposes)
const patientThemesData = [
  {
    theme: "Trust & Data Privacy",
    quote: "I don't like sharing my health data with apps.",
    insight: "Patients are concerned about how their data is used and need transparency."
  },
  {
    theme: "App Navigation",
    quote: "It took me too long to find what I needed.",
    insight: "Poor user interface can reduce engagement."
  },
  {
    theme: "Alert Fatigue",
    quote: "If it notifies me for everything, I'll just turn it off.",
    insight: "Selective, meaningful notifications increase long-term engagement."
  }
];

const failureData = [
  {
    startup: "HealthLoop",
    year: 2021,
    sector: "Patient Monitoring",
    reason: "Low user retention",
    theme: "Adoption"
  },
  {
    startup: "VidaWell",
    year: 2022,
    sector: "Chronic Care",
    reason: "Complex onboarding",
    theme: "UX"
  },
  {
    startup: "DiaBuddy",
    year: 2020,
    sector: "Diabetes Coaching",
    reason: "Poor provider integration",
    theme: "Clinical Workflow"
  }
];

const sentimentThemesData = [
  {
    theme: "App Fatigue",
    quote: "I already have 3 health apps—I'm not using another.",
    implication: "Consider integrating with existing systems to reduce app overload."
  },
  {
    theme: "Accessibility",
    quote: "It was hard to use on my phone.",
    implication: "Optimize UI for low-tech and mobile users."
  },
  {
    theme: "Data Interpretation",
    quote: "I have all this data but don't know what it means.",
    implication: "Provide actionable insights, not just data collection."
  }
];

const designRecommendationsData = [
  "Involve patients early in prototyping and usability testing",
  "Ensure onboarding is intuitive and designed for digital literacy gaps",
  "Address transparency and consent upfront in app flow",
  "Minimize cognitive load—start with core features and build iteratively",
  "Design for integration with existing health apps and devices",
  "Focus on actionable insights rather than just data collection",
  "Create clear pathways for sharing data with healthcare providers"
];

export async function registerRoutes(app: Express): Promise<Server> {
  // GET route to fetch form options
  app.get("/api/form-options", (_req, res) => {
    res.json({
      diabetesTypes,
      selfManagementFeatures,
      aiFeatures,
      clinicalFeatures,
      peerFeatures
    });
  });

  // POST route to submit form data
  app.post("/api/submit-assessment", async (req, res) => {
    try {
      // Validate the form data
      const validatedData = startupFormSchema.parse(req.body);
      
      // Store the startup data
      const startup = await storage.createStartup({
        ...validatedData,
        createdAt: new Date().toISOString()
      });
      
      // Generate the report
      const innovationObjective = `${startup.startupName} aims to address the needs of ${
        startup.diabetesTypes.join(", ")
      } patients by ${startup.solutionStatement.substring(0, 100)}...`;
      
      // Calculate scores based on form completeness and features
      const feasibilityScore = calculateFeasibilityScore(validatedData);
      const usefulnessScore = calculateUsefulnessScore(validatedData);
      
      // Create summary assessment
      const assessmentSummary = generateAssessmentSummary(
        validatedData,
        feasibilityScore,
        usefulnessScore
      );
      
      // Generate the report
      const report: ReportWithInsights = {
        id: 1, // Will be overwritten by storage
        startupId: startup.id,
        innovationObjective,
        patientInsightsSummary: generatePatientInsightsSummary(validatedData),
        patientThemes: patientThemesData,
        failureInsightsSummary: generateFailureInsightsSummary(validatedData),
        failureData,
        failureTakeaway: generateFailureTakeaway(validatedData),
        sentimentSummary: generateSentimentSummary(validatedData),
        sentimentThemes: sentimentThemesData,
        designRecommendations: designRecommendationsData,
        feasibilityScore,
        usefulnessScore,
        assessmentSummary,
        createdAt: new Date().toISOString()
      };
      
      // Store the report
      const savedReport = await storage.createReport(report);
      
      // Return the startup ID and report ID
      res.status(201).json({
        startupId: startup.id,
        reportId: savedReport.id,
        success: true
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.details
        });
      } else {
        console.error("Error submitting assessment:", error);
        res.status(500).json({
          success: false,
          message: "An unexpected error occurred"
        });
      }
    }
  });

  // GET route to fetch a report
  app.get("/api/report/:id", async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      if (isNaN(reportId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid report ID"
        });
      }
      
      const report = await storage.getReport(reportId);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found"
        });
      }
      
      const startup = await storage.getStartup(report.startupId);
      if (!startup) {
        return res.status(404).json({
          success: false,
          message: "Startup data not found"
        });
      }
      
      res.json({
        success: true,
        report,
        startup
      });
    } catch (error) {
      console.error("Error fetching report:", error);
      res.status(500).json({
        success: false,
        message: "An unexpected error occurred"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions to calculate scores and generate report content
function calculateFeasibilityScore(data: any): number {
  // Basic score calculation based on form completeness
  let score = 3; // Start with a neutral score
  
  // Add points for more complete features
  if (data.selfManagementFeatures && data.selfManagementFeatures.length > 3) score += 1;
  if (data.clinicalFeatures && data.clinicalFeatures.length > 2) score += 1;
  
  // Subtract points for potentially complex features
  if (data.aiFeatures && data.aiFeatures.includes("Digital twin or simulation modeling")) score -= 1;
  
  // Ensure score is within bounds
  return Math.max(1, Math.min(5, score));
}

function calculateUsefulnessScore(data: any): number {
  // Basic score calculation based on patient value
  let score = 3; // Start with a neutral score
  
  // Add points for patient-centric features
  if (data.selfManagementFeatures && data.selfManagementFeatures.length > 2) score += 1;
  if (data.peerFeatures && data.peerFeatures.length > 1) score += 1;
  
  // Add points for comprehensive approach
  if (
    (data.selfManagementFeatures && data.selfManagementFeatures.length > 0) &&
    (data.aiFeatures && data.aiFeatures.length > 0) &&
    (data.clinicalFeatures && data.clinicalFeatures.length > 0)
  ) {
    score += 1;
  }
  
  // Ensure score is within bounds
  return Math.max(1, Math.min(5, score));
}

function generatePatientInsightsSummary(data: any): string {
  return `Patient interviews reveal a strong desire for simplicity in diabetes management tools. Many express frustration with the cognitive burden of tracking multiple health metrics simultaneously. There's a clear preference for automation where possible, while still maintaining transparency about how recommendations are generated.`;
}

function generateFailureInsightsSummary(data: any): string {
  return `Analysis of diabetes management startups that failed in the past five years reveals common patterns. Many struggled with user retention after initial sign-up, suggesting difficulty in proving ongoing value. Healthcare provider integration was another common challenge, with many solutions failing to fit seamlessly into clinical workflows.`;
}

function generateFailureTakeaway(data: any): string {
  const focusAreas = [];
  
  if (data.selfManagementFeatures && data.selfManagementFeatures.length > 3) {
    focusAreas.push("feature overload");
  }
  
  if (data.clinicalFeatures && data.clinicalFeatures.length > 0) {
    focusAreas.push("clinical integration");
  }
  
  if (data.aiFeatures && data.aiFeatures.length > 0) {
    focusAreas.push("user adoption of AI features");
  }
  
  const focusText = focusAreas.length > 0 
    ? focusAreas.join(", ")
    : "user retention and workflow integration";
  
  return `Startups in this space have struggled with ${focusText}. Consider how your innovation can proactively address these challenges through design or implementation strategy that focuses on demonstrating ongoing value and fitting seamlessly into existing workflows.`;
}

function generateSentimentSummary(data: any): string {
  return `Analysis of diabetes app reviews and patient forum discussions reveals growing frustration with the proliferation of single-purpose health apps. Many patients express reluctance to add another app to their digital health toolkit unless it offers significant advantages over existing solutions. There's also strong interest in tools that help interpret data rather than just collecting it.`;
}

function generateAssessmentSummary(data: any, feasibilityScore: number, usefulnessScore: number): string {
  const strengths = [];
  
  if (data.selfManagementFeatures && data.selfManagementFeatures.length > 0) {
    strengths.push("self-management tools");
  }
  
  if (data.aiFeatures && data.aiFeatures.includes("Automated insights")) {
    strengths.push("data insights");
  }
  
  if (data.clinicalFeatures && data.clinicalFeatures.includes("Data sharing with provider")) {
    strengths.push("clinical data sharing");
  }
  
  const strengthsText = strengths.length > 0 
    ? strengths.join(" and ")
    : "innovative approach";
  
  const riskArea = feasibilityScore < 4 
    ? "achieving technical implementation within resource constraints" 
    : "clinical workflow integration";
  
  const opportunityText = usefulnessScore > 3 
    ? "reducing the cognitive burden for patients while providing actionable insights" 
    : "focusing on a core set of high-value features before expanding";
  
  return `Your innovation shows strong potential to address real patient needs, with particular strengths in ${strengthsText}. The main risk lies in ${riskArea}, while a key opportunity exists in ${opportunityText}. Your approach aligns well with COMPASS values, particularly in elevating patient voice through your feature selection.`;
}
