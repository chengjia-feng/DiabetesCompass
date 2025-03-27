import { 
  users, type User, type InsertUser, 
  startups, type Startup, type InsertStartup,
  reports, type Report, type InsertReport, type ReportWithInsights
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Startup methods
  createStartup(startup: InsertStartup): Promise<Startup>;
  getStartup(id: number): Promise<Startup | undefined>;
  getAllStartups(): Promise<Startup[]>;
  
  // Report methods
  createReport(report: InsertReport): Promise<Report>;
  getReport(id: number): Promise<Report | undefined>;
  getReportByStartupId(startupId: number): Promise<Report | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private startupData: Map<number, Startup>;
  private reportData: Map<number, Report>;
  private currentUserId: number;
  private currentStartupId: number;
  private currentReportId: number;

  constructor() {
    this.users = new Map();
    this.startupData = new Map();
    this.reportData = new Map();
    this.currentUserId = 1;
    this.currentStartupId = 1;
    this.currentReportId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Startup methods
  async createStartup(insertStartup: InsertStartup): Promise<Startup> {
    const id = this.currentStartupId++;
    const startup: Startup = { ...insertStartup, id };
    this.startupData.set(id, startup);
    return startup;
  }
  
  async getStartup(id: number): Promise<Startup | undefined> {
    return this.startupData.get(id);
  }
  
  async getAllStartups(): Promise<Startup[]> {
    return Array.from(this.startupData.values());
  }
  
  // Report methods
  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.currentReportId++;
    const report: Report = { ...insertReport, id };
    this.reportData.set(id, report);
    return report;
  }
  
  async getReport(id: number): Promise<Report | undefined> {
    return this.reportData.get(id);
  }
  
  async getReportByStartupId(startupId: number): Promise<Report | undefined> {
    return Array.from(this.reportData.values()).find(
      (report) => report.startupId === startupId,
    );
  }
}

export const storage = new MemStorage();
