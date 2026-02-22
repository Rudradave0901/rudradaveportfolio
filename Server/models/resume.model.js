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
    compenyName: { type: String, required: true },
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

    description: {
      type: String,
      required: true,
    },

    liveUrl: {
      type: String,
      trim: true,
    },

    githubUrl: {
      type: String,
      trim: true,
    },

    imageUrl: {
      type: String,
    },

    techStack: {
      frontend: { type: [String], default: [] },
      backend: { type: [String], default: [] },
      tools: { type: [String], default: [] },
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
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
      type: String,
      required: true,
    },

    experience: {
      type: [ExperienceSchema],
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
