import { useEffect, useState } from "react";
import "../styles/Inscripciones.css";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";


function Inscripciones() {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const columnas = [
        { field: "folio", headerName: "Folio", width: 120 },
        { field: "nombre", headerName: "Alumno", width: 280 },
        { field: "grupo", headerName: "Grupo", width: 120 },
        { field: "estado", headerName: "Estado", width: 180 },
        {
            field: "acciones",
            headerName: "Acciones",
            width: 170,
            sortable: false,
            renderCell: (params) => (
                <>
                    <IconButton
                        color="primary"
                        onClick={() => navigate(`/dashboard/expediente/${params.row.id}`)}
                    >
                        <VisibilityIcon />
                    </IconButton>

                    {usuario.rol_id === 1 && (
                        <>
                            <IconButton color="warning">
                                <EditIcon />
                            </IconButton>

                            <IconButton color="error">
                                <DeleteIcon />
                            </IconButton>
                        </>
                    )}
                </>
            )
        }
    ];

    const [filas, setFilas] = useState([]);

    useEffect(() => {

        const usuario = JSON.parse(localStorage.getItem("usuario"));

        let url = "http://localhost:3001/inscripciones";

        if (usuario.rol_id === 2) {
            url += `?grupo_id=${usuario.grupo_id}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setFilas(data);
            })
            .catch(error => console.error(error));

    }, []);
    return (
        <>
            <div className="page-header">

                <div>
                    <div className="busqueda">

                        <input
                            type="text"
                            placeholder="Buscar por nombre o folio..."
                        />

                    </div>
                    <h1>Inscripciones</h1>

                    <p>
                        Administra las solicitudes de inscripción del ciclo escolar.
                    </p>
                </div>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/formulario-inscripcion")}
                >
                    Nueva inscripción
                </Button>

            </div>

            <div className="tabla">

                <DataGrid
                    rows={filas}
                    columns={columnas}
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                />

            </div>
        </>
    );
}

export default Inscripciones;