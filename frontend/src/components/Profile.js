import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from 'recharts';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8001/profile/${username}`);
        if (!response.ok) {
          throw new Error('Profile not found');
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!profile) {
    return null;
  }

  // Transform skills data for radar chart
  const radarData = profile.skills.map(skill => ({
    subject: skill.name,
    A: skill.level * 100,
    fullMark: 100
  }));

  return (
    <Container maxWidth="md">
      <StyledPaper elevation={3}>
        <Box sx={{ width: '100%', mb: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src={profile.avatar_url}
                alt={profile.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                {profile.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {profile.position}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
                Skills
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <ResponsiveContainer width={500} height={500}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#666" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#666', fontSize: 16 }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={{ fill: '#666', fontSize: 14 }}
                    />
                    <Radar
                      name="Skills"
                      dataKey="A"
                      stroke="#1976d2"
                      fill="#1976d2"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Profile; 