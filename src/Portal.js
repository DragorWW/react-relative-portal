import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { canUseDOM } from 'exenv';

export default class Portal extends React.Component {

  static propTypes = {
    onOutClick: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    if (canUseDOM) {
      this.node = document.createElement('div');
      document.body.appendChild(this.node);

      this.root = null;
      this.handleRootRef = (root) => {
        this.root = root;
      };

      this.handleOutClick = (e) => {
        const { onOutClick } = this.props;
        if (this.root && !this.root.contains(e.target)  && typeof onOutClick === 'function') {
          onOutClick(e);
        }
        if (!this.root && typeof onOutClick === 'function') {
          onOutClick(e);
        }
      };

      document.addEventListener('click', this.handleOutClick, true);
    }
  }

  componentWillUpdate({ onOutClick, ...props }) {  // eslint-disable-line no-unused-vars
    // It's recommended to use `ref` callbacks instead of `findDOMNode`. https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md
    ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      <div {...props} ref={this.handleRootRef} />,
      this.node
    );
  }

  componentWillUnmount() {
    if (canUseDOM) {
      document.removeEventListener('click', this.handleOutClick, true);
      document.body.removeChild(this.node);
    }
  }

  render() {
    return null;
  }

}
