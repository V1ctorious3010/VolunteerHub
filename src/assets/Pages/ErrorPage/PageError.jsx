import { Link } from "react-router-dom";
const PageError = () => {
  return (
    <div>
      <section
 
      >
        <div className="container">
          <div className="row">
            <div className="col-sm-12 ">
              <div className="col-sm-10 col-sm-offset-1  text-center">
                <div className="four_zero_four_bg">
                  <h1 className="text-center ">404</h1>
                </div>

                <div className="contant_box_404 space-y-5">
                  <p className="text-5xl"> NO DATA FOUND ! ! ! </p>
                  <p className="text-3xl">
                    Please Add Some data to reveal this Page !
                  </p>

                  <Link
                    to={"/"}
                    href=""
                    className="btn bg-green-600 hover:bg-purple-500 text-lg text-white "
                  >
                    Go to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageError;
