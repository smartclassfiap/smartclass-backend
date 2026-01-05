import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ["subtitle", "contentSubtitle", "initialConcepts", "link"],
        },
        value: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        matter: { type: String, required: true },
        classNumber: { type: String, required: true },
        teacher: { type: String, required: true },
        image: { type: String, required: true },
        content: {
            type: [contentSchema],
            required: true,
        },
        userId: { type: String },
        posted: { type: Boolean, default: false },
        excluded: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
