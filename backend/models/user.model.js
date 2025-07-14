import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters long"],
		},
		// Yeni profil bilgileri
		phone: {
			type: String,
			trim: true,
		},
		address: {
			street: {
				type: String,
				trim: true,
			},
			city: {
				type: String,
				trim: true,
			},
			state: {
				type: String,
				trim: true,
			},
			country: {
				type: String,
				trim: true,
				default: "Türkiye",
			},
			postalCode: {
				type: String,
				trim: true,
			},
		},
		birthDate: {
			type: Date,
		},
		gender: {
			type: String,
			enum: ["male", "female", "other"],
		},
		profileImage: {
			type: String,
		},
		cartItems: [
			{
				quantity: {
					type: Number,
					default: 1,
				},
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
				},
			},
		],
		favorites: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
		],
		role: {
			type: String,
			enum: ["customer", "admin"],
			default: "customer",
		},
	},
	{
		timestamps: true,
	}
);

// Pre-save hook to hash password before saving to database
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
