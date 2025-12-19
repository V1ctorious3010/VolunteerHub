import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

const VolunteerNeedsCard = ({ volunteer }) => {
  const { id, thumbnail, title, category, startTime, description } = volunteer;
  const formatDateOnly = (v) => {
    if (!v) return "";
    const s = String(v).trim();
    const datePart = s.split(" ")[0];
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(datePart)) return datePart;
    const d = new Date(s);
    if (isNaN(d)) return datePart;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };
  const formattedStart = formatDateOnly(startTime);
  const truncateText = (text, max = 40) => {
    if (!text) return "";
    const s = String(text).trim();
    return s.length > max ? s.slice(0, max) + "..." : s;
  };
  return (
    <div className="mx-auto">
      <Link to={`/post-details/${id}`} state={{ event: volunteer }} className="block">
        <Card className="max-w-[24rem] overflow-hidden shadow-md hover:shadow-2xl hover:bg-gray-100 cursor-pointer transition-colors transition-shadow duration-200">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 rounded-none"
          >
            {thumbnail ? (
              <img className="w-full h-60" src={thumbnail} alt={title} />
            ) : (
              <div className="w-full h-60 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Chưa có ảnh</span>
              </div>
            )}
          </CardHeader>
          <CardBody>
            <Typography className="h-16" variant="h4" color="blue-gray">
              {title}
            </Typography>
            <Typography className="mt-2" variant="h5" color="blue-gray">
              <span className="text-green-500">{category}</span>
            </Typography>
            <Typography variant="h6" color="gray" className="mt-3 h-16 font-normal">
              {truncateText(description, 60)}
            </Typography>
            <Typography variant="h6" color="gray" className="mt-3 h-16 font-normal">
              <h2 className="font-qs font-bold">Bắt đầu vào : {formattedStart}</h2>
            </Typography>
          </CardBody>
        </Card>
      </Link>
    </div>
  );
};

export default VolunteerNeedsCard;
