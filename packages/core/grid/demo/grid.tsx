import React from 'react';
import { Grid } from '..';
import { CardContainer, Card } from '../..';

function Example() {
  return (
    <CardContainer className="bg_default">
      <Grid container space={5}>
        <Grid
          xs={12}
          sm={10}
          md={8}
          lg={6}
          xl={4}
        >
          <Card p={20}>
            xs-12 sm-10 md-8 lg-6 xl-4
          </Card>
        </Grid>
        <Grid
          xs={12}
          sm={10}
          md={8}
          lg={6}
          xl={4}
        >
          <Card p={20}>
            xs-12 sm-10 md-8 lg-6 xl-4
          </Card>
        </Grid>
        <Grid
          xs={12}
          sm={10}
          md={8}
          lg={6}
          xl={4}
        >
          <Card
            p={20}
          >
            xs-12 sm-10 md-8 lg-6 xl-4
          </Card>
        </Grid>
        <Grid
          xs={12}
          sm={10}
          md={8}
          lg={6}
          xl={4}
        >
          <Card
            p={20}
          >
            xs-12 sm-10 md-8 lg-6 xl-4
          </Card>
        </Grid>
        <Grid
          xs={12}
          sm={10}
          md={8}
          lg={6}
          xl={4}
        >
          <Card
            p={20}
          >
            xs-12 sm-10 md-8 lg-6 xl-4
          </Card>
        </Grid>
        <Grid
          xs={12}
          sm={10}
          md={8}
          lg={6}
          xl={4}
        >
          <Card
            p={20}
          >
            xs-12 sm-10 md-8 lg-6 xl-4
          </Card>
        </Grid>
      </Grid>
    </CardContainer>
  );
}
// render(<Example />);
