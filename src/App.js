import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [brand, setBrand] = useState([]);
  const [info, setInfo] = useState({});
  const [unfilteredData, setUnfilteredData] = useState({});

  const [brands, setBrands] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [fans, setFans] = useState({});
  const [engagement, setEngagement] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.post("http://localhost:3001/brands");
      const finalData = data.data.result;
      setBrand(finalData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const newInfo = {};
    const obj = [];

    if (brand.length > 0) {
      brand.forEach(async (brnd) => {
        if (!newInfo[brnd.brandname]) newInfo[brnd.brandname] = [];

        for (let i = 0; i < brnd.profiles.length; i++) {
          const profile = brnd.profiles[i];
          const data = {
            id: profile.id,
            profile_type: profile.profile_type,
            start_date: profile.profile_added,
            name: profile.name,
            followers: 0,
            engagement: 0,
          };

          const newData = await axios.post("http://localhost:3001/info", {
            id: data.id,
            profile_type: data.profile_type,
            date: {
              start: data.start_date,
              timezone: "Europe/London",
            },
          });

          for (const [key, value] of Object.entries(newData.data.resp)) {
            if (key === data.id) {
              if (typeof value.engagement === "number")
                data.engagement += value.engagement;

              if (typeof value.followers === "number")
                data.followers += value.followers;
            }
          }

          if (!obj[brnd.brandname]) obj[brnd.brandname] = [];
          obj[brnd.brandname].push(await newData.data.resp[profile.id]);
          newInfo[brnd.brandname].push(data);
        }
      });

      setInfo(newInfo);
      setUnfilteredData(obj);
    }
  }, [brand]);

  function setTableData() {
    const finalBrands = [];
    let totalProfiles = [];
    const totalFans = {};
    const totalEngagement = {};

    //GET ALL BRANDS
    Object.keys(unfilteredData).forEach((brand) => {
      if (!finalBrands.includes(`${brand}`)) {
        finalBrands.push(`${brand}`);
      }
      //GET ALL PROFILES FOR EACH BRAND
      totalProfiles.push(unfilteredData[brand].length);
      totalProfiles = totalProfiles.slice(-4);

      //GET ALL FANS/FOLLOWERS FOR EACH BRAND
      let brandTotalFollowers = 0;
      unfilteredData[brand].forEach((obj) => {
        Object.keys(obj).forEach((date) => {
          if (obj[date].followers && obj[date].followers !== undefined) {
            brandTotalFollowers += obj[date].followers;
          }
        });
      });
      totalFans[brand] = brandTotalFollowers;

      //GET TOTAL ENGAGEMENT FOR EACH BRAND
      let brandTotalEngagement = 0;
      unfilteredData[brand].forEach((obj) => {
        Object.keys(obj).forEach((date) => {
          if (obj[date].engagement && obj[date].engagement !== undefined) {
            brandTotalEngagement += obj[date].engagement;
          }
        });
      });
      if (!isNaN(brandTotalEngagement)) {
        totalEngagement[brand] = brandTotalEngagement;
      }
    });
    setEngagement(totalEngagement);
    setFans(totalFans);
    setProfiles(totalProfiles);
    setBrands(finalBrands);
  }

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>Brand Name</th>
            <th>Total Profiles</th>
            <th>Total Fans</th>
            <th>Total Engagement</th>
          </tr>
        </thead>
        <tbody>
          {brands &&
            brands.map((brand, index) => (
              <tr key={brand}>
                <td>{brand}</td>
                <td>{profiles[index]}</td>
                <td>{fans[brand]}</td>
                <td>{engagement[brand]}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <button onClick={() => setTableData()}>CLICK ME</button>
    </div>
  );
}

export default App;
