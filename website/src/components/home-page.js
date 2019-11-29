import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { Grid, Icon } from '@deer-ui/core';
import Showcase from './showcase';
import { Box } from './common';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 40px auto 0;
`;

const Wrapper = styled.div`
  /* background-color: #fafafa; */
  padding: 0.1px;
  font-size: 1.125rem;
  padding-bottom: 40px;
`;

const UIName = styled.div`
  font-size: 30px;
  margin-bottom: 20px;
`;

const UILogo = styled.img`
  /* font-size: 40px; */
  background-color: #376BFB;
  border-radius: 50%;
  width: 100px;
`;

const Desc = styled.div`
  font-size: 18px;
  width: 100%;
  max-width: 500px;
  margin: 40px auto;
  line-height: 28px;
`;

const MainIntro = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const FeatherIntro = styled.div`
  margin-bottom: 80px;
`;

const FeatherIntroItem = styled(Box)`
  height: 160px;
  padding: 10px;
`;

const HomePage = () => {
  return (
    <Wrapper>
      <Container>
        <MainIntro>
          <UIName>
          Building Form Group by the easiest way
          </UIName>
          <Desc>
          Deer ui is a Extendable's UI lib base on React
          , provide FormGenerator to help us to build form logic clearly
          , and also provide a useful Table to display data
          </Desc>
          <Link
            className="btn theme hola"
            to="/docs/getting-started/">
          Getting Started
            <Icon n="angle-right" classNames={['ml10']} />
          </Link>
        </MainIntro>
        <FeatherIntro>
          <Grid container space={10}>
            <Grid
              lg={3}
              sm={6}
              xs={12}>
              <FeatherIntroItem>
                <h4>Typescript support</h4>
                <div>
                Base on typescript to construct
                , totally support code hint and type check, safe to use.
                </div>
              </FeatherIntroItem>
            </Grid>
            <Grid
              lg={3}
              sm={6}
              xs={12}>
              <FeatherIntroItem>
                <h4>Devices support</h4>
                <div>
                Take into account the different between Desktop and Mobile web app
                , automate detect device and choice the right way to render.
                </div>
              </FeatherIntroItem>
            </Grid>
            <Grid
              lg={3}
              sm={6}
              xs={12}>
              <FeatherIntroItem>
                <h4>SSR support</h4>
                <div>
                Support both client side add server side render
                , like Gatsby and Next
                </div>
              </FeatherIntroItem>
            </Grid>
            <Grid
              lg={3}
              sm={6}
              xs={12}>
              <FeatherIntroItem>
                <h4>Extendable</h4>
                <div>
                Provide the extendable way to organiz each Component's relationship
                , like @deer-ui/core, @deer-ui/enhance-ui and @deer-ui/admin-scaffold
                </div>
              </FeatherIntroItem>
            </Grid>
          </Grid>
        </FeatherIntro>
        <Grid
          container
          direction="col"
          alignContent="center">
          <UILogo src={require('../images/logo.png')} />
        </Grid>
        <Showcase />
      </Container>
    </Wrapper>
  );
};

export default HomePage;
