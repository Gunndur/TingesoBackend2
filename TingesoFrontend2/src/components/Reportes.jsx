import React from "react";
import { Box, Button, Typography, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Reportes = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#ffffff">
      <Card sx={{ maxWidth: 400, width: "100%", p: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom textAlign="center">
            Selecciona un tipo de reporte
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/reportes-fee")}
              fullWidth
            >
              Reporte por Tarifa (Fee)
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/reportes-group")}
              fullWidth
            >
              Reporte por Grupo
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reportes;