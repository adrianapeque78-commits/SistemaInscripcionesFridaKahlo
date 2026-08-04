DROP TABLE IF EXISTS documentacion CASCADE;
DROP TABLE IF EXISTS salud CASCADE;
DROP TABLE IF EXISTS alumno_tutor CASCADE;
DROP TABLE IF EXISTS tutores CASCADE;
DROP TABLE IF EXISTS domicilios CASCADE;
DROP TABLE IF EXISTS alumnos CASCADE;

CREATE TABLE alumnos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    curp VARCHAR(18) UNIQUE NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo VARCHAR(20) NOT NULL
);

CREATE TABLE domicilios (
    id SERIAL PRIMARY KEY,
    alumno_id INTEGER UNIQUE NOT NULL,
    calle VARCHAR(150),
    numero VARCHAR(20),
    colonia VARCHAR(150),
    codigo_postal VARCHAR(10),
    municipio VARCHAR(100),
    estado VARCHAR(100),

    CONSTRAINT fk_domicilio_alumno
        FOREIGN KEY(alumno_id)
        REFERENCES alumnos(id)
        ON DELETE CASCADE
);

CREATE TABLE tutores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    curp VARCHAR(18),
    telefono VARCHAR(20),
    correo VARCHAR(120),
    ocupacion VARCHAR(120),
    escolaridad VARCHAR(120)
);

CREATE TABLE alumno_tutor (
    id SERIAL PRIMARY KEY,
    alumno_id INTEGER NOT NULL,
    tutor_id INTEGER NOT NULL,
    parentesco VARCHAR(30),
    es_principal BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_alumno
        FOREIGN KEY(alumno_id)
        REFERENCES alumnos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tutor
        FOREIGN KEY(tutor_id)
        REFERENCES tutores(id)
        ON DELETE CASCADE
);

CREATE TABLE salud (
    id SERIAL PRIMARY KEY,
    alumno_id INTEGER UNIQUE NOT NULL,
    tipo_sangre VARCHAR(10),
    alergias TEXT,
    padecimientos TEXT,
    servicio_medico VARCHAR(100),
    institucion VARCHAR(100),
    numero_afiliacion VARCHAR(100),
    medico_tratante VARCHAR(150),
    telefono_emergencia VARCHAR(20),

    CONSTRAINT fk_salud_alumno
        FOREIGN KEY(alumno_id)
        REFERENCES alumnos(id)
        ON DELETE CASCADE
);

CREATE TABLE documentacion (
    id SERIAL PRIMARY KEY,
    alumno_id INTEGER UNIQUE NOT NULL,
    acta BOOLEAN DEFAULT FALSE,
    curp BOOLEAN DEFAULT FALSE,
    cartilla BOOLEAN DEFAULT FALSE,
    ine_madre BOOLEAN DEFAULT FALSE,
    ine_padre BOOLEAN DEFAULT FALSE,
    comprobante BOOLEAN DEFAULT FALSE,
    observaciones TEXT,

    CONSTRAINT fk_documentacion_alumno
        FOREIGN KEY(alumno_id)
        REFERENCES alumnos(id)
        ON DELETE CASCADE
);