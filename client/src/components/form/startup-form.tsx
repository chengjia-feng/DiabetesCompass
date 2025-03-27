import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  startupFormSchema,
  diabetesTypes, 
  selfManagementFeatures, 
  aiFeatures, 
  clinicalFeatures, 
  peerFeatures 
} from '@shared/schema';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ProgressIndicator from './progress-indicator';
import { Card, CardContent } from '@/components/ui/card';

type FormValues = z.infer<typeof startupFormSchema>;

const StartupForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(startupFormSchema),
    defaultValues: {
      startupName: '',
      firstName: '',
      lastName: '',
      targetAudience: '',
      diabetesTypes: [],
      problemStatement: '',
      solutionStatement: '',
      selfManagementFeatures: [],
      otherSelfManagement: '',
      aiFeatures: [],
      otherAiFeatures: '',
      clinicalFeatures: [],
      otherClinical: '',
      peerFeatures: [],
      otherPeer: ''
    }
  });

  const nextStep = async () => {
    // Validate the current step fields
    const fieldsToValidate = {
      1: ['startupName', 'firstName', 'lastName', 'targetAudience', 'diabetesTypes', 'problemStatement', 'solutionStatement'],
      2: ['selfManagementFeatures', 'aiFeatures'],
      3: ['clinicalFeatures', 'peerFeatures']
    }[currentStep];

    const result = await form.trigger(fieldsToValidate as any);
    if (result) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest('POST', '/api/submit-assessment', data);
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Assessment submitted successfully",
          description: "Your report is being generated.",
        });
        navigate(`/report/${result.reportId}`);
      } else {
        throw new Error(result.message || "Failed to submit assessment");
      }
    } catch (error) {
      console.error("Failed to submit assessment:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="startup-form" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-[#322459]">Start Your COMPASS Assessment</h2>
        <p className="mt-2 text-lg text-gray-600">
          Complete the form below to generate insights for your diabetes startup
        </p>
      </div>

      <ProgressIndicator 
        currentStep={currentStep} 
        totalSteps={3} 
        onBack={prevStep} 
      />

      <Card className="bg-white rounded-xl shadow-md overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#3D1667] mb-6 pb-2 border-b border-gray-200">
                    Startup Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="startupName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Startup Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your startup name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div></div>

                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your target audience..." 
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diabetesTypes"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>Which type(s) of diabetes is your innovation designed to support?</FormLabel>
                          <FormDescription>
                            Select all that apply
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                          {diabetesTypes.map((type) => (
                            <FormField
                              key={type}
                              control={form.control}
                              name="diabetesTypes"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={type}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(type)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, type])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== type
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {type}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="problemStatement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Problem Statement: What problem is being solved for the patient?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the problem you're trying to solve..." 
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="solutionStatement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Solution Statement: What is the approach for solving the problem for the patient?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your solution approach..." 
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 flex justify-end">
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      className="bg-[#322459] hover:bg-[#3D1667] text-white"
                    >
                      Next: Features
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 ml-2" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Product Features */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#3D1667] mb-6 pb-2 border-b border-gray-200">
                    Product Features
                  </h3>

                  <FormField
                    control={form.control}
                    name="selfManagementFeatures"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>Which core self-management features does your solution include or plan to include?</FormLabel>
                          <FormDescription>
                            Select all that apply
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                          {selfManagementFeatures.map((feature) => (
                            <FormField
                              key={feature}
                              control={form.control}
                              name="selfManagementFeatures"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={feature}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(feature)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value || [], feature])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== feature
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {feature}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="otherSelfManagement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other self-management features (please specify):</FormLabel>
                        <FormControl>
                          <Input placeholder="Other features..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aiFeatures"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>Which intelligent features or AI-enabled functions are built into your solution?</FormLabel>
                          <FormDescription>
                            Select all that apply
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                          {aiFeatures.map((feature) => (
                            <FormField
                              key={feature}
                              control={form.control}
                              name="aiFeatures"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={feature}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(feature)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value || [], feature])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== feature
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {feature}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="otherAiFeatures"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other AI features (please specify):</FormLabel>
                        <FormControl>
                          <Input placeholder="Other AI features..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={prevStep}
                      className="text-gray-700"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-2" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      className="bg-[#322459] hover:bg-[#3D1667] text-white"
                    >
                      Next: Integration
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 ml-2" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Integration & Connection */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#3D1667] mb-6 pb-2 border-b border-gray-200">
                    Integration & Connection
                  </h3>

                  <FormField
                    control={form.control}
                    name="clinicalFeatures"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>How does your solution integrate with clinical care or care teams?</FormLabel>
                          <FormDescription>
                            Select all that apply
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                          {clinicalFeatures.map((feature) => (
                            <FormField
                              key={feature}
                              control={form.control}
                              name="clinicalFeatures"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={feature}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(feature)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value || [], feature])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== feature
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {feature}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="otherClinical"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other clinical integration features (please specify):</FormLabel>
                        <FormControl>
                          <Input placeholder="Other clinical features..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="peerFeatures"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>What features support peer connection, motivation, or caregiver involvement?</FormLabel>
                          <FormDescription>
                            Select all that apply
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                          {peerFeatures.map((feature) => (
                            <FormField
                              key={feature}
                              control={form.control}
                              name="peerFeatures"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={feature}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(feature)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value || [], feature])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== feature
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {feature}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="otherPeer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other peer connection features (please specify):</FormLabel>
                        <FormControl>
                          <Input placeholder="Other peer features..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={prevStep}
                      className="text-gray-700"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-2" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#F28705] hover:bg-[#E74F0D] text-white"
                    >
                      {isSubmitting ? "Generating Report..." : "Generate Report"}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 ml-2" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupForm;
