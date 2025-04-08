import React from "react";
import { makeStyles } from "@mui/styles";
import { useQuery } from "@tanstack/react-query";
import UseProduct from "../Hooks/UseProduct";

const useStyles = makeStyles({
  photo: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
});

const loadImage = async (key, path) => {
  try {
    const image = await import(/* @vite-ignore */ path);
    return { key, src: image.default };
  } catch {
    console.warn(`⚠️ Missing image for ${key}`);
    return { key, src: null };
  }
};

const fetchImages = async (item) => {
  const imagePaths = [
    { key: "insideUp", path: `../assets/ragach/insideUp/${item.insideColor}.png` },
    { key: "button", path: `../assets/ragach/button/${item.kind}/${item.color}.png` },
    { key: "lapelCollar", path: `../assets/ragach/${item.lapelKind}/${item.lapelType}/${item.kind}/${item.color}.png` },
    { key: "colar", path: `../assets/ragach/colar/${item.color}.png` },
    { key: "sleeves", path: `../assets/ragach/sleeves/${item.color}.png` },
    { key: "insideBottom", path: `../assets/ragach/insideBottom/${item.color}.png` },
    { key: "packetBottom", path: `../assets/ragach/packetBottom/${item.packetType}/${item.color}.png` },
    { key: "packetUp", path: `../assets/ragach/packetUp/${item.color}.png` },
  ];

  if (item.parts.bottom) {
    imagePaths.push({ key: "bottom", path: `../assets/ragach/bottom/${item.color}.png` });
  }
  if (item.parts.bottomKind3) {
    imagePaths.push({ key: "bottomKind3", path: `../assets/ragach/bottomKind3/${item.color}.png` });
  }
  if (item.parts.holeButtonColor) {
    imagePaths.push({ key: "holeButton", path: `../assets/adds/holesButton/${item.kind}/${item.holeButtonColor}.png` });
  }
  if (item.parts.holeButtonUpColor) {
    imagePaths.push({ key: "holeButtonUp", path: `../assets/adds/holesButtonUp/${item.holeButtonUpColor}.png` });
  }
  if (item.poshetColor) {
    imagePaths.push({ key: "poshetColor", path: `../assets/adds/poshet/${item.poshetColor}.png` });
  }

  const images = await Promise.all(imagePaths.map(({ key, path }) => loadImage(key, path)));
  
  return images.reduce((acc, { key, src }) => {
    if (src) acc[key] = src;
    return acc;
  }, {});
};

const DynamicImage = () => {
  const classes = useStyles();
  const { data, isLoading } = UseProduct();
  
  const allSuite = data?.allSuitPart || [];

  const { data: imagesData, isFetching } = useQuery({
    queryKey: ["images", allSuite?.map(item => item.id).join("-")],
    queryFn: () => Promise.all(allSuite.map(item => fetchImages(item))), // שולחים כל פריט בנפרד
    enabled: !!allSuite && !isLoading, // לוודא ש- allSuite נטען לפני הקריאה
  });

  return (
    <div>
      {isFetching || isLoading ? (
        <p>Loading...</p>
      ) : (
        allSuite.map((item, index) => (
          <div key={index} style={{ position: "relative", width: "400px", height: "400px", marginBottom: "20px" }}>
            {imagesData[index] && Object.entries(imagesData[index]).map(([key, src]) => (
              <img 
                key={key} 
                src={src} 
                alt={key} 
                className={classes.photo} 
                style={key === 'packetBottom' ? { zIndex: 10 } : { zIndex: 1 }} 
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default DynamicImage;
