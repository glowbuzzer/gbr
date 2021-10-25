

export const PlainImg=({src, alt, height}) => {
    console.log("IMG", src);
    return <img src={src} height={height} alt={alt}/>;
}