import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import bookingService from "../services/booking.services";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import SaveIcon from "@mui/icons-material/Save";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

const CreateBooking = () => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [timeFinal, setTimeFinal] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [principalUser, setPrincipalUser] = useState("");
  const [fee, setFee] = useState("");
  const [users, setUsers] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  const saveBooking = (e) => {
    e.preventDefault();

    const booking = {
      date: date ? date.toISOString().split("T")[0] : "",
      time: time ? time.toTimeString().split(" ")[0].slice(0, 5) : "",
      time_final: timeFinal,
      numberOfPeople: parseInt(numberOfPeople),
      principalUser,
      fee: parseInt(fee),
      users,
    };

    if (id) {
      // Lógica para actualizar una reserva existente (si aplica)
    } else {
      bookingService
        .create(booking)
        .then((response) => {
          if (response.data.id == null) {
            alert("Horario no disponible, por favor elige otro horario.");
          } else {
            console.log("Reserva creada exitosamente.", response.data);
            alert("Reserva creada exitosamente. Redireccionando a la boleta.");
            navigate(`/receipt/${response.data.id}`);
          }
        })
        .catch((error) => {
          console.log("Error al crear la reserva.", error);
        });
    }
  };

  useEffect(() => {
  }, [id]);

  const handleUserChange = (index, e) => {
    const newUsers = [...users];
    newUsers[index] = e.target.value;
    setUsers(newUsers);
  };

  const getTimeLimits = () => {
    if (!date) {
      return {
        minTime: setHours(setMinutes(new Date(), 0), 14),
        maxTime: setHours(setMinutes(new Date(), 0), 22),
      };
    }
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return {
        minTime: setHours(setMinutes(new Date(), 0), 10),
        maxTime: setHours(setMinutes(new Date(), 0), 22),
      };
    } else {
      return {
        minTime: setHours(setMinutes(new Date(), 0), 14),
        maxTime: setHours(setMinutes(new Date(), 0), 22),
      };
    }
  };

  // Solo permitir selección de fecha desde hoy
  const minDate = new Date();

  // Actualizar los campos de usuarios cuando cambie el número de personas
  const updateUserFields = (e) => {
    setNumberOfPeople(e.target.value);
    const newUsers = Array.from({ length: e.target.value }, () => "");
    setUsers(newUsers);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      component="form"
      sx={{ mt: 4 }}
    >
      <Typography variant="h4" sx={{ color: "black", mb: 2 }}>
        {"Crear nueva reserva"}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <DatePicker
              value={date}
              onChange={(newValue) => setDate(newValue)}
              inputFormat="yyyy-MM-dd"
              minDate={minDate}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ backgroundColor: "white" }}
                  required
                  variant="standard"
                  helperText="Selecciona la fecha"
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TimePicker
              value={time}
              onChange={(newValue) => setTime(newValue)}
              minTime={getTimeLimits().minTime}
              maxTime={getTimeLimits().maxTime}
              ampm={false}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ backgroundColor: "white" }}
                  required
                  variant="standard"
                  inputProps={{
                    ...params.inputProps,
                    readOnly: true,
                  }}
                  helperText="Selecciona la hora de inicio"
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              id="numberOfPeople"
              label="Número de Personas"
              type="number"
              value={numberOfPeople}
              variant="standard"
              onChange={updateUserFields}
              required
              sx={{ backgroundColor: "white" }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              id="principalUser"
              label="Usuario Principal"
              value={principalUser}
              variant="standard"
              onChange={(e) => setPrincipalUser(e.target.value)}
              required
              sx={{ backgroundColor: "white" }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              id="fee"
              select
              label="Tarifa Base"
              value={fee}
              variant="standard"
              onChange={(e) => setFee(e.target.value)}
              required
              sx={{ backgroundColor: "white" }}
            >
              <MenuItem value={1}>10 vueltas o máx 10 min</MenuItem>
              <MenuItem value={2}>15 vueltas o máx 15 min</MenuItem>
              <MenuItem value={3}>20 vueltas o máx 20 min</MenuItem>
            </TextField>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            {users.map((user, index) => (
              <TextField
                key={index}
                label={`Rut número ${index + 1}`}
                variant="standard"
                value={user}
                onChange={(e) => handleUserChange(index, e)}
                fullWidth
                sx={{ mb: 1, backgroundColor: "white" }}
              />
            ))}
          </FormControl>

          <FormControl sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="info"
              onClick={(e) => saveBooking(e)}
              startIcon={<SaveIcon />}
            >
              Guardar
            </Button>
          </FormControl>
        </form>
      </LocalizationProvider>
    </Box>
  );
};

export default CreateBooking;