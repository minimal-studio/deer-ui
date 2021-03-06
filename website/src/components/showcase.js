import React from 'react';
import { Grid } from '@deer-ui/core';
import styled from 'styled-components';

import { Box, Container } from './common';

const ShowcaseContainer = styled(Container)`
  padding: 0.1px 0;
`;

const ShowcaseItem = styled(Box)`
  border: 1px solid #EEE;
`;

const ShowcaseImg = styled.img`
  max-width: 100%;
`;

const showcaseItems = [
  {
    title: 'react-ui-doc',
    img: require('../images/react-ui-doc-pic.jpg'),
    action: () => {
      window.open('https://react-ui-doc.thinkmore.xyz/');
    }
  },
  {
    title: 'admin-scaffold',
    img: require('../images/scaffold.jpg'),
    action: () => {
      window.open('https://scaffold.thinkmore.xyz/');
    }
  },
  {
    title: 'elk-chat',
    img: require('../images/chat.jpg'),
    action: () => {
      window.open('https://chat.thinkmore.xyz/');
    }
  },
  {
    title: 'gatsby-theme-elk',
    img: require('../images/react-ui-doc-pic.jpg'),
    action: () => {
      window.open('https://thinkmore.xyz/');
    }
  },
];

const Showcase = () => {
  return (
    <ShowcaseContainer>
      <h3 className="text-center">Showcases</h3>
      <Grid container space={20}>
        {
          showcaseItems.map(({ title, action, img }) => {
            return (
              <Grid
                key={title}
                lg={4}
                sm={6}
                xs={12}>
                <ShowcaseItem onClick={(e) => {
                  action && action();
                }}>
                  <ShowcaseImg src={img} alt={title} />
                  <h4 className="ps10">{title}</h4>
                </ShowcaseItem>
              </Grid>
            );
          })
        }
      </Grid>
    </ShowcaseContainer>
  );
};

export default Showcase;
