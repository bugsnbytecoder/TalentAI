"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Upload,
  Link as LinkIcon,
  Save,
  User,
  MapPin,
  AtSign,
  Loader,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Developer {
  full_name: string;
  email: string;
  bio: string;
  location: string;
  experience_level: string;
  portfolio_links: string[];
  availability: string;
  resume?: File | null;
}

export default function ProfileForm({
  developer,
  onClose,
  onSave,
  isLoading,
}: {
  developer: Developer;
  onClose: () => void;
  onSave: (data: Developer) => void;
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState<Developer>({
    full_name: developer?.full_name || "",
    email: developer?.email || "",
    bio: developer?.bio || "",
    location: developer?.location || "",
    experience_level: developer?.experience_level || "junior",
    portfolio_links:
      developer?.portfolio_links?.length ? developer.portfolio_links : [""],
    availability: developer?.availability || "available",
    resume: developer?.resume || null,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const [resume, setResume] = useState<File | null>(developer?.resume || null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Include the resume file in the form data
    const updatedFormData = {
      ...formData,
      resume: resume
    };
    onSave(updatedFormData);
  };

  const addPortfolioLink = () => {
    setFormData((prev) => ({
      ...prev,
      portfolio_links: [...prev.portfolio_links, ""],
    }));
    requestAnimationFrame(() =>
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      })
    );
  };

  const updatePortfolioLink = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      portfolio_links: prev.portfolio_links.map((link, i) =>
        i === index ? value : link
      ),
    }));
  };

  const removePortfolioLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      portfolio_links: prev.portfolio_links.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (file: File | null) => {
    if (file && file.type === 'application/pdf') {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB.');
        return;
      }
      setResume(file);
    } else if (file) {
      alert('Please select a PDF file only.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-form-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header (sticky) */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                <User className="h-5 w-5" />
              </span>
              <h2
                id="profile-form-title"
                className="truncate text-lg font-semibold"
              >
                Edit Profile
              </h2>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="rounded-lg text-white hover:bg-white/20"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Body (scrollable) */}
        <div
          ref={scrollRef}
          className="max-h-[72vh] overflow-auto px-5 py-6 sm:px-6"
        >
          <form
            id="profile-form"
            onSubmit={handleSubmit}
            className="space-y-8"
            autoComplete="on"
          >
            {/* Section: Basic Info */}
            <section>
              <SectionTitle>Basic Information</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full Name"
                  htmlFor="full_name"
                  hint="Use your preferred professional name."
                >
                  <div className="relative">
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, full_name: e.target.value }))
                      }
                      className="bg-white pl-9 text-slate-900"
                      placeholder="Alex Chen"
                      autoFocus
                    />
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </Field>

                <Field
                  label="Email"
                  htmlFor="email"
                  hint="We’ll send challenge updates here."
                >
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, email: e.target.value }))
                      }
                      className="bg-white pl-9 text-slate-900"
                      placeholder="alex@example.com"
                      autoComplete="email"
                    />
                    <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </Field>

                <Field
                  className="sm:col-span-2"
                  label="Bio"
                  htmlFor="bio"
                  hint="A concise summary of your interests and impact."
                >
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, bio: e.target.value }))
                    }
                    className="h-28 resize-none bg-white text-slate-900"
                    placeholder="Full-stack engineer passionate about AI tooling and developer experience…"
                  />
                  <div className="mt-1 text-right text-xs text-slate-500">
                    {formData.bio.length}/300
                  </div>
                </Field>
              </div>
            </section>

            {/* Section: Role & Location */}
            <section>
              <SectionTitle>Role & Location</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Location" htmlFor="location" hint="City, Country">
                  <div className="relative">
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, location: e.target.value }))
                      }
                      className="bg-white pl-9 text-slate-900"
                      placeholder="San Francisco, USA"
                      autoComplete="address-level2"
                    />
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </Field>

                <Field label="Experience Level" htmlFor="experience">
                  <Select
                    value={formData.experience_level}
                    onValueChange={(value) =>
                      setFormData((p) => ({ ...p, experience_level: value }))
                    }
                  >
                    <SelectTrigger id="experience" className="bg-white text-slate-900">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="lead">Tech Lead</SelectItem>
                      <SelectItem value="principal">Principal</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </section>

            {/* Section: Portfolio */}
            <section>
              <div className="mb-1 flex items-center justify-between">
                <SectionTitle noRule>Portfolio Links</SectionTitle>
                <Button
                  type="button"
                  onClick={addPortfolioLink}
                  size="sm"
                  className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Add Link
                </Button>
              </div>
              <Separator className="mb-3" />

              <div className="space-y-3">
                {formData.portfolio_links.map((link, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={link}
                      onChange={(e) => updatePortfolioLink(idx, e.target.value)}
                      placeholder="https://github.com/username"
                      className="flex-1 bg-white text-slate-900"
                      autoComplete="url"
                    />
                    {formData.portfolio_links.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removePortfolioLink(idx)}
                        variant="outline"
                        size="icon"
                        className="rounded-lg border-red-200 hover:bg-red-50 text-slate-900"
                        aria-label={`Remove link ${idx + 1}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Availability */}
            <section>
              <SectionTitle>Availability</SectionTitle>
              <div className="grid sm:max-w-sm">
                <Select
                  value={formData.availability}
                  onValueChange={(value) =>
                    setFormData((p) => ({ ...p, availability: value }))
                  }
                >
                  <SelectTrigger className="bg-white text-slate-900">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Actively Looking</SelectItem>
                    <SelectItem value="open_to_offers">Open to Offers</SelectItem>
                    <SelectItem value="not_available">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>

            {/* Section: Resume */}
            <section>
              <SectionTitle>Resume</SectionTitle>
              <label
                className={cn(
                  "grid cursor-pointer place-items-center rounded-xl border-2 border-dashed p-8 text-center transition-colors",
                  dragActive 
                    ? "border-indigo-400 bg-indigo-50" 
                    : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)} 
                />
                <Upload className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                <p className="font-medium text-slate-700">
                  Drag & drop or click to upload
                </p>
                <p className="mt-1 text-xs text-slate-500">PDF files only • up to 5MB</p>
                <Button type="button" variant="outline" className="mt-3">
                  Choose File
                </Button>
              </label>
              
              {/* Display selected file */}
              {resume && (
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{resume.name}</p>
                    <p className="text-xs text-slate-500">
                      {(resume.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setResume(null)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </section>
          </form>
        </div>

        {/* Footer (sticky) */}
        <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="profile-form"
              className="rounded-lg bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ---------- small helpers ---------- */

function SectionTitle({
  children,
  noRule = false,
}: {
  children: React.ReactNode;
  noRule?: boolean;
}) {
  return (
    <div className="mb-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        {children}
      </h3>
      {!noRule && <Separator className="mt-3" />}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </Label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
