import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { Paper, Typography, IconButton, Box, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import addDays from "date-fns/addDays";
import es from "date-fns/locale/es";
import bookingServices from "../services/booking.services";

// Locale setup
const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const Rack = () => {
  const [events, setEventos] = useState([]);
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null); // Evento seleccionado
  const [dialogOpen, setDialogOpen] = useState(false); // Estado para el diálogo

  useEffect(() => {
    bookingServices
      .getAll()
      .then((response) => {
        const bookings = response.data;
        const newEvents = bookings.map((booking) => ({
          id: booking.id,
          title: booking.principalUser,
          start: new Date(`${booking.date}T${booking.time}`),
          end: new Date(`${booking.date}T${booking.time_final}`),
          desc: `Reserva para ${booking.numberOfPeople} personas.`,
        }));
        setEventos(newEvents);
      })
      .catch((error) => {
        console.error("Error al obtener las reservas:", error);
      });
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event); // Guarda el evento seleccionado
    setDialogOpen(true); // Abre el diálogo
  };

  const handleCloseDialog = () => {
    setDialogOpen(false); // Cierra el diálogo
    setSelectedEvent(null); // Limpia el evento seleccionado
  };

  const handleUpdateEvent = () => {
    // Redirige a la página de actualización
    window.location.href = `/booking/edit/${selectedEvent.id}`;
  };

  const handleinfoEvent = () => {
    window.location.href = `/receipt/${selectedEvent.id}`;
  };

  const handleDeleteEvent = () => {
    // Lógica para borrar el evento
    bookingServices
      .remove(selectedEvent.id)
      .then(() => {
        setEventos(events.filter((event) => event.id !== selectedEvent.id)); // Elimina el evento de la lista
        handleCloseDialog(); // Cierra el diálogo
      })
      .catch((error) => {
        console.error("Error al borrar la reserva:", error);
      });
  };

  return (
    <Paper
      sx={{
        p: 4,
        m: 4,
        boxShadow: 6,
        borderRadius: "16px",
        backgroundColor: "#f9fafb",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        sx={{ color: "#333" }}
      >
        Rack Semanal de Reservas
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <IconButton
          color="primary"
          onClick={() => setDate(addDays(date, -7))}
          sx={{
            border: "2px solid",
            borderRadius: "50%",
            p: 1,
            bgcolor: "#fff",
            boxShadow: 2,
            "&:hover": { bgcolor: "#e3f2fd" },
          }}
        >
          <ArrowBackIos fontSize="small" />
        </IconButton>

        <Typography variant="h6" fontWeight="medium" sx={{ color: "#555" }}>
          Semana de {format(date, "dd 'de' MMMM yyyy", { locale: es })}
        </Typography>

        <IconButton
          color="primary"
          onClick={() => setDate(addDays(date, 7))}
          sx={{
            border: "2px solid",
            borderRadius: "50%",
            p: 1,
            bgcolor: "#fff",
            boxShadow: 2,
            "&:hover": { bgcolor: "#e3f2fd" },
          }}
        >
          <ArrowForwardIos fontSize="small" />
        </IconButton>
      </Box>

      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          "& .rbc-calendar": {
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["week"]}
          defaultView="week"
          date={date}
          onNavigate={setDate}
          style={{ height: 900, minWidth: "1000px" }}
          culture="es"
          min={new Date(0, 0, 0, 10, 0)}
          max={new Date(0, 0, 0, 22, 0)}
          components={{ toolbar: () => null }}
          onSelectEvent={handleSelectEvent} // Maneja la selección de eventos
        />
      </Box>

      {/* Diálogo para opciones de evento */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Opciones de Evento</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Qué deseas hacer con la reserva de <strong>{selectedEvent?.title}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateEvent} color="primary">
            Actualizar
          </Button>
          <Button onClick={handleinfoEvent} color="secondary">
          Ver Boleta
          </Button>
          <Button onClick={handleDeleteEvent} color="error">
            Borrar
          </Button>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Rack;