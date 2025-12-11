import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

const VolunteerNeedsCard = ({ volunteer }) => {
  const { id, thumbnail, title, category, startTime, description } = volunteer;
  return (
    <div data-aos="fade-down"
      data-aos-anchor-placement="top-bottom"
      data-aos-easing="linear"
      data-aos-duration="1000" className="mx-auto">
      <Card className="max-w-[24rem] overflow-hidden">
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
              <span className="text-gray-500">No image</span>
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
            {description}
          </Typography>
        </CardBody>
        <CardFooter className="flex items-center gap-8 justify-between">
          <div className="flex items-center -space-x-3">
            <Link to={`/post-details/${id}`}>
              <Button color="green">View Details</Button>
            </Link>
          </div>
          <div>
            <h2 className="font-qs font-bold">Start : {startTime}</h2>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VolunteerNeedsCard;
