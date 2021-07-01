import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
	link: {
		type: String,
		required: true,
	},
	following: {
		type: Boolean,
		default:false
	},
	followingDate: {
		type: Number,
		default: Date.now,
	},
});

const linkModel = mongoose.model("linkModel", linkSchema);

export default linkModel;
