import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { Grid } from '@deer-ui/core';

const Container = styled.div`
  width: 980px;
  margin: 40px auto 0;
`;

const UIName = styled.div`
  font-size: 30px;
  margin-bottom: 20px;
`;

const UILogo = styled.div`
  font-size: 40px;
`;

const Desc = styled.div`
  font-size: 18px;
  margin-bottom: 20px;
  width: 500px;
  margin: 20px auto;
  line-height: 28px;
`;

const MainIntro = styled.div`
  text-align: center;
`;

const FeatherIntro = styled.div`
  margin-top: 50px;
`;

const FeatherIntroItem = styled.div`
`;

const HomePage = () => {
  return (
    <Container>
      <MainIntro>
        <UIName>
          Building Form Group by the easiest way.
        </UIName>
        <Desc>
          Deer ui is a Extendable's UI lib base on React
          , provide FormGenerator to help us to build form logic clearly
          , and also provide a useful Table to display data.
        </Desc>
        <Link
          className="btn theme hola"
          to="/docs/getting-started/">Getting Started</Link>
      </MainIntro>
      <FeatherIntro>
        <Grid container space={10}>
          <Grid lg={3} sm={6} xs={12}>
            <FeatherIntroItem>
              <h4>Typescript support</h4>
              <div>
                Base on typescript to construct
                , totally support code hint and type check, safe to use.
              </div>
            </FeatherIntroItem>
          </Grid>
          <Grid lg={3} sm={6} xs={12}>
            <FeatherIntroItem>
              <h4>Both Desktop and Mobile app support</h4>
              <div>
                Take into account the different between Desktop and Mobile web app
                , automate detect device and choice the right way to render.
              </div>
            </FeatherIntroItem>
          </Grid>
        </Grid>
      </FeatherIntro>
    </Container>
  );
};

export default HomePage;
