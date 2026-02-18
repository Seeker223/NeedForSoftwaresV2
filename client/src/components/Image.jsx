import { IKImage } from "imagekitio-react";

const Image = ({ src, className, w, h, alt }) => {
  const isExternalUrl = /^https?:\/\//i.test(src || "");

  if (isExternalUrl) {
    return (
      <img
        src={src}
        className={className}
        loading="lazy"
        alt={alt}
        width={w}
        height={h}
      />
    );
  }

  return (
    <IKImage
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      path={src}
      className={className}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      alt={alt}
      width={w}
      height={h}
      transformation={[
        {
          width: w,
          height: h,
        },
      ]}
    />
  );
};

export default Image;
