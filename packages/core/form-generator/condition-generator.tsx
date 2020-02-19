/* eslint-disable consistent-return */
import React, { forwardRef } from 'react';

import { FormOptionsItem } from './form-filter';
import FormGenerator, { FormGeneratorProps } from './form-generator';

export type ConditionOptions = FormOptionsItem[];

export interface ConditionGeneratorProps extends FormGeneratorProps {
  /** 查询条件的配置 */
  conditionConfig: ConditionOptions;
}

const defaultProps = {
  className: "condition-group"
};

const ConditionGenerator = forwardRef<FormGenerator, ConditionGeneratorProps>((props, ref?) => {
  return (
    <FormGenerator
      {...props}
      ref={ref}
      defaultLayout="flow"
      formOptions={props.conditionConfig}
    />
  );
});

ConditionGenerator.defaultProps = defaultProps;

export default ConditionGenerator;
