import React, { useState } from 'react';
import { Card, CardContainer } from '..';
import { Grid } from '../../grid';

export default () => (
  <CardContainer>
    <Grid container space={20}>
      <Grid item xs={12} sm={6} lg={6}>
        <Card p={20}>
          ukelli-ui 是基于 React 的 UI 库，提供简约和功能齐全的组件，可高度定制的组件接口，灵活的配置，提供给开发者另一种开发思路，也致力于尝试不同的组件使用和开发方向。
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} lg={6}>
        <Card p={20}>
          ukelli-ui 是基于 React 的 UI 库，提供简约和功能齐全的组件，可高度定制的组件接口，灵活的配置，提供给开发者另一种开发思路，也致力于尝试不同的组件使用和开发方向。
        </Card>
      </Grid>
      <Grid item xs={12} sm={4} lg={4}>
        <Card p={20}>
          ukelli-ui 是基于 React 的 UI 库，提供简约和功能齐全的组件，可高度定制的组件接口，灵活的配置，提供给开发者另一种开发思路，也致力于尝试不同的组件使用和开发方向。
        </Card>
      </Grid>
      <Grid item xs={12} sm={8} lg={8}>
        <Card p={20}>
          ukelli-ui 是基于 React 的 UI 库，提供简约和功能齐全的组件，可高度定制的组件接口，灵活的配置，提供给开发者另一种开发思路，也致力于尝试不同的组件使用和开发方向。
        </Card>
      </Grid>
      <Grid item xs={12} sm={8} lg={8}>
        <Card p={20}>
          ukelli-ui 是基于 React 的 UI 库，提供简约和功能齐全的组件，可高度定制的组件接口，灵活的配置，提供给开发者另一种开发思路，也致力于尝试不同的组件使用和开发方向。
        </Card>
      </Grid>
      <Grid item xs={12} sm={4} lg={4}>
        <Card p={20}>
          ukelli-ui 是基于 React 的 UI 库，提供简约和功能齐全的组件，可高度定制的组件接口，灵活的配置，提供给开发者另一种开发思路，也致力于尝试不同的组件使用和开发方向。
        </Card>
      </Grid>
    </Grid>
  </CardContainer>
);
