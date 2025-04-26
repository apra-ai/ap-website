import { Box, Button, Grid } from "@mui/material";

function Header() {
  return (
    <Box sx={{ width: '100%', backgroundColor: '#fff', padding: '16px 0', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', }}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Box sx={{ fontSize: '3rem', fontWeight: 'bold', color: '#333' }}>
            APRA AI
          </Box>
        </Grid>
      </Grid>
      <Box sx={{
        marginTop: '12px',
        height: '2px',

        borderRadius: '1px',
        margin: '10px 0',
      }} />
    </Box>
  );
}

export default Header;