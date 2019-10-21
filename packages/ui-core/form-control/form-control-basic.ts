import { UkeComponent } from '../utils/uke-component';

export interface FormControlBasicProps {
  value?: any;
  defaultValue?: any;
}

export default class FormControlBasic<
  P extends FormControlBasicProps, S = {}, SS = any
> extends UkeComponent<P, S, SS> {
  isControl: boolean;

  value;

  stateValueMark = 'selectedValue';

  constructor(props) {
    super(props);

    const { value, defaultValue } = props;

    // 如果是多选模式，value, defaultValue 必须为array，否则value, defaultValue必须为string

    this.isControl = props.hasOwnProperty('value');
    this.value = value || defaultValue;
  }

  getValue = (
    stateValueMark = this.stateValueMark
  ) => (this.isControl ? this.props.value : this.state[stateValueMark])
}
