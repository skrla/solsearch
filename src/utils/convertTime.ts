import moment from "moment";

export default function convertTime(date: number) {
  return moment(date).format("LL");
}
