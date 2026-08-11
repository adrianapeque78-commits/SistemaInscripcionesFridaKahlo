import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SchoolIcon from "@mui/icons-material/School";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
function Inscripciones() {
    const navigate = useNavigate();
    const [filas, setFilas] = useState([]);
    const [grupos, setGrupos] = useState([]);
    console.log("ESTOY EN Inscripciones");
    console.log("GRUPOS:", grupos);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState("");
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
    const [abrirAsignacion, setAbrirAsignacion] = useState(false);
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const eliminarInscripcion = async (id) => {

        try {

            const respuesta = await fetch(
                `http://localhost:3001/inscripciones/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(data.mensaje || "No fue posible eliminar.");
            }

            alert(data.mensaje);

            setFilas(filasActuales =>
                filasActuales.filter(fila => fila.id !== id)
            );

        } catch (error) {

            console.error(error);

            alert(error.message);

        }

    };
    const [snackbar, setSnackbar] = useState({
        open: false,
        mensaje: "",
        severity: "success"
    });
    const columnas = [
        { field: "folio", headerName: "Folio", width: 150 },
        { field: "nombre", headerName: "Alumno", width: 300 },
        {
            field: "grado",
            headerName: "Grado",
            width: 100,
            renderCell: (params) =>
                params.value ? `${params.value}°` : "—"
        },
        { field: "grupo", headerName: "Grupo", width: 120 },
        { field: "estado", headerName: "Estado", width: 150 }
        ,
        {
            field: "acciones",
            headerName: "Acciones",
           width: 170,
            sortable: false,
            renderCell: (params) => (
                <div style={{ display: "flex", gap: "8px" }}>

                    <IconButton
                        color="primary"
                        onClick={() =>
                            navigate(`/dashboard/expediente/${params.row.id}`)
                        }
                    >
                        <VisibilityIcon />
                    </IconButton>

                    {usuario.rol_id === 1 && (
                        <>
                            <IconButton
                                color="success"
                                onClick={() => {
                                    setAlumnoSeleccionado(params.row);
                                    setAbrirAsignacion(true);
                                }}
                            >
                                <SchoolIcon />
                            </IconButton>

                            <IconButton
                                color="error"
                                onClick={() => {
                                    if (
                                        window.confirm(
                                            `¿Seguro que deseas eliminar la inscripción de ${params.row.nombre}?`
                                        )
                                    ) {
                                        eliminarInscripcion(params.row.id);
                                    }
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </>
                    )}

                </div>
            )
        }
    ];
    const cargarInscripciones = async () => {

        try {

            const respuesta = await fetch(
                "https://sistema-inscripciones-frida-kahlo-b.vercel.app/inscripciones"
            );

            const datos = await respuesta.json();

            setFilas(datos);

        } catch (error) {

            console.error(error);

        }

    };
    useEffect(() => {

        cargarInscripciones();

        fetch("https://sistema-inscripciones-frida-kahlo-b.vercel.app/inscripciones/grupos")
            .then(res => res.json())
            .then(data => {

                setGrupos(data);

            })
            .catch(console.error);

    }, []);

    return (

        <div style={{ padding: "30px" }}>

            <h1>Inscripciones</h1>
            <p>Total de registros: {filas.length}</p>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "20px"
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/inscripcion")}
                >
                    Nueva inscripción
                </Button>
            </div>
            <div className="tabla">

                <DataGrid
                    rows={filas}
                    columns={columnas}
                    pageSizeOptions={[5, 10]}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5
                            }
                        }
                    }}
                />

            </div>
            <Dialog
                open={abrirAsignacion}
                onClose={() => setAbrirAsignacion(false)}
                maxWidth="sm"
                fullWidth
            >

                <DialogTitle>
                    Asignar grupo
                </DialogTitle>

                <DialogContent>

                    <p>
                        Alumno:
                    </p>

                    <strong>
                        {alumnoSeleccionado?.nombre}
                    </strong>
                    <br />
                    <br />

                    <label>Grupo</label>

                    <br />

                    <select
                        value={grupoSeleccionado}
                        onChange={(e) => setGrupoSeleccionado(Number(e.target.value))}
                    >

                        <option value="">Seleccionar grupo</option>

                        {grupos.map((grupo) => (
                            <option
                                key={grupo.id}
                                value={grupo.id}
                            >
                                {grupo.nombre}
                            </option>
                        ))}

                    </select>
                    <br />
                    <br />

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "10px"
                        }}
                    >

                        <Button
                            variant="outlined"
                            onClick={() => setAbrirAsignacion(false)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="contained"
                            disabled={!grupoSeleccionado}
                            onClick={async () => {

                                const respuesta = await fetch(
                                    `https://sistema-inscripciones-frida-kahlo-b.vercel.app/inscripciones/${alumnoSeleccionado.id}/grupo`,
                                    {
                                        method: "PUT",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            grupo_id: grupoSeleccionado
                                        })
                                    }
                                );

                                const datos = await respuesta.json();

                                await cargarInscripciones();

                                setAbrirAsignacion(false);
                                setGrupoSeleccionado("");
                                setAlumnoSeleccionado(null);

                                setSnackbar({
                                    open: true,
                                    mensaje: datos.mensaje,
                                    severity: "success"
                                });

                            }}
                        >
                            Guardar
                        </Button>

                    </div>
                </DialogContent>

            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false
                    })
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity={snackbar.severity}
                    onClose={() =>
                        setSnackbar({
                            ...snackbar,
                            open: false
                        })
                    }
                    variant="filled"
                >
                    {snackbar.mensaje}
                </Alert>

            </Snackbar>
        </div>

    );

}

export default Inscripciones;
