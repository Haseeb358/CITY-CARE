import mongoose from "mongoose";

function DataBaseConnect() {
  mongoose
    .connect(process.env.DBURL)
    .then((res) => {
      console.log("Connection To DB is Successfull");
    })
    .catch((er) => {
      console.log(er);
    });
}
export default DataBaseConnect;