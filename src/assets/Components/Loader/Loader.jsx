
import { BounceLoader } from 'react-spinners';
const Loader = () => {
  return (
    <div className="max-h-screen flex items-center justify-center">
      <BounceLoader size={50} color="#BE042F" />
    </div>
  );
};

export default Loader;
