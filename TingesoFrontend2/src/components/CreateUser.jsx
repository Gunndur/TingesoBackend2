import React, { useState } from "react";
import { Box, TextField, Button, Typography, Card, CardContent, Snackbar, Alert } from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import userService from "../services/user.services";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    rut: "",
    name: "",
    email: "",
    birthdate: null,
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      birthdate: newDate,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      birthdate: formData.birthdate
        ? formData.birthdate.toISOString().split('T')[0] 
        : "",
    };

    console.log("Usuario creado:", formattedData);

    try {
      await userService
      .create(formattedData);
      setSnackbarMessage("Usuario creado exitosamente");
      setSnackbarSeverity("success");
      setFormData({ rut: "", name: "", email: "", birthdate: null });
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Error al crear usuario");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh" 
        bgcolor="#ffffff"
      >
        <Card sx={{ maxWidth: 400, width: '100%', p: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Crear Usuario
            </Typography>
            <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
              <TextField
                label="RUT"
                name="rut"
                value={formData.rut}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
              />
              <DatePicker
                label="Fecha de Nacimiento"
                value={formData.birthdate}
                onChange={handleDateChange}
                format="yyyy-MM-dd"
                renderInput={(params) => (
                  <TextField {...params} required fullWidth />
                )}
              />
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Crear Usuario
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Snackbar para feedback */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateUser;