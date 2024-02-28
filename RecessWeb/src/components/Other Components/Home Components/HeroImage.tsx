import { Box, Typography, Button, Grid } from '@mui/material';

interface HeroProps {
  backgroundImage: string;
}

function Hero({ backgroundImage }: HeroProps) {
  return (
    <Box sx={{ 
      backgroundImage: `url(${backgroundImage})`, // Template literal for image URL
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '600px',
      width: '100vw',
      marginTop: '80px',
    }}>
      <Grid 
        container 
        direction="column" 
        justifyContent="center" 
        alignItems="center" 
        sx={{ height: '100%', textAlign: 'center', color: 'white' }} 
      >
        <Grid item>
          <Typography variant="h2" gutterBottom>Recess</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5">Welcome to the new sports community</Typography>
        </Grid>
        <Grid item sx={{ mt: 3 }}> 
          <Button variant="contained">Start Exploring</Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Hero;
