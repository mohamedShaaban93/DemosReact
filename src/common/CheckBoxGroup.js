import React, { Component } from 'react';
import PropTypes from 'prop-types';

import View from './View';
import ScrollView from './ScrollView';
import { CHECK_BOX_DISPLAY_NAME } from '../utils/Constants';

class CheckBoxGroup extends Component {
  static propTypes = {
    name: PropTypes.string,
    initialValue: PropTypes.arrayOf(PropTypes.any),
    onChange: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    horizontal: PropTypes.bool,
    scrollable: PropTypes.bool,
    size: PropTypes.number,
    activeColor: PropTypes.string,
    normalColor: PropTypes.string,
    childrenMargin: PropTypes.number,
  };

  static defaultProps = {
    initialValue: [],
    childrenMargin: 2,
  };

  constructor(props) {
    super(props);

    this.state = {
      checkedValues: props.initialValue,
    };
  }

  onCheckBoxClicked = (value, index) => {
    if (!this.props.editable) return;
    const indexInArray = this.state.checkedValues.indexOf(value);

    let newList = [];
    if (indexInArray === -1) {
      newList = [...this.state.checkedValues, value];
      this.setState({
        checkedValues: newList,
      });
    } else {
      newList = [
        ...this.state.checkedValues.slice(0, indexInArray),
        ...this.state.checkedValues.slice(indexInArray + 1),
      ];
      this.setState({
        checkedValues: newList,
      });
    }

    if (this.props.onChange) {
      if (this.props.name) this.props.onChange(this.props.name, newList);
      else this.props.onChange(newList);
    }
  };

  render() {
    const {
      children,
      horizontal,
      scrollable,
      size,
      activeColor,
      normalColor,
      childrenMargin,
      ...rest
    } = this.props;

    let counter = 0;
    const nodes =
      children && children.map
        ? children.map((child, index) => {
            if (
              (child.type.WrappedComponent &&
                child.type.WrappedComponent.displayName ===
                  CHECK_BOX_DISPLAY_NAME) ||
              (child.type && child.type.displayName === CHECK_BOX_DISPLAY_NAME)
            ) {
              return React.cloneElement(child, {
                key: String(index),
                onPress: this.onCheckBoxClicked,
                checked:
                  this.state.checkedValues.indexOf(child.props.value) !== -1,
                size,
                activeColor,
                normalColor,
                index: counter++,
                mr: horizontal && scrollable ? childrenMargin : 0,
                mv: !horizontal ? childrenMargin : 0,
              });
            }

            return child;
          })
        : null;

    if (horizontal && scrollable) {
      return (
        <View row {...rest}>
          <ScrollView row>{nodes}</ScrollView>
        </View>
      );
    }
    if (horizontal) {
      return (
        <View stretch row stretchChildren spaceAround {...rest}>
          {nodes}
        </View>
      );
    }

    return (
      <View stretch {...rest}>
        {nodes}
      </View>
    );
  }
}

export default CheckBoxGroup;
