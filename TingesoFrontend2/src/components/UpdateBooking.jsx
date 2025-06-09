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

const UpdateBooking = () => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [timeFinal, setTimeFinal] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [principalUser, setPrincipalUser] = useState("");
  const [fee, setFee] = useState("");
  const [users, setUsers] = useState([]);
  
  const { id } = useParams();
  const navigate = useNavigate();

  const minDate = new Date();

  useEffect(() => {
    if (id) {

      bookingService
      .get(id)
        .then((response) => {
          const booking = response.data;
          setDate(new Date(booking.date));
          setTime(new Date(`${booking.date}T${booking.time}`));
          setTimeFinal(booking.time_final);
          setNumberOfPeople(booking.numberOfPeople.toString());
          setPrincipalUser(booking.principalUser);
          setFee(booking.fee.toString());
          setUsers(booking.users || []);


        })
        .catch((error) => {
          console.error("Error al cargar la reserva:", error);
          navigate("/rack");
        });
    }
  }, []);

  const saveBooking = (e) => {
    e.preventDefault();

    const booking = {
        id: id,
      date: date ? date.toISOString().split("T")[0] : "",
      time: time ? time.toTimeString().split(" ")[0].slice(0, 5) : "",
      time_final: timeFinal,
      numberOfPeople: parseInt(numberOfPeople),
      principalUser,
      fee: parseInt(fee),
      users,
    };
    
    console.log("Reserva a actualizar:", booking);


    bookingService
    .update(booking)
        .then(() => {
        console.log("Reserva actualizada exitosamente.");
        navigate("/rack");
        })
        .catch((error) => {
        console.error("Error al actualizar la reserva.", error);
        });
  };

  const handleUserChange = (index, e) => {
    const newUsers = [...users];
    newUsers[index] = e.target.value;
    setUsers(newUsers);
  };

  const updateUserFields = (e) => {
    const value = e.target.value;
    setNumberOfPeople(value);
    const newUsers = Array.from({ length: value }, (_, i) => users[i] || "");
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
    return (dayOfWeek === 0 || dayOfWeek === 6)
      ? {
          minTime: setHours(setMinutes(new Date(), 0), 10),
          maxTime: setHours(setMinutes(new Date(), 0), 22),
        }
      : {
          minTime: setHours(setMinutes(new Date(), 0), 14),
          maxTime: setHours(setMinutes(new Date(), 0), 22),
        };
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
        {"Editar Reserva"}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <DatePicker
            value={date}
            onChange={(newValue) => setDate(newValue)}
            inputFormat="yyyy-MM-dd"
            minDate={minDate}
            renderInput={(params) => (
              <TextField {...params} required variant="standard" sx={{ backgroundColor: "white" }} />
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
              <TextField {...params} required variant="standard" sx={{ backgroundColor: "white" }} />
            )}
          />
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="Número de Personas"
            type="number"
            value={numberOfPeople}
            onChange={updateUserFields}
            variant="standard"
            required
            sx={{ backgroundColor: "white" }}
          />
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="Usuario Principal"
            value={principalUser}
            onChange={(e) => setPrincipalUser(e.target.value)}
            variant="standard"
            required
            sx={{ backgroundColor: "white" }}
          />
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            select
            label="Tarifa Base"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            variant="standard"
            required
            sx={{ backgroundColor: "white" }}
          >
            <MenuItem value={1}>10 vueltas o máx 10 min</MenuItem>
            <MenuItem value={2}>15 vueltas o máx 15 min</MenuItem>
            <MenuItem value={3}>20 vueltas o máx 20 min</MenuItem>
          </TextField>
        </FormControl>

        {users.map((user, index) => (
          <FormControl key={index} fullWidth sx={{ mb: 2 }}>
            <TextField
              label={`Rut número ${index + 1}`}
              value={user}
              onChange={(e) => handleUserChange(index, e)}
              variant="standard"
              sx={{ backgroundColor: "white" }}
            />
          </FormControl>
        ))}

        <Button
          variant="contained"
          color="info"
          onClick={saveBooking}
          startIcon={<SaveIcon />}
          sx={{ mt: 2 }}
        >
          Actualizar
        </Button>
      </LocalizationProvider>

      <hr />
      <Link to="/rack">Volver al Rack Semanal</Link>
    </Box>
  );
};

export default UpdateBooking;