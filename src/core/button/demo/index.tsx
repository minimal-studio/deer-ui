import React, { useState } from 'react';
import { Button } from '..';

export default () => (
  <div>
    <Button
      size="lg"
      className="mr10">
    Large
    </Button>
    <Button
      size="md"
      color="green"
      className="mr10">
    Middle
    </Button>
    <Button
      size="sm"
      color="orange"
      className="mr10">
    Small
    </Button>
  </div>
);
