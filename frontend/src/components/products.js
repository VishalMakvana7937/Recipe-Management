import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const RecipeForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    cuisineType: '',
    cookingTime: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/create-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.status === 'ok') {
        alert('Recipe created successfully!');
        // Optionally, reset the form after submission
        setFormData({
          title: '',
          ingredients: '',
          instructions: '',
          cuisineType: '',
          cookingTime: '',
        });
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to create recipe');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Create Recipe
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          fullWidth
          id="title"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <TextField
          margin="normal"
          fullWidth
          id="ingredients"
          label="Ingredients"
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          required
          multiline
          rows={4}
        />
        <TextField
          margin="normal"
          fullWidth
          id="instructions"
          label="Instructions"
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          required
          multiline
          rows={4}
        />
        <TextField
          margin="normal"
          fullWidth
          id="cuisineType"
          label="Cuisine Type"
          name="cuisineType"
          value={formData.cuisineType}
          onChange={handleChange}
          required
        />
        <TextField
          margin="normal"
          fullWidth
          id="cookingTime"
          label="Cooking Time (in minutes)"
          name="cookingTime"
          type="number"
          value={formData.cookingTime}
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Create Recipe
        </Button>
      </Box>
    </Container>
  );
};

export default RecipeForm;
