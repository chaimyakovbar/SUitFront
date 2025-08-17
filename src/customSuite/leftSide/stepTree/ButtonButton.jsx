import React from "react";
import { Button, Box, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { selectedButtonAtom } from "../../../Utils";
import { imageButton } from "../../../consts/KindOfColors";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";



const ButtonButton = ({ handleCloseDrawer }) => {
  const [selectedButton, setSelectedButton] = useAtom(selectedButtonAtom);

  const handleClick = (name) => {
    setSelectedButton(name);
    handleCloseDrawer(false);
  };

  const handleReset = () => {
    setSelectedButton(null);
    handleCloseDrawer(false);
  };

  return (
    <Box sx={{ width: "100%" }}>

      {/* Enhanced Grid */}
      <Grid container spacing={3} sx={{ justifyContent: "center" }}>
        {imageButton.map((item, index) => (
          <Grid item key={item.name} xs={6} sm={4} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Enhanced Button Container */}
                <Box
                  sx={{
                    width: { xs: 70, md: 80 },
                    height: { xs: 70, md: 80 },
                    borderRadius: '50%',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    border: selectedButton === item.name
                      ? '3px solid rgba(192, 211, 202, 0.8)'
                      : '2px solid rgba(192, 211, 202, 0.2)',
                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedButton === item.name
                      ? '0 8px 24px rgba(192, 211, 202, 0.3)'
                      : '0 4px 12px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(192, 211, 202, 0.2)',
                      border: '3px solid rgba(192, 211, 202, 0.6)'
                    }
                  }}
                  onClick={() => handleClick(item.name)}
                >
                  {/* Image with lighter background for better visibility */}
                  <Box
                    sx={{
                      width: '85%',
                      height: '85%',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, rgba(60, 60, 60, 0.8) 0%, rgba(50, 50, 50, 0.9) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(192, 211, 202, 0.1)'
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: 'brightness(1.3) contrast(1.2)',
                        mixBlendMode: 'normal'
                      }}
                    />
                  </Box>
                  
                  {/* Selection Check Icon */}
                  {selectedButton === item.name && (
                    <CheckCircleIcon 
                      sx={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        color: '#C0D3CA',
                        backgroundColor: 'rgba(10, 10, 10, 0.95)',
                        borderRadius: '50%',
                        padding: '3px',
                        fontSize: '18px',
                        border: '2px solid rgba(192, 211, 202, 0.4)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                      }}
                    />
                  )}
                </Box>
                
                {/* Button Name */}
                <Typography 
                  sx={{
                    color: '#C0D3CA',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    textAlign: 'center',
                    mt: 1.5,
                    mb: 0.5,
                    letterSpacing: '0.3px',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {item.name}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Enhanced Reset Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button 
          onClick={handleReset}
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            background: 'linear-gradient(135deg, rgba(192, 211, 202, 0.1) 0%, rgba(192, 211, 202, 0.05) 100%)',
            color: '#C0D3CA',
            border: '1px solid rgba(192, 211, 202, 0.3)',
            padding: '10px 24px',
            borderRadius: '8px',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.85rem',
            fontWeight: 500,
            letterSpacing: '0.5px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(192, 211, 202, 0.2) 0%, rgba(192, 211, 202, 0.1) 100%)',
              border: '1px solid rgba(192, 211, 202, 0.5)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(192, 211, 202, 0.2)'
            }
          }}
        >
          Reset Selection
        </Button>
      </Box>
    </Box>
  );
};

export default ButtonButton;
