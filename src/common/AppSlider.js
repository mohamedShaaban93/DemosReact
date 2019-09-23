import React, { Component } from 'react';
import { Slider } from 'react-native';
import I18n from 'react-native-i18n';
import PropTypes from 'prop-types';

export default class AppSlider extends Component {
  static propTypes = {
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    disabled: PropTypes.bool,
    maximumValue: PropTypes.number,
    minimumTrackTintColor: PropTypes.string,
    minimumValue: PropTypes.number,
    onValueChange: PropTypes.func,
    step: PropTypes.number,
    maximumTrackTintColor: PropTypes.string,
    value: PropTypes.number,
    thumbTintColor: PropTypes.string,
  };

  static defaultProps = {
    disabled: false,
    onValueChange: () => {},
    minimumTrackTintColor: '#F56363',
    step: 2,
    thumbTintColor: '#F56363',
  };

  render() {
    const {
      style,
      step,
      minimumValue,
      maximumValue,
      onValueChange,
      value,
      thumbTintColor,
      ...rest
    } = this.props;
    return (
      <Slider
        {...rest}
        style={style}
        minimumValue={minimumValue}
        setp={step}
        maximumValue={maximumValue}
        onValueChange={onValueChange}
        value={value}
        thumbTintColor={thumbTintColor}
        trackStyle={{
          height: 20,
          color: 'green',
        }}
      />
    );
  }
}
