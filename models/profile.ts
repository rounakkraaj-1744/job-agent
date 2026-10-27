import { model, models, Schema, type InferSchemaType } from "mongoose";

const profileSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    headline: { type: String, trim: true, maxlength: 160 },
    location: { type: String, trim: true, maxlength: 160 },
    targetRoles: { type: [String], default: [] },
    preferredWorkModes: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    preferredCompensation: { type: String, trim: true, maxlength: 120 },
    graduationYear: { type: Number, min: 1900, max: 2200 },
    links: { type: [String], default: [] },
  },
  { timestamps: true },
);
export type Profile = InferSchemaType<typeof profileSchema>;
export const ProfileModel = models.Profile ?? model("Profile", profileSchema);
