import Logger from "../models/logger.js";

const getLogs = async (req, res) => {
  const { dateRange, searchType, searchText, pagePerNumber, pageIndex } = req.body;
  try {
    //const datas = await Logger.find({}).sort({ time: -1 }).skip((pageIndex-1)*20).limit(pagePerNumber);
    console.log(dateRange, searchType, searchText, pagePerNumber, pageIndex);
    let datas;
    let query = {};
    switch (searchType) {
      case "name":
        query = {
          name: {
            $regex: searchText,
            $options: "i",
          }
        }; break;
      case "status":
        query = {
          status: {
            $regex: searchText,
            $options: "i",
          }
        }; break;
      case "user":
        query = {
          user: {
            $regex: searchText,
            $options: "i",
          }
        }; break;
      case "detail": {
        query = {
          detail: {
            $regex: searchText,
            $options: "i",
          }
        }; break;
      }
    }
    if (dateRange.startDate !== null && dateRange.endDate !== null) {
      query = {
        ...query, time: {
           $gte: new Date(`${dateRange.startDate}T00:00:00.000Z`),
           $lte: new Date(`${dateRange.endDate}T23:59:59.999Z`),
         }
      };
    }
    datas = await Logger.find(query).sort({ time: -1 }).skip((pageIndex - 1) * 20).limit(pagePerNumber);
    const totalCount = await Logger.find(query).count();
    console.log(datas)
    //Logger.find(searchText!==""?searchText:{})
    res.status(200).send({
      data: datas,
      totalCount: totalCount,
    });
  } catch (err) {
    res.status(500);
    throw new Error("Error while getting logs");
  }
};

const generateLog = async (req, res) => {
  const { type, user, title_id } = req.body;

  try {
    await Logger.create({
      name: type,
      status: "Success",
      user: user,
      time: new Date().toUTCString(),
      detail: `${type === "Consult" ? "Consult Description" : "Copy Description"} (${title_id})`
    });
    res.status(200).send("OK");
  } catch (err) {
    res.status(500);
    throw new Error("Error while creating log");
  }
};

export { getLogs, generateLog };