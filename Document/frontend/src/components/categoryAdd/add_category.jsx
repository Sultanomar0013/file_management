import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Typography, Box, Button, Modal, TextField, Grid,
} from "@mui/material";
import axios from 'axios';



function AddCategory() {
  const [rows, setRows] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [errorFetch, setErrorFetch] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const backendUrl = import.meta.env.VITE_ADRESS;

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    setSelectedRow(null);
    setIsEditing(false);
  };

  const fetchCategories = async () => {
    setLoadingFetch(true);
    try {
      const res = await axios.get(`${backendUrl}category`, {
        withCredentials: true, // this tells the browser to send cookies
      });
      setRows(res.data);
      setErrorFetch(null);
    } catch (err) {
      setErrorFetch('Failed to fetch categories');
    } finally {
      setLoadingFetch(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}category`, selectedRow, {
        withCredentials: true, // this tells the browser to send cookies
      });
      fetchCategories();
      handleClose();
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };


  const updateModelSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendUrl}category/${selectedRow.id}`, selectedRow,  {
        withCredentials: true
    });
      fetchCategories();
      handleClose();
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const openUpdateModel = (row) => {
    setSelectedRow(row);
    setIsEditing(true);
    handleOpen();
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const columns = [
    { field: 'id', headerName: 'Id', width: 150 },
    { field: 'category_name', headerName: 'Category Name', width: 300 },
    { field: 'category_details', headerName: 'Category Details', width: 400 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button variant="contained" onClick={() => openUpdateModel(params.row)}>
            View
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6">Category List</Typography>
        <Button variant="contained" onClick={() => { setSelectedRow({ category_name: '', category_details: '' }); handleOpen(); }}>Add Category</Button>

        <Modal open={openModal} onClose={handleClose}>
          <Box sx={style}>
            <form onSubmit={isEditing ? updateModelSubmit : handleSubmit}>
              <Typography variant="h6" sx={{ p: 1 }} gutterBottom>
                    {isEditing ? 'Edit Category' : 'Add Category'}
              </Typography>
              <Grid container spacing={2}>
                <Grid item  sx={{ p: 1, width: '100%' }}>

                  <TextField
                    fullWidth
                    label="Category Name"
                    value={selectedRow?.category_name || ''}
                    onChange={(e) => setSelectedRow({ ...selectedRow, category_name: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sx={{ p: 1, width: '100%'  }}>
                  <TextField
                    fullWidth
                    label="Category Details"
                    value={selectedRow?.category_details || ''}
                    onChange={(e) => setSelectedRow({ ...selectedRow, category_details: e.target.value })}
                    multiline
                    rows={4}
                    required
                  />
                </Grid>
                <Grid item xs={12} sx={{ p: 1 }}>
                  <Button type="submit" variant="contained" fullWidth>
                    {isEditing ? 'Update' : 'Submit'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Modal>

        <Box sx={{ height: 600, width: '95%', mt: 2 }}>
          {loadingFetch ? (
            <p>Loading...</p>
          ) : errorFetch ? (
            <p>Error: {errorFetch}</p>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.id}
              loading={loadingFetch}
              slots={{ toolbar: GridToolbar }}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              pageSizeOptions={[10, 20, 50]}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default AddCategory;
