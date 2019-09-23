import React, { Component } from 'react';
import PropTypes from 'prop-types';

import View from './View';
import ScrollView from './ScrollView';
import { AppInputError } from '.';
import { RADIO_BUTTON_DISPLAY_NAME } from '../utils/Constants';

class RadioGroup extends Component {
  static propTypes = {
    name: PropTypes.string,
    initialValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onSelect: PropTypes.func,
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
    deselect: PropTypes.bool,
  };

  static defaultProps = {
    initialValue: -1,
    childrenMargin: 2,
    deselect: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedValue: props.initialValue,
    };
  }

  onRadioButtonSelect = (value, index) => {
    if (!this.props.editable) return;
    let v = value;
    if (value === this.state.selectedValue) {
      if (this.props.deselect) {
        this.setState({
          selectedValue: null,
        });
        v = null;
      } else return;
    } else {
      this.setState({
        selectedValue: value,
      });
    }

    if (this.props.onSelect) {
      if (this.props.name)
        this.props.onSelect(this.props.name, v, v !== this.state.selectedValue);
      else this.props.onSelect(v, v !== this.state.selectedValue);
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
      error,
      showError,
      ...rest
    } = this.props;

    let counter = 0;
    const nodes = React.Children.map(children, (child, index) => {
      if (
        (child.type.WrappedComponent &&
          child.type.WrappedComponent.displayName ===
            RADIO_BUTTON_DISPLAY_NAME) ||
        (child.type && child.type.displayName === RADIO_BUTTON_DISPLAY_NAME)
      ) {
        return React.cloneElement(child, {
          key: String(index),
          onPress: this.onRadioButtonSelect,
          selected: child.props.value === this.state.selectedValue,
          size,
          activeColor,
          normalColor,
          index: counter++,
          mr: horizontal && scrollable ? childrenMargin : 0,
          mv: !horizontal ? childrenMargin : 0,
        });
      }
      return child;
    });

    if (horizontal && scrollable) {
      return (
        <View row {...rest}>
          <ScrollView horizontal>{nodes}</ScrollView>
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
      <>
        <View stretch {...rest}>
          {nodes}
        </View>
        {error && showError && (
          <AppInputError error={error} errorTextMarginHorizontal={5} size={5} />
        )}
      </>
    );
  }
}

export default RadioGroup;
