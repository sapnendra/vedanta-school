import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
	name: string;
	role: string;
	content: string;
	rating: number;
	imageUrl: string;
	isActive: boolean;
}

const TestimonialSchema = new Schema<ITestimonial>(
	{
		name: { type: String, required: true },
		role: { type: String, required: true },
		content: { type: String, required: true },
		rating: { type: Number, default: 5, min: 1, max: 5 },
		imageUrl: { type: String, required: true },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
