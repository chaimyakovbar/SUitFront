import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  Paper,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Container,
  Stack,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import useProduct from "../Hooks/useProduct";

const Payed = () => {
  const { data: products, isLoading, error } = useProduct();
  const [selectedItems, setSelectedItems] = useState([]);

  // Initially mark all items as selected
  React.useEffect(() => {
    if (products && products.length > 0) {
      setSelectedItems(products.map((product) => product._id));
    }
  }, [products]);

  // Handle toggle for checkboxes
  const handleToggle = (productId) => {
    const currentIndex = selectedItems.indexOf(productId);
    const newSelectedItems = [...selectedItems];

    if (currentIndex === -1) {
      newSelectedItems.push(productId);
    } else {
      newSelectedItems.splice(currentIndex, 1);
    }

    setSelectedItems(newSelectedItems);
  };

  // Calculate total price of selected items
  const calculateTotal = () => {
    if (!products) return 0;
    return products
      .filter((product) => selectedItems.includes(product._id))
      .reduce((total, product) => total + (product.price || 0), 0);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          אירעה שגיאה בטעינת המידע
        </Typography>
        <Link to="/">
          <Button variant="contained" sx={{ mt: 2 }}>
            חזרה לדף הבית
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="column" spacing={3}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              התשלום בוצע בהצלחה
            </Typography>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 40 }} />
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              <ShoppingBagIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              המוצרים שרכשת
            </Typography>

            <Card variant="outlined" sx={{ mt: 2 }}>
              <CardContent>
                <List sx={{ width: "100%" }}>
                  {products && products.length > 0 ? (
                    products.map((product, index) => (
                      <React.Fragment key={product._id || index}>
                        <ListItem
                          dense
                          secondaryAction={
                            <Typography variant="body1" fontWeight="bold">
                              ₪{product.price || 0}
                            </Typography>
                          }
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={selectedItems.includes(product._id)}
                              onChange={() => handleToggle(product._id)}
                              inputProps={{
                                "aria-labelledby": `product-${product._id}`,
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            id={`product-${product._id}`}
                            primary={
                              <Typography variant="body1">
                                {product.name || "מוצר"}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {product.description || "פריט מותאם אישית"}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < products.length - 1 && (
                          <Divider variant="inset" component="li" />
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="אין מוצרים להצגה" />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ bgcolor: "#f9f9f9", p: 2, borderRadius: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">סה"כ לתשלום:</Typography>
              <Chip
                label={`₪${calculateTotal()}`}
                color="primary"
                variant="filled"
                sx={{ fontSize: "1.1rem", fontWeight: "bold", py: 2 }}
              />
            </Stack>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Link to="/">
              <Button
                variant="outlined"
                size="large"
                startIcon={<ShoppingBagIcon />}
              >
                המשך קניות
              </Button>
            </Link>
            <Button variant="contained" color="success" size="large">
              הורד חשבונית
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Payed;
