import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import Groups2Icon from '@mui/icons-material/Groups2';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const item = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    px: 5,
  };
  
  function RecessValues() {
    return (
      <Box
        component="section"
        sx={{ display: 'flex', overflow: 'hidden'}}
      >
        <Container sx={{ mt: 15, mb: 30, display: 'flex', position: 'relative' }}>
          <Box
            component="img"
            src="/static/themes/onepirate/productCurvyLines.png"
            alt="curvy lines"
            sx={{ pointerEvents: 'none', position: 'absolute', top: -180 }}
          />
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <SportsFootballIcon sx={{ height: 80, width: 80, color: 'primary' }} /> 
                <Typography variant="h6" sx={{ my: 5 }}>
                  Built around our love of sports
                </Typography>
                <Typography variant="h5">
                  {
                    'Find local parks and play areas to practice your favorite sports. Create a game and invite your friends or take a chance to meet new players.'
                  }
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Groups2Icon sx={{ height: 80, width: 80, color: 'primary' }} />
                <Typography variant="h6" sx={{ my: 5 }}>
                  Your community is out there
                </Typography>
                <Typography variant="h5">
                  {
                    'Create or join a community of players who share your passion for sports. Set rules for who can join and organize events to play together.'
                  }
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <EmojiEventsIcon sx={{ height: 80, width: 80, color: 'primary' }} />
                <Typography variant="h6" sx={{ my: 5 }}>
                  Compete for real prizes
                </Typography>
                <Typography variant="h5">
                  {'By registering, you will access specially negotiated rates. Events and communities hosted by Recess provide top players with the opportunity to win prizes. '}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }
  
  export default RecessValues;