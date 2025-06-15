import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const SkillInput = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    position: '',
    skills: [
      { name: '', level: 0.5 }
    ]
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...formData.skills];
    newSkills[index] = {
      ...newSkills[index],
      [field]: field === 'level' ? parseFloat(value) : value
    };
    setFormData(prev => ({
      ...prev,
      skills: newSkills
    }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 0.5 }]
    }));
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Registration failed');
      }

      // Registration successful, navigate to login
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5">
          Create New Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Skills
              </Typography>
              {formData.skills.map((skill, index) => (
                <SkillInput key={index}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={5}>
                      <TextField
                        required
                        fullWidth
                        label="Skill Name"
                        value={skill.name}
                        onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        required
                        fullWidth
                        type="number"
                        label="Skill Level (0-1)"
                        inputProps={{ min: 0, max: 1, step: 0.1 }}
                        value={skill.level}
                        onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        color="error"
                        onClick={() => removeSkill(index)}
                        disabled={formData.skills.length === 1}
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                </SkillInput>
              ))}
              <Button
                variant="outlined"
                onClick={addSkill}
                sx={{ mt: 1 }}
              >
                Add Skill
              </Button>
            </Grid>
          </Grid>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
          >
            Already have an account? Login
          </Button>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default RegisterForm; 