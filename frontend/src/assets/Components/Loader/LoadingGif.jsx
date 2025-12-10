import loader from "../../images/loading/Dual Ball@1x-1.0s-200px-200px.svg"

const LoadingGif = () => {
  return (
    <div>
      <div className=" h-[70vh] flex items-center justify-center">
        <div>
          <img src={loader} />
        </div>
      </div>
    </div>
  );
};

export default LoadingGif;
