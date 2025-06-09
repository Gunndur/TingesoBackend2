import React, { useEffect, useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import reportesService from "../services/reportes.service";

// Definición de los grupos y sus rangos
const grupos = [
  { label: "1-2 personas", range: [1, 2] },
  { label: "3-5 personas", range: [3, 5] },
  { label: "6-10 personas", range: [6, 10] },
  { label: "11-15 personas", range: [11, 15] },
];

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const ReportesGroup = () => {
  const [groupData, setGroupData] = useState([[], [], [], []]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        // Llama a getReporteGroup para cada tamaño de grupo (1 a 15)
        const results = await Promise.all(
          Array.from({ length: 15 }, (_, i) => reportesService.getReporteGroup(i + 1))
        );
        // results[i].data es un array de 12 meses para el tamaño de grupo i+1
        // Agrupa los resultados según los rangos definidos
        const agrupados = grupos.map(({ range }) => {
          const [min, max] = range;
          let sum = Array(12).fill(0);
          for (let i = min; i <= max; i++) {
            const data = results[i - 1].data || [];
            sum = sum.map((val, idx) => val + (data[idx] || 0));
          }
          return sum;
        });
        setGroupData(agrupados);
      } catch (error) {
        setGroupData([[], [], [], []]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllGroups();
  }, []);

  // Suma por columna (mes)
  const sumCol = (colIdx) =>
    groupData.reduce((acc, row) => acc + (row[colIdx] || 0), 0);

  // Suma por fila (grupo)
  const sumRow = (rowIdx) =>
    (groupData[rowIdx] || []).reduce((acc, val) => acc + (val || 0), 0);

  // Suma total
  const total = groupData.reduce((acc, row) => acc + row.reduce((a, v) => a + (v || 0), 0), 0);

  // Formatear con signo $
  const formatCLP = (valor) => "$" + (valor?.toLocaleString("es-CL") || "0");

  return (
    <Box sx={{ p: 4, position: "relative" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Reporte de Ganancias por Tamaño de Grupo
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
                  Número de personas
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
              {grupos.map((grupo, idx) => (
                <TableRow key={grupo.label}>
                  <TableCell>{grupo.label}</TableCell>
                  {groupData[idx].map((valor, j) => (
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
        <Button variant="contained" color="primary" onClick={() => navigate("/reportes-fee")}>
          Ir a Reporte por Tarifa
        </Button>
      </Box>
    </Box>
  );
};

export default ReportesGroup;