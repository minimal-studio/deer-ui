import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { Grid, Icon } from '@deer-ui/core';

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

const ShowcaseContainer = styled.div`
  margin-top: 80px;
`;

const ShowcaseItem = styled.div`
`;

const HomePage = () => {
  return (
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
      <ShowcaseContainer>
        <h3 className="text-center">Showcases</h3>
        <Grid container>
          <Grid
            lg={3}
            sm={6}
            xs={12}>
            <ShowcaseItem>
              react-ui-doc
            </ShowcaseItem>
          </Grid>
          <Grid
            lg={3}
            sm={6}
            xs={12}>
            <ShowcaseItem>
              admin-scaffold
            </ShowcaseItem>
          </Grid>
          <Grid
            lg={3}
            sm={6}
            xs={12}>
            <ShowcaseItem>
              elk-chat
            </ShowcaseItem>
          </Grid>
        </Grid>
      </ShowcaseContainer>
    </Container>
  );
};

export default HomePage;
