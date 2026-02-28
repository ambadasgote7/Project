import Company from "../../models/Company.js";

export const getCompanyListService = async () => {

  const companies = await Company.find(
    { status: "active" },
    "_id name"
  ).sort({ name: 1 });

  return companies;
};