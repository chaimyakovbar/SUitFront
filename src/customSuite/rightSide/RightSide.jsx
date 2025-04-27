// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Drawer,
//   Typography,
//   useMediaQuery,
//   IconButton,
//   Divider,
//   Grid
// } from "@mui/material";
// import { motion } from "framer-motion";
// import { makeStyles } from "@mui/styles";
// import { useAtom } from "jotai";
// import { currentIndexAtom } from "../../Utils";
// import CloseIcon from '@mui/icons-material/Close';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// import inside from "/assets/kinds/insid.svg";
// import poshet from "/assets/kinds/poshet.svg";
// import button from "/assets/kinds/button.svg";
// import holes from "/assets/kinds/AllSuit2.png";

// import ButtonInside from "./ButtonInside";
// import ButtonHoles from "./ButtonHoles";
// import ButtonPoshet from "./ButtonPoshet";
// import ButtonButton from "./ButtonButton";

// const useStyles = makeStyles({
//   root: {
//     position: "absolute",
//     zIndex: 1000,
//     right: 0,
//     width: props => props.isMobile ? "190px" : "30%",
//     height: props => props.isMobile ? "42vh" : "80vh",
//     overflowY: "auto",
//     padding: props => props.isMobile ? "10px" : "20px",
//     boxSizing: "border-box",
//     backgroundColor: "rgba(20, 20, 20, 0.8)",
//     borderRadius: "4px",
//     border: "1px solid rgba(192, 211, 202, 0.2)",
//     boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
//     "&::-webkit-scrollbar": {
//       width: "6px",
//     },
//     "&::-webkit-scrollbar-track": {
//       backgroundColor: "rgba(255, 255, 255, 0.05)",
//       borderRadius: "3px",
//     },
//     "&::-webkit-scrollbar-thumb": {
//       backgroundColor: "rgba(192, 211, 202, 0.3)",
//       borderRadius: "3px",
//       "&:hover": {
//         backgroundColor: "rgba(192, 211, 202, 0.5)",
//       }
//     }
//   },
//   title: {
//     fontFamily: "'Cormorant Garamond', serif !important",
//     fontSize: props => props.isMobile ? "1.2rem !important" : "1.8rem !important",
//     fontWeight: "300 !important",
//     marginBottom: "1.5rem !important",
//     color: "#C0D3CA !important",
//     textAlign: "center",
//     letterSpacing: "0.05em !important",
//   },
//   categoryTitle: {
//     fontFamily: "'Montserrat', sans-serif !important",
//     fontSize: props => props.isMobile ? "0.8rem !important" : "0.9rem !important",
//     fontWeight: "400 !important",
//     color: "#e0e0e0 !important",
//     marginBottom: "0.5rem !important",
//     textAlign: "center",
//     letterSpacing: "0.05em !important",
//   },
//   categoryBox: {
//     backgroundColor: "rgba(30, 30, 30, 0.6)",
//     borderRadius: "4px",
//     border: "1px solid rgba(192, 211, 202, 0.2)",
//     padding: "12px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     marginBottom: "20px",
//     transition: "all 0.3s ease",
//     cursor: "pointer",
//     "&:hover": {
//       backgroundColor: "rgba(192, 211, 202, 0.1)",
//       transform: "translateY(-3px)",
//     }
//   },
//   selectedCategory: {
//     backgroundColor: "rgba(192, 211, 202, 0.1)",
//     border: "1px solid rgba(192, 211, 202, 0.5)",
//     boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
//   },
//   categoryImage: {
//     width: props => props.isMobile ? "50px" : "80px",
//     height: props => props.isMobile ? "50px" : "80px",
//     objectFit: "contain",
//     filter: "brightness(0.9) contrast(1.1)",
//   },
//   checkIcon: {
//     position: "absolute",
//     top: "-8px",
//     right: "-8px",
//     color: "#C0D3CA",
//     backgroundColor: "#0a0a0a",
//     borderRadius: "50%",
//     padding: "2px",
//     fontSize: "20px",
//   },
//   drawerPaper: {
//     backgroundColor: "#0a0a0a !important",
//     color: "#fff !important",
//     borderLeft: "1px solid rgba(192, 211, 202, 0.2) !important",
//   },
//   drawerTitle: {
//     fontFamily: "'Cormorant Garamond', serif !important",
//     fontSize: "1.5rem !important",
//     fontWeight: "300 !important",
//     marginBottom: "1rem !important",
//     color: "#C0D3CA !important",
//     letterSpacing: "0.05em !important",
//   },
//   closeButton: {
//     color: "#C0D3CA !important",
//     border: "1px solid rgba(192, 211, 202, 0.3) !important",
//     padding: "8px !important",
//     borderRadius: "0 !important",
//     fontFamily: "'Montserrat', sans-serif !important",
//     fontSize: "0.8rem !important",
//     letterSpacing: "0.1em !important",
//     transition: "all 0.3s ease !important",
//     "&:hover": {
//       backgroundColor: "rgba(192, 211, 202, 0.1) !important",
//     },
//   },
//   divider: {
//     backgroundColor: "rgba(192, 211, 202, 0.2) !important",
//     margin: "1rem 0 !important",
//   }
// });

