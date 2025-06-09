import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import userService from "../services/user.services"; // Asegúrate de tener un servicio para obtener los usuarios

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Llama al servicio para obtener los usuarios
    userService
      .getAll()
      .then((response) => {
        const sortedUsers = response.data.sort((a, b) => a.id - b.id);
         setUsers(sortedUsers);
      })
      .catch((error) => {
        console.error("Error al obtener los usuarios:", error);
      });
  }, []);

  return (
    <Paper sx={{ p: 4, m: 4, boxShadow: 6, borderRadius: "16px" }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
        Lista de Usuarios
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rut</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Cumpleaños</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Frecuencia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.rut}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.birthdate}</TableCell>
                  <TableCell>{user.frequent === 0
                              ? "No frecuente"
                              : user.frequent === 1
                              ? "Regular"
                              : user.frequent === 2
                              ? "Frecuente"
                              : user.frequent === 3
                              ? "Muy frecuente"
                              : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay usuarios disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Users;