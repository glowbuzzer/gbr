import CustImg from "./CustomImage";
import {Carousel} from "antd";


const ImgCarousel = ({ settings, images }) => (
    <Carousel {...settings}>
        {images.map((image, i) => (
            <div key={i}>
                <CustImg src={`${image.src}`} alt={`${image.alt}`} />
            </div>
        ))}
    </Carousel>
);

export default ImgCarousel;