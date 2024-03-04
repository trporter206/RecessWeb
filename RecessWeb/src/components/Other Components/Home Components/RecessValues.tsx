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
                  Games
                </Typography>
                <Typography variant="h5">
                  {
                    'Quickly set up or find games in your neighborhood. If you’re not sure where you want to play, Recess always has a featured game going on around town.'
                  }
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Groups2Icon sx={{ height: 80, width: 80, color: 'primary' }} />
                <Typography variant="h6" sx={{ my: 5 }}>
                  Tournaments (soon)
                </Typography>
                <Typography variant="h5">
                  {
                    'We run remote tournaments that you can participate in at your own pace and schedule, with real prizes!'
                  }
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <EmojiEventsIcon sx={{ height: 80, width: 80, color: 'primary' }} />
                <Typography variant="h6" sx={{ my: 5 }}>
                  Leagues
                </Typography>
                <Typography variant="h5">
                  {
                    'Create or join local leagues that fit your play style. Whether you want to improve skills, meet new people, or just have fun, Recess has a league for you.'
                  }
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }
  
  export default RecessValues;