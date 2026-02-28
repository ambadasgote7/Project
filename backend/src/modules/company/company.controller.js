import { getCompanyListService } from "./company.service.js";

export const getCompanyList = async (req, res, next) => {
  try {

    const companies = await getCompanyListService();

    res.status(200).json({
      success: true,
      data: companies
    });

  } catch (err) {
    next(err);
  }
};