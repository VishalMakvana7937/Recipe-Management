import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Button,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
  marginBottom: '20px',
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  fontSize: '1.25rem',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: '16px',
  flexGrow: 1,
}));

const ViewRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editRecipe, setEditRecipe] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-recipes');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRecipes(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleEditClick = (recipe) => {
    setEditRecipe(recipe);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
    if (confirmDelete) {
      try {
        await fetch(`http://localhost:5000/delete-recipe/${id}`, {
          method: 'DELETE',
        });
        setRecipes(recipes.filter(recipe => recipe._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { title, ingredients, instructions, cuisineType, cookingTime } = editRecipe;

    try {
      const response = await fetch(`http://localhost:5000/edit-recipe/${editRecipe._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, ingredients, instructions, cuisineType, cookingTime }),
      });

      const updatedRecipe = await response.json();
      setRecipes(recipes.map(recipe => recipe._id === updatedRecipe.data._id ? updatedRecipe.data : recipe));
      setOpenEditDialog(false);
      setEditRecipe(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Filter recipes based on search query
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box padding={4}>
      <TextField
        variant="outlined"
        fullWidth
        label="Search by Title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        margin="normal"
      />
      <Grid container spacing={3}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe._id}>
              <StyledCard>
                <CardContent>
                  <StyledTitle variant="h5" gutterBottom>
                    {recipe.title}
                  </StyledTitle>
                  <Typography variant="body2" paragraph>
                    {recipe.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ingredients: {recipe.ingredients.join(', ')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cuisine Type: {recipe.cuisineType}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cooking Time: {recipe.cookingTime} minutes
                  </Typography>
                  <Box display="flex" justifyContent="space-between" marginTop={2}>
                    <StyledButton variant="contained" color="primary" onClick={() => handleEditClick(recipe)}>
                      Edit
                    </StyledButton>
                    <StyledButton variant="outlined" color="secondary" onClick={() => handleDeleteClick(recipe._id)}>
                      Delete
                    </StyledButton>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              No recipes found
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Edit Recipe Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Recipe</DialogTitle>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <TextField
              label="Title"
              fullWidth
              value={editRecipe?.title || ''}
              onChange={(e) => setEditRecipe({ ...editRecipe, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              label="Ingredients (comma separated)"
              fullWidth
              value={editRecipe?.ingredients.join(', ') || ''}
              onChange={(e) => setEditRecipe({ ...editRecipe, ingredients: e.target.value.split(', ') })}
              margin="normal"
              required
            />
            <TextField
              label="Instructions"
              fullWidth
              value={editRecipe?.instructions || ''}
              onChange={(e) => setEditRecipe({ ...editRecipe, instructions: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              label="Cuisine Type"
              fullWidth
              value={editRecipe?.cuisineType || ''}
              onChange={(e) => setEditRecipe({ ...editRecipe, cuisineType: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              label="Cooking Time (minutes)"
              fullWidth
              type="number"
              value={editRecipe?.cookingTime || ''}
              onChange={(e) => setEditRecipe({ ...editRecipe, cookingTime: e.target.value })}
              margin="normal"
              required
            />
            <DialogActions>
              <Button onClick={() => setOpenEditDialog(false)} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ViewRecipe;
