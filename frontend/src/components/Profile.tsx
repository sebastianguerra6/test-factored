import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Avatar,
} from '@mui/material';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { User } from '../types';
import { api } from '../services/api';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const Profile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (username) {
                    const data = await api.getProfile(username);
                    setUser(data);
                }
            } catch (err) {
                setError('Failed to load profile');
            }
        };

        fetchProfile();
    }, [username]);

    if (error) {
        return (
            <Container>
                <Typography color="error" variant="h5" sx={{ mt: 4 }}>
                    {error}
                </Typography>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container>
                <Typography variant="h5" sx={{ mt: 4 }}>
                    Loading...
                </Typography>
            </Container>
        );
    }

    const chartData = {
        labels: user.skills.map((skill) => skill.name),
        datasets: [
            {
                label: 'Skill Level',
                data: user.skills.map((skill) => skill.level * 100),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            r: {
                angleLines: {
                    display: true,
                },
                suggestedMin: 0,
                suggestedMax: 100,
            },
        },
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        flex: { md: '0 0 33.333%' }
                    }}>
                        <Avatar
                            src={user.avatar_url}
                            sx={{ width: 200, height: 200, mb: 2 }}
                        />
                        <Typography variant="h4" gutterBottom>
                            {user.name}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {user.position}
                        </Typography>
                    </Box>
                    <Box sx={{ flex: { md: '0 0 66.666%' } }}>
                        <Box sx={{ height: 400 }}>
                            <Typography variant="h5" gutterBottom>
                                Skills
                            </Typography>
                            <Radar data={chartData} options={chartOptions} />
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile; 