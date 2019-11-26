import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { Grid } from '@deer-ui/core';

const Container = styled.div`
  width: 980px;
  margin: 40px auto 0;
`;

const UIName = styled.div`
  font-size: 40px;
  margin-bottom: 20px;
`;

const UILogo = styled.div`
  font-size: 40px;
`;

const Desc = styled.div`
  font-size: 18px;
  margin-bottom: 20px;
`;

const HomePage = () => {
  return (
    <Container>
      <Grid container>
        <Grid lg={4}>
          <UILogo>@deer-ui</UILogo>
        </Grid>
        <Grid lg={8}>
          <UIName>Deer UI</UIName>
          <Desc>
            可扩展的 UI 库
          </Desc>
          <Link
            className="btn theme hola"
            to="/docs/getting-started/">Getting Started</Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
