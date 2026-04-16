import mongoose, { Document, Schema } from "mongoose";

export interface IWebhookEvent extends Document {
	eventId: string;
	event: string;
	processedAt: Date;
}

const WebhookEventSchema = new Schema<IWebhookEvent>(
	{
		eventId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		event: {
			type: String,
			required: true,
		},
		processedAt: {
			type: Date,
			default: Date.now,
			expires: 60 * 60 * 24 * 30,
		},
	},
	{ timestamps: false }
);

export default mongoose.models.WebhookEvent ||
	mongoose.model<IWebhookEvent>("WebhookEvent", WebhookEventSchema);
