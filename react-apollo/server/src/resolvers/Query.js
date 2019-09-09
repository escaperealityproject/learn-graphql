const Query = {
  async launches(parent, args, { axios }, info) {
    let res;
    res = await axios.get("https://api.spacexdata.com/v3/launches");
    const data = Object.values(res.data);
    return data;
  },
  async launch(parent, args, { axios }, info) {
    let res = await axios.get(
      `https://api.spacexdata.com/v3/launches/${args.flight_number}`
    );
    return res.data;
  },
  async rockets(parent, args, { axios }, info) {
    let res;
    res = await axios.get("https://api.spacexdata.com/v3/rockets");
    const data = Object.values(res.data);
    return data;
  },
  async rocket(parent, args, { axios }, info) {
    let res = await axios.get(
      `https://api.spacexdata.com/v3/rockets/${args.id}`
    );
    return res.data;
  }
};

export default Query;
