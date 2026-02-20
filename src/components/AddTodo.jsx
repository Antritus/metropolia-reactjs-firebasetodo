import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useState} from "react";

function AddTodo(props) {
    const [open, setOpen] = useState(false);
    const [todo, setTodo] = useState({description: "", date: "", priority: ""})

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const handleSave = () => {
        props.addTodo(todo)
        handleClose()
    }

    const inputChanged = () => {
        setTodo({...todo, [event.target.name]: event.target.value});
    }
    return (
        <>
            <Button variant="outlined" onClick={handleOpen}>
                Add Todo
            </Button>
            <Dialog open={open}>
                <DialogTitle>New todo</DialogTitle>
                <DialogContent>
                    <TextField
                        name="description"
                        value={todo.description}
                        onChange={inputChanged}
                        margin="dense"
                        label="description"
                        fullWidth
                    />
                    <TextField
                        name="date"
                        value={todo.date}
                        onChange={inputChanged}
                        margin="dense"
                        label="date"
                        fullWidth
                    />
                    <TextField
                        name="priority"
                        value={todo.priority}
                        onChange={inputChanged}
                        margin="dense"
                        label="priority"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={handleClose}>Cancel</Button>
                    <Button color="primary" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AddTodo;