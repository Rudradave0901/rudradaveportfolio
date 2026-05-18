import mongoose from "mongoose";

/* =====================
   Sub Schemas
===================== */

// Profile
const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const SocialLinkSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

// Contact
const ContactSchema = new mongoose.Schema(
  {
    email: String,
    phone: String,
    linkedin: {
      type: [SocialLinkSchema],
      default: [],
    },
    github: {
      type: [SocialLinkSchema],
      default: [],
    },
    portfolio: String,
    location: String,
  },
  { _id: false }
);

// Skills Group
const SkillGroupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Skills, Frameworks, Tools
    items: { type: [String], default: [] },
  },
  { _id: false }
);

// Experience
const ExperienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Frontend Developer @ Company
    startDate: { type: String, required: true },
    endDate: { type: String, default: "Present" },
    companyName: { type: String, required: true },
    location: { type: String, required: true },
    points: { type: [String], required: true },
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    points: {
      type: [String],
      required: true,
      default: [],
    },
    inProgress: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);


const EducationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    school: { type: String, required: true },
    year: { type: String, required: true },
  },
  { _id: false }
);

/* =====================
   Main Resume Schema
===================== */

const ResumeSchema = new mongoose.Schema(
  {
    profile: {
      type: ProfileSchema,
      required: true,
    },

    contact: {
      type: ContactSchema,
      required: true,
    },

    skills: {
      type: [SkillGroupSchema],
      default: [],
    },

    softSkills: {
      type: [String],
      default: [],
    },

    languages: {
      type: [String],
      default: [],
    },

    about: {
      type: [String],
      required: true,
      default: [""],
    },

    experience: {
      type: [ExperienceSchema],
      default: [],
    },

    education: {
      type: [EducationSchema],
      default: [],
    },

    projects: {
      type: [ProjectSchema],
      default: [],
    },

    achievements: {
      type: [String],
      default: [],
    },

    // Which page each section belongs to (1 or 2)
    pageLayout: {
      type: Map,
      of: Number,
      default: {
        summary: 1,
        education: 1,
        experience: 1,
        skills: 2,
        projects: 2,
        achievements: 2,
      },
    },

    // Section render order per page – array of section keys
    sectionOrder: {
      type: [String],
      default: [
        'summary', 'education', 'experience',
        'skills', 'projects', 'achievements',
      ],
    },

    title: {
      type: String,
      default: "Main Resume",
    },

    templateId: {
      type: String,
      default: "Resume1",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const ResumeModel = mongoose.model("Resume", ResumeSchema);
