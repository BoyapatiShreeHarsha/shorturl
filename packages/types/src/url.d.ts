import { Document } from "mongoose";

type UrlType = Document & {
  url: string;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
  accessCount: number;
};

type UrlInfoType = {
  id: string;
  url: string;
  shortCode: string;
};
