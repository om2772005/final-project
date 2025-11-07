import mongoose from "mongoose";
const siteInfoSchema = new mongoose.Schema(
  {
    siteName: { type: String, required: true },
    categories: [{ type: String }],
    contactEmail: { type: String },
    contactPhone: { type: String },
    address: { type: String },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
    },
    about: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("SiteInfo", siteInfoSchema);
