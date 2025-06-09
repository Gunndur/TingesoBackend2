import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import receiptServices from "../services/receipt.services";
import bookingServices from "../services/booking.services";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert"; 

const MostrarReceipt = () => {
  const { id } = useParams();

  // Estado para manejar la notificación
  const [notification, setNotification] = useState(false); 

  // Obtener datos de las boletas
  const [receiptData, setReceiptData] = useState(null);

  // Obtener datos de la reserva
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [vueltas, setVueltas] = useState(null);
  const [personas, setPersonas] = useState(null);
  const [nombrePrincipal, setNombrePrincipal] = useState("");


  const handleSendReceipts = () => {
    // Simula el envío de comprobantes
    console.log("Enviando comprobantes a los correos de los usuarios...");
    setNotification(true); // Activa la notificación
  };


  const init1 = (id) => {
  bookingServices
    .get(id)
    .then((response) => {
      
      setFecha(response.data.date);
      setHora(response.data.time);
      setVueltas(response.data.fee);
      setPersonas(response.data.numberOfPeople);
      setNombrePrincipal(response.data.principalUser);
    })
    .catch((error) => {
      console.error("Error al obtener los datos de la reserva", error);
    });
};

  const init2 = (id) => {
    receiptServices
      .get(id)
      .then((response) => {
        
        setReceiptData(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de las boletas", error);
      });
  };

  useEffect(() => {
    init1(id);
    init2(id);
  }, []);

  if (!receiptData || !fecha) {
    return <Typography variant="h6">Cargando...</Typography>;
  };

  const { booking, paymentDetails } = receiptData;

  return (
    <Box sx={{ mt: 4 }}>
      {/* Información de la Reserva */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>

          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Código de la Reserva</TableCell>
              <TableCell>{id || "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha y Hora de la Reserva</TableCell>
              <TableCell>{fecha || "N/A"} a las {hora || "N/A"} horas</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Número de Vueltas/Tiempo Máximo Reservado</TableCell>
              <TableCell>
                {vueltas === 1
                  ? "10 vueltas / 10 min"
                  : vueltas === 2
                  ? "15 vueltas / 15 min"
                  : vueltas === 3
                  ? "20 vueltas / 20 min"
                  : "N/A"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Cantidad de Personas</TableCell>
              <TableCell>{personas || "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre del Reservante</TableCell>
              <TableCell>{nombrePrincipal || "N/A"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detalle de Pago en Tabla */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre Cliente</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tarifa Base</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Descuento: Grupo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Descuento: Cliente Frecuente</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Descuento: Día Especial</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Descuento: Cumpleaños</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Monto</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>IVA</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Monto Final</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receiptData && receiptData.length > 0 ? (
              receiptData.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.userName || "N/A"}</TableCell>
                  <TableCell>{user.fee || "N/A"}</TableCell>
                  <TableCell>{user.typeDesc === 1 ? user.maxDesc * 100 + "%" || "N/A" : "N/A"}</TableCell>
                  <TableCell>{user.typeDesc === 2 ? user.maxDesc * 100 + "%" || "N/A" : "N/A"}</TableCell>
                  <TableCell>{user.typeDesc === 3 ? user.maxDesc * 100 + "%" || "N/A" : "N/A"}</TableCell>
                  <TableCell>{user.typeDesc === 4 ? user.maxDesc * 100 + "%" || "N/A" : "N/A"}</TableCell>
                  <TableCell>{"$" + user.amount || "N/A"}</TableCell>
                  <TableCell>{user.iva * 100 + "%" || "N/A"}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>{"$" + user.finalAmount || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay detalles de pago disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Botón en la parte inferior derecha */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSendReceipts}>
          Enviar Comprobantes
        </Button>
      </Box>

      {/* Notificación */}
      <Snackbar
        open={notification}
        autoHideDuration={3000}
        onClose={() => setNotification(false)}
      >
        <Alert onClose={() => setNotification(false)} severity="success" sx={{ width: "100%" }}>
          Comprobantes enviados a los correos de los usuarios.
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default MostrarReceipt;