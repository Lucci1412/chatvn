import React,{useEffect} from "react";
import { Link } from "react-router-dom";
import "./style.css";
function NotFoundPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
}, []);
  return (
    <div className="page_404">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="col-sm-10 col-sm-offset-1">
              <div className="four_zero_four_bg">
                <h1 className="text-center page_404_h1">404</h1>
              </div>
              <div className="content_box_404">
                <h3 className="h2">Trang bạn đang tìm kiếm không có sẵn</h3>
                <Link className='submit_button page_404_link' to="/">Về trang chủ</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
