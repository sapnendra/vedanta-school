import mongoose, { Schema, Document } from "mongoose";

export interface ISeminar extends Document {
	title: string;
	description: string;
	badge: string;
	date: string;
	time: string;
	seatsTotal: number;
	seatsFilled: number;
	price: number;
	originalPrice: number;
	imageUrl: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const SeminarSchema = new Schema<ISeminar>(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		badge: { type: String, required: true },
		date: { type: String, required: true },
		time: { type: String, required: true },
		seatsTotal: { type: Number, default: 100 },
		seatsFilled: { type: Number, default: 0 },
		price: { type: Number, default: 199 },
		originalPrice: { type: Number, default: 999 },
		imageUrl: { type: String, required: true },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

export default mongoose.models.Seminar || mongoose.model<ISeminar>("Seminar", SeminarSchema);
