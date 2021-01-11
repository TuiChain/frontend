import React, { useState } from "react";
import {
  Typography,
  Box,
  Grid,
  CardContent,
  Card,
  CardActions,
  Button,
} from "@material-ui/core";

const Home = () => {
  const [active_request /*,  setActiveRequest*/] = useState(null);
  return (
    <Box>
      <Typography variant="h2" color="secondary">
        Welcome, user.name!
      </Typography>
      <Box paddingTop={3}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h3" color="secondary" gutterBottom>
                  Active request
                </Typography>

                <Typography variant="body2" component="p">
                  {active_request ? <>TODO</> : <>No active request...</>}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Card>
                <CardContent>
                  <Typography variant="h3" color="secondary" gutterBottom>
                    Investments
                  </Typography>

                  <Typography variant="body2" component="p">
                    {active_request ? <>TODO</> : <>No active request...</>}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box paddingTop={4}>
            <Card>
              <CardContent>
                <Typography variant="h3" color="secondary" gutterBottom>
                  Featured Requests
                </Typography>

                <Typography variant="body2" component="p">
                  {active_request ? <>TODO</> : <>No active request...</>}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