// const RightSide = () => {
//   const isMobile = useMediaQuery("(max-width:600px)");
//   const classes = useStyles({ isMobile });
//   const [currentIndex] = useAtom(currentIndexAtom);
//   const [drawerContent, setDrawerContent] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [drawerTitle, setDrawerTitle] = useState("");

//   if (currentIndex !== 1) return null;

//   const handleClick = (key, label) => {
//     setSelectedCategory(key);
//     setDrawerTitle(label);

//     const components = {
//       imagesInsideUp: <ButtonInside handleCloseDrawer={handleCloseDrawer} />,
//       imagesHoles: <ButtonHoles handleCloseDrawer={handleCloseDrawer} />,
//       imagesPoshet: <ButtonPoshet handleCloseDrawer={handleCloseDrawer} />,
//       imageButton: <ButtonButton handleCloseDrawer={handleCloseDrawer} />,
//     };

//     setDrawerContent(components[key]);
//     setDrawerOpen(true);
//   };

//   const handleCloseDrawer = () => {
//     setDrawerOpen(false);
//   };

//   const categories = [
//     { key: "imagesInsideUp", label: "Inner Lining", image: inside },
//     { key: "imagesPoshet", label: "Pocket Square", image: poshet },
//     { key: "imageButton", label: "Button Style", image: button },
//     { key: "imagesHoles", label: "Button Holes", image: holes },
//   ];

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 30 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.8, delay: 0.3 }}
//       className={classes.root}
//     >
//       <Typography variant="h2" className={classes.title}>
//         Finishing Details
//       </Typography>
      
//       <Grid container spacing={2}>
//         {categories.map(({ key, label, image }) => (
//           <Grid item xs={6} key={key}>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: categories.findIndex(c => c.key === key) * 0.1 }}
//             >
//               <Box 
//                 className={`${classes.categoryBox} ${selectedCategory === key ? classes.selectedCategory : ""}`}
//                 onClick={() => handleClick(key, label)}
//                 position="relative"
//               >
//                 <Typography className={classes.categoryTitle}>
//                   {label}
//                 </Typography>
//                 <img
//                   src={image}
//                   alt={label}
//                   className={classes.categoryImage}
//                 />
//                 {selectedCategory === key && (
//                   <CheckCircleIcon className={classes.checkIcon} />
//                 )}
//               </Box>
//             </motion.div>
//           </Grid>
//         ))}
//       </Grid>

//       <Drawer
//         anchor="right"
//         open={drawerOpen}
//         onClose={handleCloseDrawer}
//         PaperProps={{
//           className: classes.drawerPaper,
//           sx: {
//             width: isMobile ? "90%" : "350px",
//           },
//         }}
//       >
//         <Box sx={{ padding: "24px" }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//             <Typography className={classes.drawerTitle}>
//               {drawerTitle}
//             </Typography>
            
//             <IconButton onClick={handleCloseDrawer} sx={{ color: "#C0D3CA" }}>
//               <CloseIcon />
//             </IconButton>
//           </Box>
          
//           <Divider className={classes.divider} />
          
//           {drawerContent}
//         </Box>
//       </Drawer>
//     </motion.div>
//   );
// };

// export default RightSide;