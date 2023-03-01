const axios = require("axios");
const API_KEY = "API_KEY_TEST";

const brands = async (req, res) => {
  try {
    const response = await axios.post(
      "https://app.socialinsider.io/api",
      {
        jsonrpc: "2.0",
        id: 0,
        method: "socialinsider_api.get_brands",
        params: { projectname: "API_test" },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    return res.json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};

const info = async (req, res) => {
  try {
    const data = {
      id : 1,
      method : "socialinsider_api.get_profile_data",
      params: {
        id: req.body.id,
        profile_type: req.body.profile_type,
        date: {
          start: (new Date(req.body.date.start)).getTime(),
          end: Date.now(),
          timezone: req.body.date.timezone
        }
      }
    }
    const response = await axios.post(
      "https://app.socialinsider.io/api",
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    
    return res.json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};

exports.brands = brands;
exports.info = info;