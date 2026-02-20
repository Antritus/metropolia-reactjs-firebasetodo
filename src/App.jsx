import {useEffect, useState} from "react";
import {AgGridReact} from "ag-grid-react";

import {ModuleRegistry, AllCommunityModule} from 'ag-grid-community';

import "./App.css"

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {AppBar, Button, Toolbar, Typography} from "@mui/material";
import AddTodo from "./components/AddTodo.jsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
    const [todos, setTodos] = useState([]);

    const columnDefs = [
        {field: "description", sortable: true, filter: true},
        {field: "date", sortable: true, filter: true},
        {field: "priority", sortable: true, filter: true},
        {
            headerName: '',
            field: 'id',
            width: 90,
            cellRenderer: params =>
                <IconButton onClick={() => deleteTodo(params.value)} size="small" color="error">
                    <DeleteIcon />
                </IconButton>,
            sortable: true
        }
    ];
    const fetchItems = async () => {
        console.log(import.meta.env.VITE_API_URL)
        try {
            const response = await fetch(
                import.meta.env.VITE_API_URL
            );

            const data = await response.json();

            if (!data.documents) {
                setTodos([]);
                return;
            }

            const actualData = data.documents.map(doc => ({
                description: doc.fields?.description?.stringValue || "",
                date: doc.fields?.date?.stringValue || "",
                priority: doc.fields?.priority?.stringValue || "",
                value: fixId(doc.fields?.name || "")
            }));

            setTodos(actualData);
        } catch (err) {
            console.error(err);
        }
    };

    const addTodo = (newTodo) => {
        let fields = {
            "description": {
                "stringValue": newTodo.description,
            },
            "priority": {
                "stringValue": newTodo.priority,
            },
            "date": {
                "stringValue": newTodo.date,
            }
        };

        const json = {
            "fields": fields
        };

        fetch(import.meta.env.VITE_API_URL,
            {
                method: "POST",
                body: JSON.stringify(json)
            }).then(response=>fetchItems())
            .catch(err=> console.error(err));
    }

    const fixId = (name) => {
        return name.substring(name.lastIndexOf("/")+1, name.length);
    }

    const deleteTodo = (id) => {
        const url = `${import.meta.env.VITE_API_URL}/${id}.json`
        fetch(url,
            {
                method: 'DELETE',
            })
            .then(response => fetchItems())
            .catch(err => console.error(err))
    }


    useEffect(() => {
        fetchItems();
    }, []);
    return (
        <>
            <div className="App">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h5">
                            TodoList
                        </Typography>
                    </Toolbar>
                </AppBar>
                <AddTodo addTodo={addTodo}/>
                <div className="ag-theme-alpine" style={{height: 500, width: 700, justifyContent: "center"}}>
                    <AgGridReact
                        theme="legacy"
                        rowData={todos}
                        columnDefs={columnDefs}
                        pagination={true}
                        paginationPageSize={10}
                    />
                </div>
            </div>
        </>
    );
}

export default App;
