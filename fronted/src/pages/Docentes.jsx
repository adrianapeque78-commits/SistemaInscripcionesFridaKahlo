import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";
import BlockIcon from "@mui/icons-material/Block";

function Docentes() {
    const navigate = useNavigate();

    const [filas, setFilas] = useState([]);

    useEffect(() => {

        fetch("https://sistemainscripcionesfridakahlo.onrender.com/docentes")
            .then(res => res.json())
            .then(data => setFilas(data))
            .catch(console.error);

    }, []);

    const columnas = [
        { field: "nombre", headerName: "Nombre", width: 230 },
        { field: "usuario", headerName: "Usuario", width: 150 },
        { field: "grupo", headerName: "Grupo", width: 110 },
        { field: "rol", headerName: "Rol", width: 120 },
        { field: "estado", headerName: "Estado", width: 120 },
        {
            field: "acciones",
            headerName: "Acciones",
            width: 180,
            sortable: false,
            renderCell: (params) => (

                <>
                    <IconButton
                        color="primary"
                        onClick={() =>
                            navigate(`/dashboard/docentes/${params.row.id}/editar`)
                        }
                    >
                        <EditIcon />
                    </IconButton>

                    <IconButton
                        color="warning"
                        onClick={() =>
                            navigate(`/dashboard/docentes/${params.row.id}/password`)
                        }
                    >
                        <LockResetIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={async () => {

                            const respuesta = await fetch(
                                `https://sistemainscripcionesfridakahlo.onrender.com/docentes/${params.row.id}/estado`,
                                {
                                    method: "PUT"
                                }
                            );

                            const datos = await respuesta.json();

                            alert(datos.mensaje);

                            window.location.reload();

                        }}
                    >
                        <BlockIcon />
                    </IconButton>
                </>

            )
        }
    ];

    return (
        <>
            <div className="page-header">

                <div>

                    <h1>Docentes</h1>

                    <p>
                        Administración de docentes del Jardín de Niños Frida Kahlo.
                    </p>

                </div>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        console.log("CLICK");
                        navigate("/dashboard/docentes/nuevo");
                    }}
                >
                    Nuevo docente
                </Button>

            </div>

            <div className="tabla">

                <DataGrid
                    rows={filas}
                    columns={columnas}
                    pageSizeOptions={[10, 20]}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10
                            }
                        }
                    }}
                />

            </div>

        </>
    );

}

export default Docentes;