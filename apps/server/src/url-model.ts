import mongoose, { Schema } from "mongoose";
import { UrlType } from "@shorturl/types";

const urlSchema: Schema<UrlType> = new Schema<UrlType>(
  {
    url: {
      type: String,
      required: true,
      unique: true
    },
    shortCode: {
      type: String,
      required: true,
      unique: true
    },
    accessCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toObject: {
      transform: function (_doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

const Url = mongoose.model<UrlType>("Url", urlSchema);

export default Url;
