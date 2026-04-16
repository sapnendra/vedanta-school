import mongoose, { Schema, Document } from "mongoose";

export interface IExpert extends Document {
	name: string;
	title: string;
	bio: string;
	imageUrl: string;
	credentials: string[];
	yearsMonk: number;
	livesHelped: number;
	seminars: number;
	isActive: boolean;
}

const ExpertSchema = new Schema<IExpert>(
	{
		name: { type: String, required: true },
		title: { type: String, required: true },
		bio: { type: String, required: true },
		imageUrl: { type: String, required: true },
		credentials: [{ type: String }],
		yearsMonk: { type: Number, default: 0 },
		livesHelped: { type: Number, default: 0 },
		seminars: { type: Number, default: 0 },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

export default mongoose.models.Expert || mongoose.model<IExpert>("Expert", ExpertSchema);
