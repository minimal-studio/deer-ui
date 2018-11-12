import React from 'react';
import { ToolTip } from '.';

export default class ForTesting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }
  render() {
    const { position } = this.props;
    const { isOpen } = this.state;
    return (
      <span className="mr20">
        <ToolTip
          onClick={e => this.setState({
            isOpen: !isOpen
          })}
          position={position}
          title={!isOpen ? "打开书" : "关闭书"}
          n={isOpen ? "book-open" : "book"}/>
      </span>
    );
  }
}