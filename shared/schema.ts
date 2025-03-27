import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Diabetes types enum
export const diabetesTypes = [
  "Type 1 Diabetes (T1D)",
  "Type 2 Diabetes (T2D)",
  "Gestational Diabetes",
  "Prediabetes",
  "Monogenic Diabetes",
  "Secondary Diabetes",
  "Other / Not Sure",
] as const;

// Self-management features enum
export const selfManagementFeatures = [
  "Blood glucose tracker",
  "Medication tracker/reminder",
  "Carb counting tool",
  "Insulin dosage calculator",
  "A1C trend monitoring",
  "Physical activity tracker",
  "Food diary / nutrition logging",
  "Sleep tracker",
  "Weight tracker",
  "Mood/emotion tracker",
] as const;

// AI features enum
export const aiFeatures = [
  "Personalized coaching",
  "Chatbot for patient Q&A",
  "Predictive alerts",
  "Automated insights",
  "Symptom checker",
  "Digital twin or simulation modeling",
  "Behavior nudges",
] as const;

// Clinical integration features enum
export const clinicalFeatures = [
  "Data sharing with provider",
  "Virtual visits / telehealth",
  "Remote patient monitoring",
  "Clinical decision support",
  "Smart insulin pen or CGM integration",
  "Care team messaging",
] as const;

// Peer connection features enum
export const peerFeatures = [
  "Community forum",
  "Peer support / mentorship",
  "Goal sharing",
  "Rewards or gamification",
  "Family/caregiver access",
] as const;

// Schema for the startup assessment form
export const startupFormSchema = z.object({
  startupName: z.string().min(1, { message: "Startup name is required" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  targetAudience: z.string().min(10, { message: "Please provide more details about your target audience" }),
  diabetesTypes: z.array(z.enum(diabetesTypes)).min(1, { message: "Select at least one diabetes type" }),
  problemStatement: z.string().min(10, { message: "Please provide a detailed problem statement" }),
  solutionStatement: z.string().min(10, { message: "Please provide a detailed solution statement" }),
  selfManagementFeatures: z.array(z.enum(selfManagementFeatures)).optional(),
  otherSelfManagement: z.string().optional(),
  aiFeatures: z.array(z.enum(aiFeatures)).optional(),
  otherAiFeatures: z.string().optional(),
  clinicalFeatures: z.array(z.enum(clinicalFeatures)).optional(),
  otherClinical: z.string().optional(),
  peerFeatures: z.array(z.enum(peerFeatures)).optional(),
  otherPeer: z.string().optional(),
});

// Startup table schema
export const startups = pgTable("startups", {
  id: serial("id").primaryKey(),
  startupName: text("startup_name").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  targetAudience: text("target_audience").notNull(),
  diabetesTypes: text("diabetes_types").array().notNull(),
  problemStatement: text("problem_statement").notNull(),
  solutionStatement: text("solution_statement").notNull(),
  selfManagementFeatures: text("self_management_features").array(),
  otherSelfManagement: text("other_self_management"),
  aiFeatures: text("ai_features").array(),
  otherAiFeatures: text("other_ai_features"),
  clinicalFeatures: text("clinical_features").array(),
  otherClinical: text("other_clinical"),
  peerFeatures: text("peer_features").array(),
  otherPeer: text("other_peer"),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertStartupSchema = createInsertSchema(startups);

export type InsertStartup = z.infer<typeof insertStartupSchema>;
export type Startup = typeof startups.$inferSelect;

// Report schema for the generated insights
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  startupId: integer("startup_id").notNull(),
  innovationObjective: text("innovation_objective").notNull(),
  patientInsightsSummary: text("patient_insights_summary").notNull(),
  patientThemes: jsonb("patient_themes").notNull(),
  failureInsightsSummary: text("failure_insights_summary").notNull(),
  failureData: jsonb("failure_data").notNull(),
  failureTakeaway: text("failure_takeaway").notNull(),
  sentimentSummary: text("sentiment_summary").notNull(),
  sentimentThemes: jsonb("sentiment_themes").notNull(),
  designRecommendations: text("design_recommendations").array().notNull(),
  feasibilityScore: integer("feasibility_score").notNull(),
  usefulnessScore: integer("usefulness_score").notNull(),
  assessmentSummary: text("assessment_summary").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertReportSchema = createInsertSchema(reports);

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

// Expanded report with all sections
export type ReportWithInsights = Report & {
  patientThemes: Array<{
    theme: string;
    quote: string;
    insight: string;
  }>;
  failureData: Array<{
    startup: string;
    year: number;
    sector: string;
    reason: string;
    theme: string;
  }>;
  sentimentThemes: Array<{
    theme: string;
    quote: string;
    implication: string;
  }>;
};
