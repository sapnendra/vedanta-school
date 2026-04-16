import mongoose, { Schema, Document } from "mongoose";

export interface ISiteConfig extends Document {
	heroTitle: string;
	heroHighlight: string;
	heroSubtext: string;
	heroDate: string;
	heroTime: string;
	heroPrice: number;
	heroOriginalPrice: number;
	heroSeminarId?: string;
	announcementText: string;
	showAnnouncement: boolean;
}

const SiteConfigSchema = new Schema<ISiteConfig>(
	{
		heroTitle: { type: String, default: "Feeling Lost in Life? Find Clarity Through" },
		heroHighlight: { type: String, default: "Bhagavad Gita Wisdom" },
		heroSubtext: {
			type: String,
			default: "Join India's most practical ancient wisdom seminar. Real answers. Real transformation.",
		},
		heroDate: { type: String, default: "April 27, 2026" },
		heroTime: { type: String, default: "7:00 PM - 9:00 PM IST" },
		heroPrice: { type: Number, default: 199 },
		heroOriginalPrice: { type: Number, default: 999 },
		heroSeminarId: { type: String },
		announcementText: { type: String, default: "Limited Seats Available" },
		showAnnouncement: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

export default mongoose.models.SiteConfig || mongoose.model<ISiteConfig>("SiteConfig", SiteConfigSchema);
