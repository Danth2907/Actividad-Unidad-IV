import React, { useState, useEffect } from 'react';
import './App.css';

interface Meta {
  id: number; 
  nombre: string;
  descripcion: string;
  fecha: string;
}

const App = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInput, setFechaInput] = useState('');
  const [fecha, setFecha] = useState('');
  const [metas, setMetas] = useState<Meta[]>([]);

  useEffect(() => {
    fetch('/getTasks')
      .then(response => response.json())
      .then(data => setMetas(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const agregarMeta = () => {
    const nuevaMeta: Meta = {
      id: Date.now(), 
      nombre: nombre,
      descripcion: descripcion,
      fecha: fecha
    };
    fetch('/addTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaMeta)
    })
      .then(() => {
        setMetas([...metas, nuevaMeta]);
        setNombre('');
        setDescripcion('');
        setFecha('');
        setFechaInput('');
      })
      .catch(error => console.error('Error adding task:', error));
  };

  const eliminarMeta = (id: number) => {
    fetch('/removeTask', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ taskId: id })
    })
      .then(() => {
        const nuevasMetas = metas.filter(meta => meta.id !== id);
        setMetas(nuevasMetas);
      })
      .catch(error => console.error('Error removing task:', error));
  };

  const validateDate = (value: string) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFechaInput(value);
    if (validateDate(value)) {
      setFecha(value);
    }
  };

  return (
    <div className="container">
      <h2>Lista de Metas</h2>
      <div className="form">
        <p>Ingrese un nombre</p>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <p>Ingrese Descripcion</p>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <p>Ingrese Fecha (formato: DD/MM/AAAA)</p>
        <input
          type="text"
          value={fechaInput}
          onChange={handleDateChange}
        />
        <button onClick={agregarMeta}>Enviar</button>
      </div>

      <div className="list">
        {metas.map((meta, index) => (
          <div key={index} className="meta">
            <p>Nombre: {meta.nombre}</p>
            <p>Descripcion: {meta.descripcion}</p>
            <p>Fecha: {meta.fecha}</p>
            <button onClick={() => eliminarMeta(meta.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

