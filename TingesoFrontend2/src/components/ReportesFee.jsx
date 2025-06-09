import React, { useEffect, useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import reportesService from "../services/reportes.service";

const tarifas = [
  { label: "10 vueltas o máx 10 min", value: 1 },
  { label: "15 vueltas o máx 15 min", value: 2 },
  { label: "20 vueltas o máx 20 min", value: 3 },
];

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const rotateLeft = (arr) => {
  if (!arr || arr.length === 0) return arr;
  return arr.slice(1).concat(arr[0]);
};

const ReportesFee = () => {
  const [data, setData] = useState([[], [], []]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.all([
          reportesService.getReporteFee(1),
          reportesService.getReporteFee(2),
          reportesService.getReporteFee(3),
        ]);
        setData(results.map(r => rotateLeft(r.data)));
      } catch (error) {
        setData([[], [], []]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sumCol = (colIdx) =>
    data.reduce((acc, row) => acc + (row[colIdx] || 0), 0);

  const sumRow = (rowIdx) =>
    (data[rowIdx] || []).reduce((acc, val) => acc + (val || 0), 0);

  const total = data.reduce((acc, row) => acc + row.reduce((a, v) => a + (v || 0), 0), 0);

  const formatCLP = (valor) => "$" + (valor?.toLocaleString("es-CL") || "0");

  return (
    <Box sx={{ p: 4, position: "relative" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Reporte de Ganancias por Tarifa
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#e0e0e0" }}>
                  Tipo de Tarifa
                </TableCell>
                {meses.map((mes) => (
                  <TableCell key={mes} sx={{ fontWeight: "bold", bgcolor: "#e0e0e0" }}>
                    {mes}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#e0e0e0" }}>TOTAL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tarifas.map((tarifa, idx) => (
                <TableRow key={tarifa.value}>
                  <TableCell>{tarifa.label}</TableCell>
                  {data[idx].map((valor, j) => (
                    <TableCell key={j}>
                      {formatCLP(valor)}
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {formatCLP(sumRow(idx))}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#e0e0e0" }}>TOTAL</TableCell>
                {Array.from({ length: 12 }).map((_, colIdx) => (
                  <TableCell key={colIdx} sx={{ fontWeight: "bold", bgcolor: "#e0e0e0" }}>
                    {formatCLP(sumCol(colIdx))}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#e0e0e0" }}>
                  {formatCLP(total)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box sx={{ position: "fixed", bottom: 32, right: 32, zIndex: 1000 }}>
        <Button variant="contained" color="secondary" onClick={() => navigate("/reportes-group")}>
          Ir a Reporte por Grupo
        </Button>
      </Box>
    </Box>
  );
};

export default ReportesFee;