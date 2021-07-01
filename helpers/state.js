import linkModel from "../models/linkSchema.js";
import mongoose from "mongoose";
import { config } from "dotenv";
config();

class state {
	constructor() {
		this.oldLinks = new Set();
		this.newLinks = new Set();
		this.isConnected = false;
	}

	// connect to db
	async connect() {
		try {
			await mongoose.connect(process.env.URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
			this.isConnected = true;
			return true;
		} catch (e) {
			console.log(e.message);
			return false;
		}
	}

	// disconnect from db
	async disconnect() {
		try {
			await mongoose.connection.close();
			this.isConnected = false;
			return true;
		} catch (e) {
			console.log(e.message);
			return false;
		}
	}

	// save to database
	save() {
		this.newLinks.forEach((link) => {
			if (this.oldLinks.has(link)) {
				//dump
			} else {
				this.oldLinks.add(link);
				linkModel.findOne({ link }).then((exists) => {
					if (exists === null) {
						linkModel.create({ link }).then(() => {
							console.log(link);
							this.newLinks.add(link);
							return true;
						});
					} else {
						console.log("was in db");
						return false;
					}
				});
			}
		});
		this.newLinks.clear();
	}
	// store a link
	store(link) {
		this.newLinks.add(link);
	}

	// check if a link is already stored
	isAlreadyStored(link) {
		linkModel.find({ link }).then((exists) => {
			// exists is null if not found
			if (exists.length) {
				return false;
			} else {
				return false;
			}
		});
	}

	remove(link) {
		linkModel.findOne({ link }).then((res) => {
			if (link) {
				linkModel.deleteOne({ link });
				return true;
			} else {
				return false;
			}
		});
	}

	size() {
		return this.oldLinks.size;
	}
}

export default state;
