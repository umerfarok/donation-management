import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { Card, CardContent, Grid } from '@material-ui/core';

const LoadingCard = () => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Skeleton variant="rect" height={118} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="text" height={118} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="text" height={118} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="text" height={118} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LoadingCard;